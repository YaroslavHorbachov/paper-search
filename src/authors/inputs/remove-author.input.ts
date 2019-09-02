import { InputType, Field } from 'type-graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class RemoveAuthorInput {
  @IsUUID('4')
  @Field()
  public id: string;
}
