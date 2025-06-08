import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/sequelize";

import {
  CREATE_AUTHOR_EVENT,
  CREATE_BOOK_EVENT,
  CREATE_EDITORIAL_EVENT,
  CREATE_GENRE_EVENT,
} from "../../../constants";
import { BookModel } from "../../../models/book.model";
import { GenreModel } from "../../../models/genre.model";
import { AuthorModel } from "../../../models/author.model";
import { EditorialModel } from "../../../models/editorial.model";
import { Book } from "../books.entity";
import { IBookRepository } from "../books.interface";
import { DetailedBook } from "../detailedBook.projection";
import { EventTypeEnum } from "../../../common/enums/eventType.enum";
import {
  buildSequelizeFilters,
  groupByTables,
  parseOrderBy,
} from "../../../common/utils/sequelizeFilters.util";
import { CreateBookDto, UpdateBookDto } from "../dto/books.dto";
import { CreateBookEventDto } from "../../booksEvents/dto/bookEvent.dto";
import { CreateGenreEventDto } from "../../genreEvents/dto/genreEvent.dto";
import { CreateAuthorEventDto } from "../../authorEvents/dto/authorEvent.dto";
import { CreateEditorialEventDto } from "../../editorialEvents/dto/editorialEvent.dto";

const DETAILED_BOOK_ATTRIBUTES = [
  "id",
  "title",
  "price",
  "availability",
  "image_url",
];

interface UpdateData extends UpdateBookDto {
  genre_id?: number;
  author_id?: number;
  editorial_id?: number;
}
@Injectable()
export class BookSequelizeRepository implements IBookRepository {
  constructor(
    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
    @InjectModel(AuthorModel) private readonly authorModel: typeof AuthorModel,
    @InjectModel(EditorialModel)
    private readonly editorialModel: typeof EditorialModel,
    @InjectModel(GenreModel) private readonly genreModel: typeof GenreModel,
    @InjectConnection() private readonly sequelize: Sequelize,
    private eventEmitter: EventEmitter2,
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

  private toProjection(projection: {
    title: string;
    price: number;
    availability: boolean;
    author: { name: string };
    genre: { name: string };
    editorial: { name: string };
    image_url?: string;
    id?: number;
  }): DetailedBook {
    return new DetailedBook(
      projection.title,
      projection.price,
      projection.availability,
      projection.author.name,
      projection.genre.name,
      projection.editorial.name,
      projection.id,
      projection.image_url,
    );
  }

  private async findOrCreateAuthor(
    name: string,
    transaction: Transaction,
    userId: number,
  ): Promise<AuthorModel> {
    let author = await this.authorModel.findOne({
      where: { name },
      transaction,
    });
    if (!author) {
      author = await this.authorModel.create({ name }, { transaction });
      const authorEvent = new CreateAuthorEventDto(
        author.id,
        userId,
        EventTypeEnum.CREATE,
        author,
      );
      this.eventEmitter.emit(CREATE_AUTHOR_EVENT, authorEvent);
    }
    return author;
  }

  private async findOrCreateEditorial(
    name: string,
    transaction: Transaction,
    userId: number,
  ): Promise<EditorialModel> {
    let editorial = await this.editorialModel.findOne({
      where: { name },
      transaction,
    });
    if (!editorial) {
      editorial = await this.editorialModel.create({ name }, { transaction });
      const editorialEvent = new CreateEditorialEventDto(
        editorial.id,
        userId,
        EventTypeEnum.CREATE,
        editorial,
      );
      this.eventEmitter.emit(CREATE_EDITORIAL_EVENT, editorialEvent);
    }
    return editorial;
  }

  private async findOrCreateGenre(
    name: string,
    transaction: Transaction,
    userId: number,
  ): Promise<GenreModel> {
    let genre = await this.genreModel.findOne({
      where: { name },
      transaction,
    });
    if (!genre) {
      genre = await this.genreModel.create({ name }, { transaction });
      const genreEvent = new CreateGenreEventDto(
        genre.id,
        userId,
        EventTypeEnum.CREATE,
        genre,
      );
      this.eventEmitter.emit(CREATE_GENRE_EVENT, genreEvent);
    }
    return genre;
  }

  async create(book: CreateBookDto, userId: number): Promise<Book> {
    return await this.sequelize.transaction(async (t) => {
      const author = await this.findOrCreateAuthor(book.author, t, userId);
      const editorial = await this.findOrCreateEditorial(
        book.editorial,
        t,
        userId,
      );
      const genre = await this.findOrCreateGenre(book.genre, t, userId);

      const createdBook = await this.bookModel.create(
        {
          ...book,
          author_id: author.id,
          editorial_id: editorial.id,
          genre_id: genre.id,
        },
        { transaction: t },
      );
      const eventBook = new CreateBookEventDto(
        createdBook.id,
        userId,
        EventTypeEnum.CREATE,
        createdBook,
      );
      this.eventEmitter.emit(CREATE_BOOK_EVENT, eventBook);
      return this.toDomain(createdBook);
    });
  }

  async advancedFilters(
    filters: Record<string, string>,
  ): Promise<DetailedBook[]> {
    const { order_by, ...rest } = filters;
    const groupedFilters = groupByTables(rest);
    const order = order_by ? [parseOrderBy(order_by)] : [];

    const books = await this.bookModel.findAll({
      attributes: DETAILED_BOOK_ATTRIBUTES,
      where: groupedFilters["books"]
        ? buildSequelizeFilters(groupedFilters["books"])
        : {},
      include: [
        {
          model: this.authorModel,
          attributes: ["name"],
          as: "author",
          where: groupedFilters["author"]
            ? buildSequelizeFilters(groupedFilters["author"])
            : {},
        },
        {
          model: this.editorialModel,
          attributes: ["name"],
          as: "editorial",
          where: groupedFilters["editorial"]
            ? buildSequelizeFilters(groupedFilters["editorial"])
            : {},
        },
        {
          model: this.genreModel,
          attributes: ["name"],
          as: "genre",
          where: groupedFilters["genre"]
            ? buildSequelizeFilters(groupedFilters["genre"])
            : {},
        },
      ],
      raw: true,
      nest: true,
      order: order.map(([modelAlias, field, direction]) =>
        modelAlias === "books"
          ? [field, direction]
          : [
              {
                model: (this as any)[`${modelAlias}Model`],
                as: modelAlias,
              },
              field,
              direction,
            ],
      ),
    });

    return books.map((book) => this.toProjection(book));
  }

  async findAll(): Promise<DetailedBook[]> {
    const books = await this.bookModel.findAll({
      attributes: DETAILED_BOOK_ATTRIBUTES,
      include: [
        {
          model: this.authorModel,
          attributes: ["name"],
          as: "author",
        },
        {
          model: this.editorialModel,
          attributes: ["name"],
          as: "editorial",
        },
        {
          model: this.genreModel,
          attributes: ["name"],
          as: "genre",
        },
      ],
      raw: true,
      nest: true,
    });

    return books.map((book) => this.toProjection(book));
  }

  async findAllPaginated(
    limit?: number,
    offset?: number,
  ): Promise<[DetailedBook[], number]> {
    const { rows, count } = await this.bookModel.findAndCountAll({
      offset,
      limit,
      attributes: DETAILED_BOOK_ATTRIBUTES,
      include: [
        {
          model: this.authorModel,
          attributes: ["name"],
          as: "author",
        },
        {
          model: this.editorialModel,
          attributes: ["name"],
          as: "editorial",
        },
        {
          model: this.genreModel,
          attributes: ["name"],
          as: "genre",
        },
      ],
      raw: true,
      nest: true,
    });
    return [rows.map((book) => this.toProjection(book)), count];
  }

  async findOne(filters: object): Promise<DetailedBook | null> {
    const processedFilters = buildSequelizeFilters(filters);
    const book = await this.bookModel.findOne({
      attributes: DETAILED_BOOK_ATTRIBUTES,
      include: [
        {
          model: this.authorModel,
          attributes: ["name"],
          as: "author",
        },
        {
          model: this.editorialModel,
          attributes: ["name"],
          as: "editorial",
        },
        {
          model: this.genreModel,
          attributes: ["name"],
          as: "genre",
        },
      ],
      raw: true,
      nest: true,
      where: processedFilters,
    });
    return book ? this.toProjection(book) : null;
  }

  async update(id: number, data: UpdateBookDto, userId: number): Promise<Book> {
    const bookExists = await this.bookModel.findByPk(id);
    if (!bookExists) throw new NotFoundException("Book Not Found");

    return await this.sequelize.transaction(async (t) => {
      const updateData: UpdateData = { ...data };
      if (data.genre !== undefined) {
        const genre = await this.findOrCreateGenre(data.genre, t, userId);
        updateData.genre_id = genre.id as number;
      }
      if (data.author !== undefined) {
        const author = await this.findOrCreateAuthor(data.author, t, userId);
        updateData.author_id = author.id as number;
      }
      if (data.editorial !== undefined) {
        const editorial = await this.findOrCreateEditorial(
          data.editorial,
          t,
          userId,
        );
        updateData.editorial_id = editorial.id as number;
      }

      await this.bookModel.update(updateData, {
        where: { id },
        transaction: t,
      });
      const updatedBook = await this.bookModel.findByPk(id, { transaction: t });
      if (!updatedBook) throw new NotFoundException("Book Not Found");

      const eventBook = new CreateBookEventDto(
        updatedBook.id,
        userId,
        EventTypeEnum.UPDATE,
        updatedBook,
        bookExists,
      );
      this.eventEmitter.emit(CREATE_BOOK_EVENT, eventBook);

      return this.toDomain(updatedBook.dataValues);
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const bookExists = await this.bookModel.findByPk(id);
    if (!bookExists) throw new NotFoundException("Book Does Not Exist");

    await this.bookModel.destroy({ where: { id } });

    const deletedBook = await this.bookModel.findByPk(id, { paranoid: false });
    if (!deletedBook) throw new NotFoundException("Something went Wrong");

    const eventBook = new CreateBookEventDto(
      bookExists.id,
      userId,
      EventTypeEnum.DELETE,
      deletedBook,
      bookExists,
    );
    this.eventEmitter.emit(CREATE_BOOK_EVENT, eventBook);
  }
}
