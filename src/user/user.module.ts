import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [PostModule],
  providers: [UserResolver, UserService, PrismaService]
})
export class UserModule {}
