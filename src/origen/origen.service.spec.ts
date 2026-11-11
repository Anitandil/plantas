import { Test, TestingModule } from '@nestjs/testing';
import { OrigenService } from './origen.service';
import { PlantaService } from '../planta/planta.service';

describe('OrigenService', () => {
  let service: OrigenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrigenService, { provide: PlantaService, useValue: {} }],
    }).compile();

    service = module.get<OrigenService>(OrigenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
