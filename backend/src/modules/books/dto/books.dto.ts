import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNumber, IsBoolean, Min } from "class-validator";

export class CreateBookDto {
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  title: string;

  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  author: string;

  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  editorial: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;

  @Transform(
    ({ value }) => (value as string).toLowerCase() === "true" || value === true,
  )
  @IsBoolean()
  availability: boolean;

  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase())
  genre: string;

  image_url?: string;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
