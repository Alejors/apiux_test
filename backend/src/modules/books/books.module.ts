import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { BooksService } from "./books.service";
import { BOOKS_INTERFACE } from "../../constants";
import { BooksController } from "./books.controller";

import { BookModel } from "../../models/book.model";
import { GenreModel } from "../../models/genre.model";
import { AuthorModel } from "../../models/author.model";
import { EditorialModel } from "../../models/editorial.model";

import { AuthModule } from "../auth/auth.module";
import { UploadModule } from "../upload/upload.module";

import { CsvExportService } from "../../common/services/csv-export.service";
import { BookSequelizeRepository } from "./repositories/sequelizeBook.repository";

@Module({
  imports: [
    SequelizeModule.forFeature([
      BookModel,
      GenreModel,
      AuthorModel,
      EditorialModel,
    ]),
    AuthModule,
    UploadModule,
  ],
  controllers: [BooksController],
  providers: [
    {
      provide: BOOKS_INTERFACE,
      useClass: BookSequelizeRepository,
    },
    BooksService,
    CsvExportService,
  ],
  exports: [SequelizeModule],
})
export class BooksModule {}
