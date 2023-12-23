import { InputType, Int, Field } from '@nestjs/graphql';
import { Role } from '../entities/user.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsEmail()
  @Field()
  email: string;

  @IsEnum(() => Role)
  @Field()
  role: Role

  @IsStrongPassword()
  @Field()
  password: string;
}
