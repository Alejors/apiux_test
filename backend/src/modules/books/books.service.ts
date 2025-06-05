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

  async findAll(): Promise<DetailedBook[]> {
    return await this.booksRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    const bookUpdated = await this.booksRepository.update(id, updateBookDto, userId);
    return await this.booksRepository.findOne({ id: bookUpdated.id });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.booksRepository.remove(id, userId);
  }
}
