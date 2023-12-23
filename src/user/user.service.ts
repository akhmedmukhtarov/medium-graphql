import { FindAllInput } from './../post/dto/find-all.input';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';
import { OffsetPagination } from './offset.pagination';
import { FindAllUsersInput } from './dto/find-all-user.input';

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}
  async create(createUserInput: CreateUserInput) {
    const hashedPassword = hashSync(createUserInput.password, 10);
    const emailExists = await this.prismaService.user.findUnique({
      where: { email: createUserInput.email },
    });
    if (emailExists) {
      throw new HttpException(
        `User with email ${createUserInput.email} already exists`,
        409,
      );
    }
    return await this.prismaService.user.create({
      data: {
        email: createUserInput.email,
        name: createUserInput.name,
        role: createUserInput.role,
        hashedPassword: hashedPassword,
      },
    });
  }

  async findAll(findAllUserInput: FindAllUsersInput) {
    const totalItems = await this.prismaService.user.count()
    const pagination = new OffsetPagination(findAllUserInput.page, findAllUserInput.limit, totalItems)
    const users = await this.prismaService.user.findMany({
      take: pagination.limit,
      skip: pagination.offset,
      include: {'createdPosts': true, 'viewedPosts': {select: {post:true}}}
    });
    
    return {
      pagination,
      users
    }
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
      include: {createdPosts: true, 'viewedPosts': {select: {post:true}}}
    });
  }
}
