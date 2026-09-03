import { Test, TestingModule } from '@nestjs/testing';
import { PlantaController } from './planta.controller';

describe('PlantaController', () => {
  let controller: PlantaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantaController],
    }).compile();

    controller = module.get<PlantaController>(PlantaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
