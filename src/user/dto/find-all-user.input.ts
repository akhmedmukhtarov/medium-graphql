import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional } from "class-validator";


@InputType()
export class FindAllUsersInput {
  @IsOptional()
  @IsNumber({maxDecimalPlaces: 0})
  @Field({nullable: true})
  page?: number

  @IsOptional()
  @IsNumber({maxDecimalPlaces: 0})
  @Field({nullable: true})
  limit?: number
}