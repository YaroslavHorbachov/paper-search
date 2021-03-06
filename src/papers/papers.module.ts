import { Module } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PaperResolver } from './paper.resolver';
import { SearchModule } from '../search/search.module';
import { SearchManagerService } from '../search/search-manager.service';
import { SetupIndexData } from '../search/setup-index-data';
import { PAPERS_INDEX_NAME } from './papers.constants';
import { join } from 'path';
import { ConfigModule } from '../config/config.module';
import { SearchService } from '../search/search.service';

@Module({
  imports: [SearchModule, ConfigModule],
  providers: [
    PapersService,
    PaperResolver,
    {
      provide: SearchManagerService,
      useFactory: async search => {
        const service = new SearchManagerService(
          search,
          new SetupIndexData(PAPERS_INDEX_NAME, 'mappings/papers.json'),
        );

        await service.syncIndex();

        return service;
      },
      inject: [SearchService],
    },
  ],
  exports: [PapersService],
})
export class PapersModule {}
