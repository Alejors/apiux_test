import { CreateBookDto, UpdateBookDto } from "./dto/books.dto";
import { Book } from "./books.entity";
import { DetailedBook } from "./detailedBook.projection";

export interface IBookRepository {
  create(book: CreateBookDto, userId: number): Promise<Book>;
  findAll(): Promise<DetailedBook[]>;
  findAllPaginated(limit: number, offset: number): Promise<[DetailedBook[], number]>;
  findOne(filters: object): Promise<DetailedBook | null>;
  update(id: number, book: UpdateBookDto, userId: number): Promise<Book>;
  remove(id: number, userId: number): Promise<void>;
}
