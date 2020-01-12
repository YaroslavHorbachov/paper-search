import { ObjectType, Field } from 'type-graphql';
import { v4 } from 'uuid';

@ObjectType()
export class Paper {
  @Field()
  public id?: string = v4();

  @Field()
  public messageId: number;

  @Field()
  public title: string;

  @Field()
  public content: string; // TODO: Add PaperContent

  @Field({ nullable: true })
  public lead?: string;

  @Field({ nullable: true })
  public authorId?: string; // TODO: Add AnonymousAuthor

  @Field()
  public createdOn: Date;

  @Field({ nullable: true })
  public updatedOn?: Date;

  @Field(returns => [String], { nullable: true })
  public sources?: string[]; // TODO: Add PaperSources

  @Field({ nullable: true })
  public cover?: string; // TODO: Add PaperCover
}
