import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';

@Module({
  providers: [PostResolver, PostService,PrismaService]
})
export class PostModule {}
