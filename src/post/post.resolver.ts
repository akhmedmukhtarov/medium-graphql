import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FindAllInput } from './dto/find-all.input';
import { FindAllPosts } from './entities/find-all-post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser('id') id: number,
  ) {
    return this.postService.create(createPostInput, id);
  }

  @Query(() => FindAllPosts, { name: 'posts' })
  findAll(@Args('findAllInput') findAllInput: FindAllInput) {
    return this.postService.findAll(findAllInput);
  }

  @Query(() => Post, { name: 'post' })
  findOne(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.postService.findOne(postId, userId);
  }
}
