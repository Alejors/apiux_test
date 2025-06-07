import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { BookSequelizeRepository } from "./repositories/sequelizeBook.repository";
import { AuthorModel } from "../../models/author.model";
import { BookModel } from "../../models/book.model";
import { EditorialModel } from "../../models/editorial.model";
import { GenreModel } from "../../models/genre.model";
import { BOOKS_INTERFACE } from "src/constants";
import { AuthModule } from "../auth/auth.module";
import { UploadModule } from "../upload/upload.module";
import { CsvExportService } from "src/common/services/csv-export.service";

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
