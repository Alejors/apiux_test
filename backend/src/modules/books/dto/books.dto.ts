import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNumber, IsBoolean, Min } from "class-validator";

import { ToLowerCase } from "src/common/decorators/toLowerCase.decoratos";

export class CreateBookDto {
  @IsString()
  @ToLowerCase()
  title: string;

  @IsString()
  @ToLowerCase()
  author: string;

  @IsString()
  @ToLowerCase()
  editorial: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;

  @Transform(({ value }) => value.toLowerCase() === "true" || value === true)
  @IsBoolean()
  availability: boolean;

  @IsString()
  @ToLowerCase()
  genre: string;

  image_url?: string;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
