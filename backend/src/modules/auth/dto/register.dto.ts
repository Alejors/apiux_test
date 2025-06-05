import { IsString, IsEmail, MinLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
