import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  @Field()
  refreshToken: string;

  @Field()
  accessToken: string
}
