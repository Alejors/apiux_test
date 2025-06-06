import { IsString, IsEmail, MinLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: "John Doe",
    description: "Nombre para la cuenta",
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: "john@doe.com",
    description: "Correo electrónico para la cuenta",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "abc123",
    description: "Contraseña para la cuenta",
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
