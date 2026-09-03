import { Test, TestingModule } from '@nestjs/testing';
import { OrigenController } from './origen.controller';

describe('OrigenController', () => {
  let controller: OrigenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrigenController],
    }).compile();

    controller = module.get<OrigenController>(OrigenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
