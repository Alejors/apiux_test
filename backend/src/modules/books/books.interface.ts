import { CreateBookDto, UpdateBookDto } from "./dto/books.dto";
import { Book } from "./books.entity";

export interface IBookRepository {
  create(book: CreateBookDto): Promise<Book>;
  findAll(): Promise<Book[]>;
  findOne(filters: object): Promise<Book | null>;
  update(id: number, user: UpdateBookDto): Promise<Book>;
  remove(id: number): Promise<void>;
}
