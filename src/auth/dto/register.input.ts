import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class RegisterDto {
  @IsEmail()
  @Field()
  email: string;

  @IsStrongPassword()
  @Field()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;
}
