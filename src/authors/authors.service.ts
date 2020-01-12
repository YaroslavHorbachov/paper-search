import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { iteratee, findIndex } from 'lodash';

import { Author } from './author';
import { CreateOrUpdateAuthorInput } from './inputs/create-or-update-author.input';
import { RemoveAuthorInput } from './inputs/remove-author.input';
import { SearchManagerService } from '../search/search-manager.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly search: SearchManagerService<Author>) {}

  private authors = [new Author()];

  public getAuthor(id: string) {
    return this.search.getRecordsByQuery(id);
  }

  public createAuthor(updateAuthorData: CreateOrUpdateAuthorInput) {
    const author = new Author(updateAuthorData);

    const authorPositionIndex = this.authors.push(author);

    return this.authors[authorPositionIndex - 1];
  }

  public updateAuthor({ id, ...updateModel }: CreateOrUpdateAuthorInput) {
    const author = this.findAuthorById(id);

    Object.assign(author, updateModel);

    return author;
  }

  public removeAuthor({ id }: RemoveAuthorInput) {
    const authorIndex = this.findAuthorIndex(id);
    const author = this.authors[authorIndex];
    this.authors.splice(authorIndex, 1);

    return author;
  }

  public findAuthorById(id: string) {
    const authorIndex = this.findAuthorIndex(id);

    return this.authors[authorIndex];
  }

  public findAuthorIndex(id: string) {
    const authorIndex = findIndex(this.authors, iteratee({ id }));

    if (authorIndex === -1) {
      throw new NotFoundException('author');
    }

    return authorIndex;
  }

  public getAuthors() {
    return this.search.getRecords();
  }
}
