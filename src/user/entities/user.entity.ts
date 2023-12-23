import {Post} from '../../post/entities/post.entity'
import { ObjectType, Field, Int } from '@nestjs/graphql';

export enum Role {
  ADMIN="admin",
  USER="user"
}

@ObjectType()
class Views {
  @Field(() => Post, {nullable:true})
  post: Post
}

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: Role

  @Field(() => [Post],{nullable:true})
  createdPosts: Post[]

  @Field(() => [Views], {nullable:true})
  viewedPosts: Views[]
}

@ObjectType()
class Pagination{
  @Field()
  limit: number

  @Field()
  page: number

  @Field()
  totalPages: number

  @Field()
  offset: number
}

@ObjectType()
export class FindAllUsersResponse {
  @Field(()=> [User], {nullable:true})
  users: User[]

  @Field(()=> Pagination)
  pagination: Pagination
}