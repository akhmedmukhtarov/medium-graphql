import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";


@InputType()
export class FindAllInput {
  @IsOptional()
  @IsString()
  @Field({nullable: true})
  cursor?: string

  @IsOptional()
  @IsNumber({maxDecimalPlaces: 0})
  @Min(1)
  @Field({nullable: true})
  limit?: number
}