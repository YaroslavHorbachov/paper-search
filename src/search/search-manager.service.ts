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
export class SearchManagerService<Entity extends { id?: string }> {
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

        let file;
        try {
          file = await readFile(this.mappingsPath);
        } catch (error) {
          console.error(error);
        }

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

  public async getRecord(id: string): Promise<Entity> {
    const result = await this.search.client.search({
      index: this.indexName,
      body: {
        query: {
          id,
        },
      },
    });
    // tslint:disable-next-line: no-console
    console.log(result);

    return result.body;
  }

  public async getRecordsByQuery(query: any): Promise<Entity[]> {
    const result = await this.search.client.search({
      index: this.indexName,
      body: { query },
    });
    // tslint:disable-next-line: no-console
    console.log(result);

    return result.body;
  }

  public async getRecords(): Promise<Entity[]> {
    const result = await this.search.client.search({
      index: this.indexName,
    });

    // tslint:disable-next-line: no-console
    console.log(result);
    return result.body;
  }

  public async createRecord({ id, ...body }: Entity) {
    const result = await this.search.client.index({
      id,
      index: this.indexName,
      body,
      refresh: 'true',
      timeout: '1s',
    });
    // tslint:disable-next-line: no-console
    console.log('Created Record');
    console.log(result);

    return result;
  }

  public async updateRecord(id: string, body: Entity) {
    const result = await this.search.client.index({
      id,
      index: this.indexName,
      body,
      refresh: 'true',
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
