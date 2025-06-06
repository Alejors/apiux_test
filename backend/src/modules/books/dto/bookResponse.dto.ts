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

  @IsString()
  image_url?: string;
  constructor(
    id: number,
    title: string,
    author: string,
    editorial: string,
    genre: string,
    price: number,
    availability: boolean,
    image_url?: string,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.editorial = editorial;
    this.genre = genre;
    this.price = price;
    this.availability = availability;
    this.image_url = image_url;
  }

  static fromProjection(projection: DetailedBook): ResponseBookDTO {
    return new ResponseBookDTO(
      projection.id,
      projection.title,
      projection.author,
      projection.editorial,
      projection.genre,
      projection.price,
      projection.availability,
      projection.image_url,
    );
  }
}
