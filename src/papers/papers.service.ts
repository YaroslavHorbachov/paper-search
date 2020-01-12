import { Injectable } from '@nestjs/common';
import { SearchManagerService } from '../search/search-manager.service';
import { Paper } from './paper';
import { last } from 'lodash';

@Injectable()
export class PapersService {
  constructor(private readonly search: SearchManagerService<Paper>) {}

  public getPapers() {
    return this.search.getRecords();
  }

  public async createPaper(paper: Paper) {
    return this.search.createRecord({ ...new Paper(), ...paper });
  }

  public async findPaperByMessageId(messageId: number) {
    const papersByMessageId = await this.search.getRecordsByQuery({
      term: { messageId },
    });

    if (papersByMessageId.length > 1) {
      console.error(
        `Exists ${papersByMessageId.length} papers with ${messageId} messageId`,
      );
    }

    return last(papersByMessageId);
  }

  public updatePaper(paperId: string, updatePaper: Paper) {
    return this.search.updateRecord(paperId, updatePaper);
  }
}
