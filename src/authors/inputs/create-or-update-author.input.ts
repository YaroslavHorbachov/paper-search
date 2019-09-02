import { IsUUID, IsString, IsNumber, IsAlpha, Min, Max } from 'class-validator';
import { InputType, Field } from 'type-graphql';

import { MINIMUM_AGE, MAXIMUM_AGE } from '../authors.constants';

@InputType()
export class CreateOrUpdateAuthorInput {
  @IsUUID('4')
  @Field({ nullable: true })
  public id?: string;

  @IsString()
  @IsAlpha()
  @Field({ nullable: true })
  public firstName?: string;

  @IsString()
  @IsAlpha()
  @Field({ nullable: true })
  public lastName?: string;

  @IsNumber()
  @Min(MINIMUM_AGE)
  @Max(MAXIMUM_AGE)
  @Field({ nullable: true })
  public age?: number;
}
