import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ConfigModule } from '../config/config.module';
import { SearchManagerService } from './search-manager.service';

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: SearchManagerService,
      useFactory: searchService =>
        new SearchManagerService(searchService, {} as any),
      inject: [SearchService],
    },
  ],
  exports: [SearchManagerService, SearchService],
})
export class SearchModule {}
