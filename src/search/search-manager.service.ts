import {
  Injectable,
  Scope,
  OnModuleInit,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';

import { SearchService } from './search.service';
import { SetupIndexData } from './setup-index-data';

const readFile = promisify(fs.readFile);

@Injectable({ scope: Scope.TRANSIENT })
export class SearchManagerService {
  private indexName: string;
  private mappingsPath: string;

  constructor(
    private readonly search: SearchService,
    setupIndexData: SetupIndexData,
  ) {
    if (setupIndexData) {
      this.indexName = setupIndexData.indexName;
      this.mappingsPath = setupIndexData.mappingsPath;
    }
  }

  public async syncIndex() {
    if (!this.mappingsPath) {
      throw new NotFoundException(
        `Index: ${this.indexName}, mappings not found`,
      );
    }

    const { statusCode } = await this.search.client.indices.exists({
      index: this.indexName,
    });

    switch (statusCode) {
      case HttpStatus.NOT_FOUND: {
        // Create index with mappings
        console.log(`Index: ${this.indexName} is not exists`);

        const file = await readFile(this.mappingsPath);

        if (!file) {
          console.log(`Index: ${this.indexName}, mappings file not found`);
        }

        const indexMappings = JSON.parse(file.toString());

        await this.search.client.indices.create({
          index: this.indexName,
          body: indexMappings,
        });

        console.log(`Index: ${this.indexName} is created`);
      }
      case HttpStatus.OK: {
        // Sync with mappings
        break;
      }
      default: {
        throw new InternalServerErrorException('fail check exist of index');
      }
    }
  }

  public async createIndex() {
    const result = await this.search.client.indices.create({
      index: this.indexName,
    });

    return result;
  }

  public async getRecord(id: string) {
    const result = await this.search.client.search({
      index: this.indexName,
      body: {
        query: {
          id,
        },
      },
    });
    console.log(result.body.hits);
    return result;
  }

  public async getRecords() {
    const result = await this.search.client.search({
      index: this.indexName,
    });

    return result;
  }

  public async createRecord(body: any) {
    const result = await this.search.client.index({
      refresh: 'true',
      index: this.indexName,
      body,
      timeout: '1s',
    });
    // tslint:disable-next-line: no-console
    console.log(result);

    return result;
  }

  public async updateRecord(id: string, body: any) {
    const result = await this.search.client.index({
      id,
      refresh: 'true',
      index: this.indexName,
      body,
      timeout: '1s',
    });
    // tslint:disable-next-line: no-console
    console.log(result);

    return result;
  }

  public readIndex() {}

  public deleteIndex() {}

  public updateIndex() {}
}
