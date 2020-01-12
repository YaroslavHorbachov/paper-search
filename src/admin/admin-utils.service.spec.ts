import { Test, TestingModule } from '@nestjs/testing';
import { AdminUtilsService } from './admin-utils.service';

describe('AdminUtilsService', () => {
  let service: AdminUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUtilsService],
    }).compile();

    service = module.get<AdminUtilsService>(AdminUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
