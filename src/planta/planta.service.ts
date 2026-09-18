import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Planta, Tamanio } from './planta.entity';
import { OrigenService } from '../origen/origen.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
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
  private nextId = 4;

  constructor(
    @Inject(forwardRef(() => OrigenService))
    private readonly origenService: OrigenService,
  ) {}

  existsByOrigenId(origenId: number): boolean {
    return this.plantas.some((planta) => planta.origenId === origenId);
  }

  findAll(query: QueryPlantaDto): string[] {
    let result = this.plantas;
    const nombre = query.nombre?.trim().toLowerCase();

    if (nombre) {
      result = result.filter(
        (p) =>
          p.nombreCientifico.toLowerCase().includes(nombre) ||
          p.nombreVulgar.toLowerCase().includes(nombre),
      );
    }

    const clasificacion = query.clasificacion?.trim().toLowerCase();

    if (clasificacion) {
      result = result.filter(
        (p) => p.clasificacion.toLowerCase() === clasificacion,
      );
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
    const nombreCientifico = data.nombreCientifico?.trim();
    const nombreVulgar = data.nombreVulgar?.trim();
    const clasificacion = data.clasificacion?.trim();

    if (!nombreCientifico || !nombreVulgar || !clasificacion) {
      throw new BadRequestException(
        'Los campos nombre científico, nombre vulgar y clasificación no pueden estar vacíos.',
      );
    }

    if (
      this.plantas.some(
        (planta) => planta.nombreCientifico === nombreCientifico,
      )
    ) {
      throw new ConflictException(
        `La planta con nombre científico ${nombreCientifico} ya existe.`,
      );
    }

    if (!Object.values(Tamanio).includes(data.tamanio)) {
      throw new BadRequestException('El tamaño no es válido.');
    }

    this.origenService.findOne(data.origenId);
    const planta: Planta = {
      id: this.nextId++,
      nombreCientifico,
      nombreVulgar,
      clasificacion,
      tamanio: data.tamanio,
      epocaFloracion: data.epocaFloracion?.trim() || undefined,
      origenId: data.origenId,
    };
    this.plantas.push(planta);
    return planta;
  }

  update(id: number, data: UpdatePlantaDto): Planta {
    const planta = this.findOne(id);

    if (data.origenId !== undefined) {
      this.origenService.findOne(data.origenId);
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
      const clasificacion = data.clasificacion.trim();
      if (!clasificacion) {
        throw new BadRequestException('La clasificación no puede estar vacía.');
      }
      planta.clasificacion = clasificacion;
    }

    if (data.tamanio !== undefined) {
      if (!Object.values(Tamanio).includes(data.tamanio)) {
        throw new BadRequestException('El tamaño no es válido.');
      }
      planta.tamanio = data.tamanio;
    }

    if (data.epocaFloracion !== undefined) {
      planta.epocaFloracion = data.epocaFloracion.trim() || undefined;
    }

    return planta;
  }

  remove(id: number): { message: string; planta: Planta } {
    const index = this.plantas.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`La planta con ID ${id} no existe.`);
    }
    const planta = this.plantas[index];
    this.plantas.splice(index, 1);
    return {
      message: `La planta con ID ${id} fue eliminada correctamente.`,
      planta,
    };
  }
}
