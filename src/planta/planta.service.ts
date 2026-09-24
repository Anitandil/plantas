import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Planta } from './planta.entity';
import { OrigenService } from '../origen/origen.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
import { QueryPlantaDto } from './dto/query-planta.dto';

@Injectable()
export class PlantaService {
  constructor(
    @InjectRepository(Planta)
    private plantaRepository: Repository<Planta>,
    @Inject(forwardRef(() => OrigenService))
    private readonly origenService: OrigenService,
  ) {}

  async existsByOrigenId(origenId: number): Promise<boolean> {
    const count = await this.plantaRepository.count({ where: { origenId } });
    return count > 0;
  }

  async findAll(query: QueryPlantaDto) {
    //query contiene los parametros enviados en la url
    //ej planta?nombre=ficus&clasificacion=Arbol&page=1&limit=10&format=short&sortBy=nombreCientifico&order=asc
    const formatData = (data: Planta[]) => {
      //define el formato de salida
      if (query.format === 'short') {
        return data.map(
          (p) => `${p.id}: ${p.nombreVulgar} (${p.nombreCientifico})`,
        );
      }
      return data;
    };

    const page = query.page ?? 1; //define valores predeterminados
    const limit = query.limit ?? 10; //si no se envia page usa1, si no se envia limit usa 10
    const queryBuilder = this.plantaRepository //crea la conulta con el query builder de TypeORM
      .createQueryBuilder('planta') //plnat es un lias para la tabla planta
      .leftJoinAndSelect('planta.origen', 'origen'); //une la tabla origen con la tabla planta y selecciona todos los campos de origen

    const nombre = query.nombre?.trim(); //filtra por nombre si se pide
    if (nombre) {
      //solo si el nombre no esta vacio
      queryBuilder.andWhere(
        new Brackets((builder) => {
          builder
            .where('LOWER(planta.nombreCientifico) LIKE LOWER(:nombre)', {
              nombre: `%${nombre}%`,
            })
            .orWhere('LOWER(planta.nombreVulgar) LIKE LOWER(:nombre)', {
              nombre: `%${nombre}%`,
            });
        }),
      );
    }

    if (query.clasificacion) {
      //filtra x clasificacion
      queryBuilder.andWhere('planta.clasificacion = :clasificacion', {
        clasificacion: query.clasificacion,
      });
    }

    const sortableFields: Record<string, string> = {
      //define los campos ordenables
      id: 'planta.id',
      nombreCientifico: 'planta.nombreCientifico',
      nombreVulgar: 'planta.nombreVulgar',
      clasificacion: 'planta.clasificacion',
      epocaFloracion: 'planta.epocaFloracion',
      origenId: 'planta.origenId',
    };
    if (query.sortBy) {
      queryBuilder.orderBy(
        sortableFields[query.sortBy],
        query.order === 'desc' ? 'DESC' : 'ASC',
      );
    }

    queryBuilder //crea laconsulta
      .addOrderBy('planta.id', 'ASC') //agrega orden secundario
      .skip((page - 1) * limit) //paginacion
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: formatData(data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Planta> {
    const planta = await this.plantaRepository.findOne({
      where: { id },
      relations: { origen: true },
    });
    if (!planta) {
      throw new NotFoundException(`La planta con ID ${id} no existe.`);
    }
    return planta;
  }

  async create(data: CreatePlantaDto): Promise<Planta> {
    const nombreCientifico = data.nombreCientifico?.trim();
    const nombreVulgar = data.nombreVulgar?.trim();

    if (!nombreCientifico || !nombreVulgar) {
      throw new BadRequestException(
        'Los campos nombre científico y nombre vulgar no pueden estar vacíos.',
      );
    }

    await this.origenService.findOne(data.origenId);

    const planta = this.plantaRepository.create({
      nombreCientifico,
      nombreVulgar,
      clasificacion: data.clasificacion,
      epocaFloracion: data.epocaFloracion?.trim() || undefined,
      origenId: data.origenId,
    });
    return this.plantaRepository.save(planta);
  }

  async update(id: number, data: UpdatePlantaDto): Promise<Planta> {
    const planta = await this.findOne(id);

    if (data.origenId !== undefined) {
      await this.origenService.findOne(data.origenId);
      planta.origenId = data.origenId;
    }

    if (data.nombreCientifico !== undefined) {
      const nombreCientifico = data.nombreCientifico.trim();
      if (!nombreCientifico) {
        throw new BadRequestException(
          'El nombre científico no puede estar vacío.',
        );
      }
      planta.nombreCientifico = nombreCientifico;
    }

    if (data.nombreVulgar !== undefined) {
      const nombreVulgar = data.nombreVulgar.trim();
      if (!nombreVulgar) {
        throw new BadRequestException('El nombre vulgar no puede estar vacío.');
      }
      planta.nombreVulgar = nombreVulgar;
    }

    if (data.clasificacion !== undefined) {
      planta.clasificacion = data.clasificacion;
    }

    if (data.epocaFloracion !== undefined) {
      planta.epocaFloracion = data.epocaFloracion.trim() || undefined;
    }

    return this.plantaRepository.save(planta);
  }

  async remove(id: number): Promise<{ message: string; planta: Planta }> {
    const planta = await this.findOne(id);
    await this.plantaRepository.delete(id);
    return {
      message: `La planta con ID ${id} fue eliminada correctamente.`,
      planta,
    };
  }
}
