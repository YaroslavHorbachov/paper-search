import { Resolver, Query } from '@nestjs/graphql';
import { Paper } from './paper';
import { PapersService } from './papers.service';

@Resolver(returns => Paper)
export class PaperResolver {
  constructor(private readonly papersService: PapersService) {}

  @Query(returns => [Paper], { name: 'papers' })
  public getPapers() {
    return this.papersService.getPapers();
  }
}
