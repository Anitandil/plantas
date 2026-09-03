import { Injectable } from '@nestjs/common';
import { Planta } from './planta.entity';
import { OrigenService } from '../origen/origen.service';
import { CreatePlantaDto } from './dto/create-planta.dto';

@Injectable()
export class PlantaService {
  private readonly plantas: Planta[] = [];
  private nextId = 1;

  constructor(private readonly origenService: OrigenService) {}

  create(data: CreatePlantaDto): Planta {
    const origen = this.origenService.findOrCreate(data.continente, data.clima);
    const planta: Planta = {
      id: this.nextId++,
      nombreCientifico: data.nombreCientifico ?? '',
      nombreVulgar: data.nombreVulgar ?? '',
      clasificacion: data.clasificacion ?? '',
      epocaFloracion: data.epocaFloracion,
      tamanio: data.tamanio ?? '',
      origen,
    };
    this.plantas.push(planta);
    return planta;
  }

  findAll(): string[] {
    return this.plantas.map(
      (p) => `${p.id}: ${p.nombreVulgar} (${p.nombreCientifico})`,
    );
  }

  findOne(id: number): Planta | undefined {
    return this.plantas.find((p) => p.id === id);
  }

  update(
    id: number,
    data: Partial<Planta> & { continente?: string; clima?: string },
  ): Planta | undefined {
    const planta = this.findOne(id);
    if (!planta) return undefined;

    if (data.continente !== undefined && data.clima !== undefined) {
      planta.origen = this.origenService.findOrCreate(
        data.continente,
        data.clima,
      );
    }

    if (data.nombreCientifico !== undefined)
      planta.nombreCientifico = data.nombreCientifico;
    if (data.nombreVulgar !== undefined)
      planta.nombreVulgar = data.nombreVulgar;
    if (data.clasificacion !== undefined)
      planta.clasificacion = data.clasificacion;
    if (data.epocaFloracion !== undefined)
      planta.epocaFloracion = data.epocaFloracion;
    if (data.tamanio !== undefined) planta.tamanio = data.tamanio;

    return planta;
  }

  remove(id: number): boolean {
    const index = this.plantas.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.plantas.splice(index, 1);
    return true;
  }
}
