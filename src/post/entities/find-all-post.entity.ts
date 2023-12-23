import { Post } from './post.entity';
import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class FindAllPosts {
  @Field({nullable: true})
  nextCursor: string

  @Field()
  totalPages: number

  @Field(() => [Post],{nullable: true})
  posts: Post[]
}