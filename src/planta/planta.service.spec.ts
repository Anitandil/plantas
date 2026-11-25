jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

import { ConflictException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { OrigenService } from '../origen/origen.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { Planta, Clasificacion } from './planta.entity';
import { PlantaService } from './planta.service';

describe('PlantaService', () => {
  let service: PlantaService;
  let repository: {
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
  };
  let origenService: { findOne: jest.Mock };

  beforeEach(() => {
    repository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    origenService = { findOne: jest.fn() };

    service = new PlantaService(
      repository as unknown as Repository<Planta>,
      origenService as unknown as OrigenService,
    );
  });

  it('rejects a plant with an existing scientific name', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 1,
      nombreCientifico: 'Ficus benjamina',
    });

    await expect(
      service.create({
        nombreCientifico: ' Ficus benjamina ',
        nombreVulgar: 'Ficus nuevo',
        clasificacion: Clasificacion.ARBOL,
        origenId: 1,
      }),
    ).rejects.toThrow(
      new ConflictException(
        'La planta con nombre científico Ficus benjamina ya existe.',
      ),
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects changing a plant to another plant’s scientific name', async () => {
    repository.findOne.mockResolvedValue({ id: 1 });
    repository.findOneBy.mockResolvedValue({
      id: 2,
      nombreCientifico: 'Ficus benjamina',
    });

    await expect(
      service.update(1, { nombreCientifico: 'Ficus benjamina' }),
    ).rejects.toThrow(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('allows saving the same scientific name on the same plant', async () => {
    const planta = {
      id: 1,
      nombreCientifico: 'Ficus benjamina',
    } as Planta;
    repository.findOne.mockResolvedValue(planta);
    repository.findOneBy.mockResolvedValue(planta);
    repository.save.mockResolvedValue(planta);

    await expect(
      service.update(1, { nombreCientifico: ' Ficus benjamina ' }),
    ).resolves.toBe(planta);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ nombreCientifico: 'Ficus benjamina' }),
    );
  });

  it('turns the database unique constraint into a conflict response', async () => {
    repository.findOneBy.mockResolvedValue(null);
    origenService.findOne.mockResolvedValue({ id: 1 });
    repository.create.mockReturnValue({});
    repository.save.mockRejectedValue(
      new QueryFailedError('INSERT', [], {
        code: '23505',
        constraint: 'UQ_planta_nombre_cientifico',
      }),
    );

    const planta: CreatePlantaDto = {
      nombreCientifico: 'Ficus benjamina',
      nombreVulgar: 'Ficus',
      clasificacion: Clasificacion.ARBOL,
      origenId: 1,
    };

    await expect(service.create(planta)).rejects.toThrow(ConflictException);
  });
});
