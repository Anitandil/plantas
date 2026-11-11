import { Test, TestingModule } from '@nestjs/testing';
import { PlantaService } from './planta.service';
import { OrigenService } from '../origen/origen.service';

describe('PlantaService', () => {
  let service: PlantaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantaService,
        { provide: OrigenService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<PlantaService>(PlantaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should remove a plant and return its details', () => {
    expect(service.remove(1)).toEqual({
      message: 'La planta con ID 1 fue eliminada correctamente.',
      planta: {
        id: 1,
        nombreCientifico: 'Ficus benjamina',
        nombreVulgar: 'Ficus',
        clasificacion: 'Arbol',
        epocaFloracion: 'Todo el año',
        origenId: 1,
      },
    });
    expect(() => service.findOne(1)).toThrow();
  });

  it('should reject a duplicate scientific name', () => {
    expect(() =>
      service.create({
        nombreCientifico: 'Ficus benjamina',
        nombreVulgar: 'Ficus nuevo',
        clasificacion: 'Arbol',
        origenId: 1,
      }),
    ).toThrow('La planta con nombre científico Ficus benjamina ya existe.');
  });

  it('should find plants by a partial name without case sensitivity', () => {
    expect(service.findAll({ nombre: 'ficus' })).toEqual([
      '1: Ficus (Ficus benjamina)',
    ]);
  });

  it('should filter by classification without case sensitivity', () => {
    expect(service.findAll({ clasificacion: 'arbol' })).toEqual([
      '1: Ficus (Ficus benjamina)',
    ]);
  });
});
