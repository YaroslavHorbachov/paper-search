import { Module } from '@nestjs/common';
import { join } from 'path';

import { AuthorsService } from './authors.service';
import { AuthorResolver } from './author.resolver';
import { SearchModule } from '../search/search.module';
import { AUTHORS_INDEX_NAME } from './authors.constants';
import { SetupIndexData } from '../search/setup-index-data';
import { SearchManagerService } from '../search/search-manager.service';
import { ConfigModule } from '../config/config.module';
import { SearchService } from '../search/search.service';

@Module({
  imports: [SearchModule, ConfigModule],
  providers: [
    AuthorsService,
    AuthorResolver,
    {
      provide: SearchManagerService,
      useFactory: async search => {
        const service = new SearchManagerService(
          search,
          new SetupIndexData(
            AUTHORS_INDEX_NAME,
            join(__dirname, 'mappings/author'),
          ),
        );
        await service.syncIndex();

        return service;
      },
      inject: [SearchService],
    },
  ],
})
export class AuthorsModule {}
