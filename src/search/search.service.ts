import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '../config/config.service';

@Injectable()
export class SearchService {
  public readonly client = new Client({ node: this.config.searchNodeUrl });

  constructor(private readonly config: ConfigService) {}

  public ping() {
    return this.client.ping();
  }
}
