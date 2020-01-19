import { Test, TestingModule } from '@nestjs/testing';
import { SearchManagerService } from './search-manager.service';

describe('SearchManagerService', () => {
  let service: SearchManagerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchManagerService],
    }).compile();

    service = module.get<SearchManagerService<any>>(SearchManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
