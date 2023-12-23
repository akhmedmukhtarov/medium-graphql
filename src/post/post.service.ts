import { FindAllInput } from './dto/find-all.input';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}
  async create(createPostInput: CreatePostInput, id: number) {
    const post = await this.prismaService.post.create({
      data: {
        title: createPostInput.title,
        content: createPostInput.content,
        authorId: id,
      },
    });
    return post;
  }

  async findAll(findAllInput: FindAllInput) {
    if (!findAllInput.cursor) {
      const first = await this.prismaService.post.findFirst();
      findAllInput.cursor = Buffer.from(String(first.id)).toString('base64');
    }
    const cursor = +Buffer.from(findAllInput.cursor, 'base64').toString(
      'ascii',
    );
    const limit = findAllInput.limit || 10;

    const posts = await this.prismaService.post.findMany({
      where: {
        id: {
          gte: +cursor,
        },
      },
      take: limit + 1,
      include: {viewers: {select: {user:true}}},
    });
    if (posts.length <= limit) {
      return { posts };
    }
    const lastTakenPost = posts.pop();
    const totalItems = await this.prismaService.post.count()
    const totalPages = Math.ceil(totalItems/limit)
    const nextCursor = Buffer.from(String(lastTakenPost.id)).toString('base64');
    return {
      nextCursor,
      totalPages,
      posts,
    };
  }

  async findOne(postId: number, userId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      include: {viewers: {select: {user:true}}},
    });
    if (!post) {
      const error = new HttpException(`No post found`, HttpStatus.NOT_FOUND);
      throw error
    }
    const userHaveSeen = await this.prismaService.viewedPosts.findFirst({
      where: { postId, userId },
    });
    if (!userHaveSeen) {
      await this.prismaService.viewedPosts.create({
        data: {
          postId,
          userId,
        },
      })
      const updatedPost = await this.prismaService.post.findUnique({
        where: { id: postId },
        include: {viewers: {select: {user:true}}},
      });
      return updatedPost
    }
    return post;
  }
}
