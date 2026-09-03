import { Test, TestingModule } from '@nestjs/testing';
import { OrigenService } from './origen.service';

describe('OrigenService', () => {
  let service: OrigenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrigenService],
    }).compile();

    service = module.get<OrigenService>(OrigenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
