import { Buffer } from "buffer";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";

import { BOOKS_INTERFACE } from "../../constants";
import { IBookRepository } from "./books.interface";
import { DetailedBook } from "./detailedBook.projection";
import { UploadService } from "../upload/upload.service";
import { CreateBookDto, UpdateBookDto } from "./dto/books.dto";
import { CsvExportService } from "../../common/services/csv-export.service";
import { createPaginationLinks } from "../../common/utils/paginationLinks.util";

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOKS_INTERFACE) private readonly booksRepository: IBookRepository,
    private readonly uploadService: UploadService,
    private readonly csvExportService: CsvExportService,
  ) {}
  async create(
    createBookDto: CreateBookDto,
    userId: number,
    imageBuffer?: Buffer,
  ): Promise<DetailedBook | null> {
    let imageUrl: string | undefined;
    if (imageBuffer) {
      imageUrl = await this.uploadService.upload(imageBuffer);
      createBookDto.image_url = imageUrl;
    }
    const bookCreated = await this.booksRepository.create(
      createBookDto,
      userId,
    );
    return await this.booksRepository.findOne({ id: bookCreated.id });
  }

  private async findAll(): Promise<DetailedBook[]> {
    return await this.booksRepository.findAll();
  }

  async findAdvanced(filters: Record<string, string>): Promise<DetailedBook[]> {
    return await this.booksRepository.advancedFilters(filters);
  }

  async exportToCSV(): Promise<string> {
    const books = await this.findAll();
    const headers = Object.keys(books[0]).map((key) => ({
      id: key,
      title: key.toUpperCase(),
    }));
    return this.csvExportService.exportToCsv(books, headers);
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: DetailedBook[]; meta: object; links: object }> {
    const offset = (page - 1) * limit;
    const [books, count] = await this.booksRepository.findAllPaginated(
      limit,
      offset,
    );

    const totalPages = Math.ceil(count / limit);
    const baseUrl = "/books";

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

  async findOne(id: number): Promise<DetailedBook | null> {
    const book = await this.booksRepository.findOne({ id });
    if (!book) throw new NotFoundException("Book Doesn't Exist");
    return book;
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    userId: number,
    imageBuffer?: Buffer,
  ) {
    let imageUrl: string | undefined;
    if (imageBuffer) {
      imageUrl = await this.uploadService.upload(imageBuffer);
      updateBookDto.image_url = imageUrl;
    }
    const bookUpdated = await this.booksRepository.update(
      id,
      updateBookDto,
      userId,
    );
    return await this.booksRepository.findOne({ id: bookUpdated.id });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.booksRepository.remove(id, userId);
  }
}
