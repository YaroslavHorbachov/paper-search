import { ObjectType, Field, Int } from 'type-graphql';
import { v4 } from 'uuid';
import { uniqueId, random, pickBy } from 'lodash';
import { CreateOrUpdateAuthorInput } from './inputs/create-or-update-author.input';
import { MINIMUM_AGE, MAXIMUM_AGE } from './authors.constants';

@ObjectType()
export class Author {
  @Field()
  public id: string = v4();

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({ nullable: true })
  public age?: number;

  constructor(createOrUpdateModel?: CreateOrUpdateAuthorInput) {
    const incomingModel = pickBy(createOrUpdateModel, Boolean);

    Object.assign(this, incomingModel);
  }
}
