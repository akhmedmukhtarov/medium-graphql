import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
class Viewer{
  @Field(() => User)
  user: User
}

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User)
  author: User

  @Field(() => [Viewer],{nullable: true})
  viewers: Viewer[]
}
