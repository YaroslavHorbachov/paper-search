import { Injectable, Inject } from '@nestjs/common';
import { SearchManagerService } from '../search/search-manager.service';

@Injectable()
export class PapersService {
  constructor(private readonly search: SearchManagerService) {}

  public getPapers() {
    return this.search.getRecords();
  }
}
