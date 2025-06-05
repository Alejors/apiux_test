import { CreateBookDto, UpdateBookDto } from "./dto/books.dto";
import { Book } from "./books.entity";
import { DetailedBook } from "./detailedBook.projection";

export interface IBookRepository {
  create(book: CreateBookDto): Promise<Book>;
  findAll(): Promise<DetailedBook[]>;
  findOne(filters: object): Promise<DetailedBook | null>;
  update(id: number, user: UpdateBookDto): Promise<Book>;
  remove(id: number): Promise<void>;
}
