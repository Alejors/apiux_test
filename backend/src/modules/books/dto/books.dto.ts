import { IsString, IsNumber, IsBoolean, Min } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  editorial: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  availability: boolean;

  @IsString()
  genre: string;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
