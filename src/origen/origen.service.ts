import { Injectable } from '@nestjs/common';
import { Origen } from './origen.entity';

@Injectable()
export class OrigenService {
  private readonly origenes: Origen[] = [
    {
      id: 1,
      region: 'América del Sur',
      clima: 'Tropical',
    },
    {
      id: 2,
      region: 'Asia',
      clima: 'Subtropical',
    },
  ];
  private nextId = 1;

  findAll(): Origen[] {
    return this.origenes;
  }

  findOne(id: number): Origen | undefined {
    return this.origenes.find((o) => o.id === id);
  }

  create(data: { region: string; clima: string }): Origen {
    const origen: Origen = {
      id: this.nextId++,
      region: data.region,
      clima: data.clima,
    };
    this.origenes.push(origen);
    return origen;
  }

  findOrCreate(region: string, clima: string): Origen {
    const existente = this.origenes.find(
      (o) => o.region === region && o.clima === clima,
    );
    if (existente) return existente;
    return this.create({ region, clima });
  }

  update(
    id: number,
    data: { region: string; clima: string },
  ): Origen | undefined {
    const origen = this.findOne(id);
    if (!origen) return undefined;
    if (data.region !== undefined) origen.region = data.region;
    if (data.clima !== undefined) origen.clima = data.clima;
    return origen;
  }

  remove(id: number): boolean {
    const index = this.origenes.findIndex((o) => o.id === id);
    if (index === -1) return false; //ponermensaje d q no exist el indice
    this.origenes.splice(index, 1); //desplaza el array para eliminar el elemento en el índice especificado
    return true;
  }
}
