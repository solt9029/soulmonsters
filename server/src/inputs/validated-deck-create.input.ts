import { DeckCreateInput } from '../graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ValidatedDeckCreateInput implements DeckCreateInput {
  @IsNotEmpty()
  @MaxLength(64)
  @Field()
  name: string;
}
