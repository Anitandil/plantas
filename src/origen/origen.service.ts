import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Origen } from './origen.entity';
import { PlantaService } from '../planta/planta.service';

@Injectable()
export class OrigenService {
  constructor(
    @Inject(forwardRef(() => PlantaService))
    private readonly plantaService: PlantaService,
  ) {}
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
  private nextId = 3;

  findAll(): Origen[] {
    return this.origenes;
  }

  findOne(id: number): Origen {
    const origen = this.origenes.find((o) => o.id === id);
    if (!origen) {
      throw new NotFoundException(`El origen con ID ${id} no existe.`);
    }
    return origen;
  }

  create(data: { region: string; clima: string }): Origen {
    const existente = this.origenes.find(
      (o) => o.region === data.region && o.clima === data.clima,
    );
    if (existente) {
      throw new ConflictException(
        `El origen con región ${data.region} y clima ${data.clima} ya existe.`,
      );
    }

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

  update(id: number, data: { region: string; clima: string }): Origen {
    const origen = this.findOne(id);
    if (data.region !== undefined) origen.region = data.region;
    if (data.clima !== undefined) origen.clima = data.clima;
    return origen;
  }

  remove(id: number): boolean {
    this.findOne(id);

    if (this.plantaService.existsByOrigenId(id)) {
      throw new ConflictException(
        `No se puede eliminar el origen con ID ${id} porque tiene plantas asociadas.`,
      );
    }

    const index = this.origenes.findIndex((o) => o.id === id);
    this.origenes.splice(index, 1); //desplaza el array para eliminar el elemento en el índice especificado
    return true;
  }
}
