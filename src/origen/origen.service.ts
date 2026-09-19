import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Origen } from './origen.entity';
import { PlantaService } from '../planta/planta.service';

@Injectable()
export class OrigenService {
  constructor(
    @InjectRepository(Origen)
    private origenRepository: Repository<Origen>,
    @Inject(forwardRef(() => PlantaService))
    private readonly plantaService: PlantaService,
  ) {}

  findAll(): Promise<Origen[]> {
    return this.origenRepository.find();
  }

  async findOne(id: number): Promise<Origen> {
    const origen = await this.origenRepository.findOneBy({ id });
    if (!origen) {
      throw new NotFoundException(`El origen con ID ${id} no existe.`);
    }
    return origen;
  }

  async create(data: { region: string; clima: string }): Promise<Origen> {
    const region = data.region?.trim();
    const clima = data.clima?.trim();

    if (!region || !clima) {
      throw new BadRequestException(
        'Los campos región y clima no pueden estar vacíos.',
      );
    }

    const existente = await this.origenRepository.findOneBy({
      region,
      clima,
    });
    if (existente) {
      throw new ConflictException(
        `El origen con región ${region} y clima ${clima} ya existe.`,
      );
    }

    const origen = this.origenRepository.create({ region, clima });
    return this.origenRepository.save(origen);
  }

  async findOrCreate(region: string, clima: string): Promise<Origen> {
    const existente = await this.origenRepository.findOneBy({
      region,
      clima,
    });
    if (existente) return existente;
    return this.create({ region, clima });
  }

  async remove(id: number): Promise<{ message: string; origen: Origen }> {
    const origen = await this.findOne(id);

    if (await this.plantaService.existsByOrigenId(id)) {
      throw new ConflictException(
        `No se puede eliminar el origen con ID ${id} porque tiene plantas asociadas.`,
      );
    }

    await this.origenRepository.delete(id);
    return {
      message: `El origen con ID ${id} fue eliminado correctamente.`,
      origen,
    };
  }
}
