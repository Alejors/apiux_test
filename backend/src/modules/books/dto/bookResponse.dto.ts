import { IsString, IsBoolean, IsNumber } from "class-validator";
import { DetailedBook } from "../detailedBook.projection";

export class ResponseBookDTO {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  editorial: string;

  @IsString()
  genre: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  availability: boolean;
  constructor(id: number, title: string, author: string, editorial: string, genre: string, price: number, availability: boolean) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.editorial = editorial;
    this.genre = genre;
    this.price = price;
    this.availability = availability;
  }

  static fromProjection(projection: DetailedBook): ResponseBookDTO {
    return new ResponseBookDTO(projection.id, projection.title, projection.author, projection.editorial, projection.genre, projection.price, projection.availability);
  }
}
