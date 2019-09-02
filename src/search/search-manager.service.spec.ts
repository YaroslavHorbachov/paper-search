import { Test, TestingModule } from '@nestjs/testing';
import { SearchManagerService } from './search-manager.service';

describe('SearchManagerService', () => {
  let service: SearchManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchManagerService],
    }).compile();

    service = module.get<SearchManagerService>(SearchManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
