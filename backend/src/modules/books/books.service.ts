import { Injectable, Inject } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';
import { BOOKS_INTERFACE } from 'src/constants';
import { IBookRepository } from './books.interface';
import { DetailedBook } from './detailedBook.projection';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOKS_INTERFACE) private readonly booksRepository: IBookRepository
  ){}
  async create(createBookDto: CreateBookDto, userId: number): Promise<DetailedBook | null> {
    const bookCreated = await this.booksRepository.create(createBookDto, userId);
    return await this.booksRepository.findOne({ id: bookCreated.id });
  }

  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    return `This action updates a #${id} book`;
  }

  remove(id: number, userId: number) {
    return `This action removes a #${id} book`;
  }
}
