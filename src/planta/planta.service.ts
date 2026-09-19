import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async findAll(query: QueryPlantaDto): Promise<Planta[]> {
    if (query.nombre) {
      const plantas = await this.plantaRepository.find({
        relations: { origen: true },
      });
      const nombre = query.nombre.trim().toLowerCase();
      return plantas.filter(
        (p) =>
          p.nombreCientifico.toLowerCase().includes(nombre) ||
          p.nombreVulgar.toLowerCase().includes(nombre),
      );
    }

    const where: FindOptionsWhere<Planta> = {};

    if (query.clasificacion) {
      where.clasificacion = query.clasificacion;
    }

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (query.sortBy) {
      order[query.sortBy] = query.order === 'desc' ? 'DESC' : 'ASC';
    }

    return this.plantaRepository.find({
      where,
      relations: { origen: true },
      order: Object.keys(order).length ? order : undefined,
    });
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
