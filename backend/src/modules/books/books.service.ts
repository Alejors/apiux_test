import { Buffer } from 'buffer';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { BOOKS_INTERFACE } from 'src/constants';
import { IBookRepository } from './books.interface';
import { DetailedBook } from './detailedBook.projection';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';
import { GcsService } from 'src/frameworks/cloud-storage/gcs.service';
import { createPaginationLinks } from 'src/common/utils/paginationLinks.util';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOKS_INTERFACE) private readonly booksRepository: IBookRepository,
    private readonly gcsService: GcsService,
  ){}
  async create(createBookDto: CreateBookDto, userId: number, imageBuffer?: Buffer): Promise<DetailedBook | null> {
    let imageUrl: string | undefined;
    if (imageBuffer) {
      imageUrl = await this.gcsService.upload(`book-${Date.now()}.jpg`, imageBuffer);
      createBookDto.image_url = imageUrl;
    }
    const bookCreated = await this.booksRepository.create(createBookDto, userId);
    return await this.booksRepository.findOne({ id: bookCreated.id });
  }

  async findAll(page: number, limit: number): Promise<any> {
    const offset = (page - 1) * limit;
    const [books, count] = await this.booksRepository.findAll(limit, offset);
    
    const totalPages = Math.ceil(count / limit);
    const baseUrl = '/books';

    return {
      data: books,
      meta: {
        totalCount: count,
        totalPages,
        currentPage: page,
      },
      links: createPaginationLinks(page, totalPages, limit, baseUrl),
    };
  }

  async findOne(id: number): Promise<DetailedBook|null> {
    const book = await this.booksRepository.findOne({ id });
    if (!book)throw new NotFoundException("Book Doesn't Exist");
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number, imageBuffer?: Buffer) {
    let imageUrl: string | undefined;
    if (imageBuffer) {
      imageUrl = await this.gcsService.upload(`book-${Date.now()}.jpg`, imageBuffer);
      updateBookDto.image_url = imageUrl;
    }
    const bookUpdated = await this.booksRepository.update(id, updateBookDto, userId);
    return await this.booksRepository.findOne({ id: bookUpdated.id });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.booksRepository.remove(id, userId);
  }
}
