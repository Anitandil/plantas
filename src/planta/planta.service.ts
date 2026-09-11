import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Planta, Tamanio } from './planta.entity';
import { OrigenService } from '../origen/origen.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { QueryPlantaDto } from './dto/query-planta.dto';

@Injectable()
export class PlantaService {
  private readonly plantas: Planta[] = [
    {
      id: 1,
      nombreCientifico: 'Ficus benjamina',
      nombreVulgar: 'Ficus',
      clasificacion: 'Arbol',
      tamanio: Tamanio.MEDIANO,
      epocaFloracion: 'Todo el año',
      origenId: 1,
    },
    {
      id: 2,
      nombreCientifico: 'Monstera deliciosa',
      nombreVulgar: 'Monstera',
      clasificacion: 'Planta trepadora',
      tamanio: Tamanio.GRANDE,
      epocaFloracion: 'Verano',
      origenId: 2,
    },
    {
      id: 3,
      nombreCientifico: 'Aloe vera',
      nombreVulgar: 'Aloe',
      clasificacion: 'Suculenta',
      tamanio: Tamanio.PEQUENIO,
      epocaFloracion: 'Primavera',
      origenId: 3,
    },
  ];
  private nextId = 3;

  constructor(
    @Inject(forwardRef(() => OrigenService))
    private readonly origenService: OrigenService,
  ) {}

  existsByOrigenId(origenId: number): boolean {
    return this.plantas.some((planta) => planta.origenId === origenId);
  }

  findAll(query: QueryPlantaDto): string[] {
    let result = this.plantas;

    if (query.clasificacion) {
      result = result.filter((p) => p.clasificacion === query.clasificacion);
    }

    if (query.tamanio) {
      result = result.filter((p) => p.tamanio === query.tamanio);
    }

    if (query.sortBy) {
      const field = query.sortBy;
      result.sort((a, b) => {
        if (a[field] < b[field]) return query.order === 'desc' ? 1 : -1;
        if (a[field] > b[field]) return query.order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    if (query.page) {
      const limit = query.limit ?? result.length;
      const start = (query.page - 1) * limit;
      result = result.slice(start, start + limit);
    }

    return result.map(
      (p) => `${p.id}: ${p.nombreVulgar} (${p.nombreCientifico})`,
    );
  }

  findOne(id: number): Planta {
    const planta = this.plantas.find((p) => p.id === id);
    if (!planta) {
      throw new NotFoundException(`La planta con ID ${id} no existe.`);
    }
    return planta;
  }

  create(data: CreatePlantaDto): Planta {
    this.origenService.findOne(data.origenId);
    const planta: Planta = {
      id: this.nextId++,
      nombreCientifico: data.nombreCientifico ?? '',
      nombreVulgar: data.nombreVulgar ?? '',
      clasificacion: data.clasificacion ?? '',
      tamanio: data.tamanio ?? '',
      epocaFloracion: data.epocaFloracion,
      origenId: data.origenId,
    };
    this.plantas.push(planta);
    return planta;
  }

  update(id: number, data: Partial<CreatePlantaDto>): Planta {
    const planta = this.findOne(id);

    if (data.origenId !== undefined) {
      this.origenService.findOne(data.origenId);
      planta.origenId = data.origenId;
    }

    if (data.nombreCientifico !== undefined)
      planta.nombreCientifico = data.nombreCientifico;
    if (data.nombreVulgar !== undefined)
      planta.nombreVulgar = data.nombreVulgar;
    if (data.clasificacion !== undefined)
      planta.clasificacion = data.clasificacion;
    if (data.tamanio !== undefined) planta.tamanio = data.tamanio;
    if (data.epocaFloracion !== undefined)
      planta.epocaFloracion = data.epocaFloracion;

    return planta;
  }

  remove(id: number): boolean {
    const index = this.plantas.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`La planta con ID ${id} no existe.`);
    }
    this.plantas.splice(index, 1);
    return true;
  }
}
