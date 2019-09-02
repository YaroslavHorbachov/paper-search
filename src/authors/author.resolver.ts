import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Author } from './author';
import { AuthorsService } from './authors.service';
import { CreateOrUpdateAuthorInput } from './inputs/create-or-update-author.input';
import { RemoveAuthorInput } from './inputs/remove-author.input';

@Resolver(() => Author)
export class AuthorResolver {
  private readonly UPDATE_AUTHOR = 'UPDATE_AUTHOR';
  private readonly CREATE_AUTHOR = 'CREATE_AUTHOR';
  private readonly REMOVE_AUTHOR = 'REMOVE_AUTHOR';
  private readonly pubSub = new PubSub();

  constructor(private readonly authorsService: AuthorsService) {}

  @Query(returns => Author, { name: 'author' })
  public getAuthor(@Args('id') id: string) {
    return this.authorsService.getAuthor(id);
  }

  @Query(returns => [Author], { name: 'authors' })
  public getAuthors() {
    return this.authorsService.getAuthors();
  }

  @Mutation(returns => Author)
  public updateAuthor(
    @Args('updateAuthorData') updateAuthorInput: CreateOrUpdateAuthorInput,
  ) {
    const author = this.authorsService.updateAuthor(updateAuthorInput);

    this.pubSub.publish(this.UPDATE_AUTHOR, { author });

    return author;
  }

  @Mutation(returns => Author)
  public createAuthor(
    @Args('createAuthorData') createAuthorInput: CreateOrUpdateAuthorInput,
  ) {
    const author = this.authorsService.createAuthor(createAuthorInput);

    this.pubSub.publish(this.UPDATE_AUTHOR, { author });

    return author;
  }

  @Mutation(returns => Author)
  public removeAuthor(
    @Args('removeAuthorData') removeAuthorInput: RemoveAuthorInput,
  ) {
    const author = this.authorsService.removeAuthor(removeAuthorInput);

    this.pubSub.publish(this.REMOVE_AUTHOR, { author });

    return author;
  }

  @Subscription(returns => Author)
  public updatedAuthors() {
    return this.pubSub.asyncIterator([
      this.UPDATE_AUTHOR,
      this.CREATE_AUTHOR,
      this.REMOVE_AUTHOR,
    ]);
  }
}
