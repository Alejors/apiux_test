import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNumber, IsBoolean, Min } from "class-validator";

export class CreateBookDto {
  @ApiProperty({
    example: "El Principito",
    description: "Nombre del Libro",
  })
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  title: string;

  @ApiProperty({
    example: "Gabriel García Márquez",
    description: "Nombre del Autor",
  })
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  author: string;

  @ApiProperty({
    example: "Planeta",
    description: "Nombre de la Editorial",
  })
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  editorial: string;

  @ApiProperty({
    example: 1000,
    description: "Precio del Libro",
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: true,
    description: "Disponibilidad del Libro",
  })
  @Transform(
    ({ value }) => (value as string).toLowerCase() === "true" || value === true,
  )
  @IsBoolean()
  availability: boolean;

  @ApiProperty({
    example: "Ficción",
    description: "Género del Libro",
  })
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  genre: string;

  image_url?: string;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
