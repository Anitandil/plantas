import { Injectable } from '@nestjs/common';
import { Planta } from './planta.entity';
import { OrigenService } from '../origen/origen.service';
import { CreatePlantaDto } from './dto/create-planta.dto';

@Injectable()
export class PlantaService {
  private readonly plantas: Planta[] = [];
  private nextId = 1;

  constructor(private readonly origenService: OrigenService) {}

  findAll(clasificacion?: string): string[] {
    let plantasFiltradas = this.plantas;

    if (clasificacion) {
      plantasFiltradas = this.plantas.filter(
        (p) => p.clasificacion === clasificacion,
      );
    }

    return plantasFiltradas.map(
      (p) => `${p.id}: ${p.nombreVulgar} (${p.nombreCientifico})`,
    );
  }

  findOne(id: number): Planta | undefined {
    return this.plantas.find((p) => p.id === id);
  }

  create(data: CreatePlantaDto): Planta {
    const origen = this.origenService.findOne(data.origenId);
    if (!origen) {
      throw new Error('Origen no encontrado');
    }
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

  update(id: number, data: Partial<CreatePlantaDto>): Planta | undefined {
    const planta = this.findOne(id);
    if (!planta) return undefined;

    if (data.origenId !== undefined) {
      const origen = this.origenService.findOne(data.origenId);
      if (!origen) {
        throw new Error('Origen no encontrado');
      }
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
    if (index === -1) return false;
    this.plantas.splice(index, 1);
    return true;
  }
}
