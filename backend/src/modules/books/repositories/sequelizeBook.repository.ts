import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { BookModel } from "../../../models/book.model";
import { AuthorModel } from "../../../models/author.model";
import { EditorialModel } from "../../../models/editorial.model";
import { GenreModel } from "../../../models/genre.model";
import { Book } from "../books.entity";
import { IBookRepository } from "../books.interface";
import { CreateBookDto, UpdateBookDto } from "../dto/books.dto";
import { buildSequelizeFilters } from "src/common/utils/sequelizeFilters.util";
import { DetailedBook } from "../detailedBook.projection";

@Injectable()
export class BookSequelizeRepository implements IBookRepository {
  constructor(
    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
    @InjectModel(AuthorModel) private readonly authorModel: typeof AuthorModel,
    @InjectModel(EditorialModel) private readonly editorialModel: typeof EditorialModel,
    @InjectModel(GenreModel) private readonly genreModel: typeof GenreModel,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

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

  async create(book: CreateBookDto): Promise<Book> {
    const authorName = book.author.toLowerCase();
    const editorialName = book.editorial.toLowerCase();
    const genreName = book.genre.toLowerCase();

    return await this.sequelize.transaction(async (t) => {
      let author = await this.authorModel.findOne({ where: { name: authorName }, transaction: t });
      if (!author) {
        author = await this.authorModel.create({ name: authorName }, { transaction: t });
      }

      let editorial = await this.editorialModel.findOne({ where: { name: editorialName }, transaction: t });
      if (!editorial) {
        editorial = await this.editorialModel.create({ name: editorialName }, { transaction: t });
      }

      let genre = await this.genreModel.findOne({ where: { name: genreName }, transaction: t });
      if (!genre) {
        genre = await this.genreModel.create({ name: genreName }, { transaction: t });
      }

      const created = await this.bookModel.create(
        {
          ...book,
          author_id: author.id,
          editorial_id: editorial.id,
          genre_id: genre.id,
        },
        { transaction: t },
      );

      return this.toDomain(created);
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

  async update(id: number, data: UpdateBookDto): Promise<Book> {
    await this.bookModel.update(data, { where: { id } });
    const updated = await this.bookModel.findByPk(id);
    if (!updated) throw new NotFoundException("Book not found");
    return this.toDomain(updated.dataValues);
  }

  async remove(id: number): Promise<void> {
    await this.bookModel.destroy({ where: { id } });
  }
}