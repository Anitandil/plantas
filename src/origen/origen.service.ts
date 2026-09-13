import {
  BadRequestException,
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
      clima: 'Subtropical',
    },
    {
      id: 2,
      region: 'Asia',
      clima: 'Subtropical',
    },
    {
      id: 3,
      region: 'America del Sur',
      clima: 'Templado',
    },
    {
      id: 4,
      region: 'America Central',
      clima: 'Tropical',
    },
  ];
  private nextId = 5;

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
    const region = data.region?.trim();
    const clima = data.clima?.trim();

    if (!region || !clima) {
      throw new BadRequestException(
        'Los campos región y clima no pueden estar vacíos.',
      );
    }

    const existente = this.origenes.find(
      (o) => o.region === region && o.clima === clima,
    );
    if (existente) {
      throw new ConflictException(
        `El origen con región ${region} y clima ${clima} ya existe.`,
      );
    }

    const origen: Origen = {
      id: this.nextId++,
      region,
      clima,
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
