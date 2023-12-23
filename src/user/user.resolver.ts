import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { FindAllUsersResponse, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Role } from 'src/auth/enums';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FindAllUsersInput } from './dto/find-all-user.input';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => FindAllUsersResponse, { name: 'users' })
  findAll(@Args('findAllUserInput') findAllUserInput: FindAllUsersInput) {
    return this.userService.findAll(findAllUserInput);
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }
}
