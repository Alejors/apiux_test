import { Sequelize } from "sequelize-typescript";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/sequelize";

import { Book } from "../books.entity";
import { IBookRepository } from "../books.interface";
import { BookModel } from "../../../models/book.model";
import { GenreModel } from "../../../models/genre.model";
import { DetailedBook } from "../detailedBook.projection";
import { AuthorModel } from "../../../models/author.model";
import { CreateBookDto, UpdateBookDto } from "../dto/books.dto";
import { EditorialModel } from "../../../models/editorial.model";
import { buildSequelizeFilters } from "src/common/utils/sequelizeFilters.util";
import { CreateBookEventDto } from "src/modules/booksEvents/dto/bookEvent.dto";
import { EventTypeEnum } from "src/common/enums/eventType.enum";
import { CREATE_BOOK_EVENT } from "src/constants";

@Injectable()
export class BookSequelizeRepository implements IBookRepository {
  constructor(
    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
    @InjectModel(AuthorModel) private readonly authorModel: typeof AuthorModel,
    @InjectModel(EditorialModel) private readonly editorialModel: typeof EditorialModel,
    @InjectModel(GenreModel) private readonly genreModel: typeof GenreModel,
    @InjectConnection() private readonly sequelize: Sequelize,
    private eventEmitter: EventEmitter2,
  ) { }

  private toDomain(bookModel: BookModel): Book {
    return new Book(
      bookModel.id,
      bookModel.title,
      bookModel.author_id,
      bookModel.editorial_id,
      bookModel.price,
      bookModel.availability,
      bookModel.genre_id,
    );
  }

  private toProjection(projection: any): DetailedBook {
    return new DetailedBook(
      projection.id,
      projection.title,
      projection.price,
      projection.availability,
      projection.author.name,
      projection.genre.name,
      projection.editorial.name,
    );
  }

  private async findOrCreateAuthor(name: string, transaction): Promise<AuthorModel> {
    const authorName = name.toLowerCase();
    let author = await this.authorModel.findOne({ where: { name: authorName }, transaction });
    if (!author) {
      author = await this.authorModel.create({ name: authorName }, { transaction });
      // TODO: Crear el evento de Author
    }
    return author;
  }

  private async findOrCreateEditorial(name: string, transaction: any): Promise<EditorialModel> {
    const editorialName = name.toLowerCase();
    let editorial = await this.editorialModel.findOne({ where: { name: editorialName }, transaction });
    if (!editorial) {
      editorial = await this.editorialModel.create({ name: editorialName }, { transaction });
      // TODO: Crear el evento de Editorial
    }
    return editorial;
  }

  private async findOrCreateGenre(name: string, transaction: any): Promise<GenreModel> {
    const genreName = name.toLowerCase();
    let genre = await this.genreModel.findOne({ where: { name: genreName }, transaction });
    if (!genre) {
      genre = await this.genreModel.create({ name: genreName }, { transaction });
      // TODO: Crear el evento de Genero
    }
    return genre;
  }

  async create(book: CreateBookDto, userId: number): Promise<Book> {
    return await this.sequelize.transaction(async (t) => {
      const author = await this.findOrCreateAuthor(book.author, t);
      const editorial = await this.findOrCreateEditorial(book.editorial, t);
      const genre = await this.findOrCreateGenre(book.genre, t);

      const createdBook = await this.bookModel.create(
        {
          ...book,
          author_id: author.id,
          editorial_id: editorial.id,
          genre_id: genre.id,
        },
        { transaction: t },
      );
      const eventBook = new CreateBookEventDto(createdBook.id, userId, EventTypeEnum.CREATE, createdBook);
      this.eventEmitter.emit(CREATE_BOOK_EVENT, eventBook);
      return this.toDomain(createdBook);
    });
  }

  async findAll(): Promise<DetailedBook[]> {
    const books = await this.bookModel.findAll({
      attributes: [
        'id',
        'title',
        'price',
        'availability',
      ],
      include: [
        {
          model: this.authorModel,
          attributes: ['name'],
          as: 'author',
        },
        {
          model: this.editorialModel,
          attributes: ['name'],
          as: 'editorial',
        },
        {
          model: this.genreModel,
          attributes: ['name'],
          as: 'genre',
        },
      ],
      raw: true,
      nest: true,
    });
    return books.map((book) => this.toProjection(book));
  }

  async findOne(filters: object): Promise<DetailedBook | null> {
    const processedFilters = buildSequelizeFilters(filters);
    const book = await this.bookModel.findOne({
      attributes: [
        'id',
        'title',
        'price',
        'availability',
      ],
      include: [
        {
          model: this.authorModel,
          attributes: ['name'],
          as: 'author',
        },
        {
          model: this.editorialModel,
          attributes: ['name'],
          as: 'editorial',
        },
        {
          model: this.genreModel,
          attributes: ['name'],
          as: 'genre',
        },
      ],
      raw: true,
      nest: true,
      where: processedFilters
    });
    return book ? this.toProjection(book) : null;
  }

  async update(id: number, data: UpdateBookDto, userId: number): Promise<Book> {
    const bookExists = await this.bookModel.findByPk(id);
    if (!bookExists) throw new NotFoundException("Book Not Found");
    
    return await this.sequelize.transaction(async (t) => {
      const updateData = {...data}
      if (data.genre !== undefined) {
        const genre = await this.findOrCreateGenre(data.genre, t);
        updateData['genre_id'] = genre.id;
      }
      if (data.author !== undefined) {
        const author = await this.findOrCreateAuthor(data.author, t);
        updateData['author_id'] = author.id;
      }
      if (data.editorial !== undefined) {
        const editorial = await this.findOrCreateEditorial(data.editorial, t);
        updateData['editorial_id'] = editorial.id;
      }
      
      await this.bookModel.update(updateData, { where: { id }, transaction: t });
      const updatedBook = await this.bookModel.findByPk(id, { transaction: t });
      if (!updatedBook) throw new NotFoundException("Book Not Found");

      const eventBook = new CreateBookEventDto(updatedBook.id, userId, EventTypeEnum.UPDATE, updatedBook, bookExists);
      this.eventEmitter.emit(CREATE_BOOK_EVENT, eventBook);
      
      return this.toDomain(updatedBook.dataValues);
    });
  }

  async remove(id: number, userId: number): Promise<void> {

    const bookExists = await this.bookModel.findByPk(id);
    if (!bookExists) throw new NotFoundException("Book Does Not Exist");

    await this.bookModel.destroy({ where: { id } });

    const deletedBook = await this.bookModel.findByPk(id, {paranoid: false});
    if(!deletedBook) throw new NotFoundException("Something went Wrong");
    
    const eventBook = new CreateBookEventDto(bookExists.id, userId, EventTypeEnum.DELETE, deletedBook, bookExists);
    this.eventEmitter.emit(CREATE_BOOK_EVENT, eventBook);
  }
}