import { Injectable } from '@nestjs/common';
import { Origen } from './origen.entity';

@Injectable()
export class OrigenService {
  private readonly origenes: Origen[] = [];
  private nextId = 1;

  findOrCreate(continente: string, clima: string): Origen {
    const existente = this.origenes.find(
      (o) => o.continente === continente && o.clima === clima,
    );
    if (existente) return existente;

    const origen = new Origen();
    origen.id = this.nextId++;
    origen.continente = continente;
    origen.clima = clima;
    origen.plantas = [];
    this.origenes.push(origen);
    return origen;
  }

  findAll(): Origen[] {
    return this.origenes;
  }
}
