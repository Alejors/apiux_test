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
  async create(createBookDto: CreateBookDto): Promise<DetailedBook | null> {
    const bookCreated = await this.booksRepository.create(createBookDto);
    return await this.booksRepository.findOne({ id: bookCreated.id });
  }

  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
