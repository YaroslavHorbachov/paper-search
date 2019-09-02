import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get('ping')
  public healthCheck() {
    return this.search.ping();
  }
}
