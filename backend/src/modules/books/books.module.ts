import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BookSequelizeRepository } from './repositories/sequelizeBook.repository';
import { AuthorModel, BookModel, EditorialModel, GenreModel } from 'src/models';
import { BOOKS_INTERFACE } from 'src/constants';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BookModel, 
      GenreModel, 
      AuthorModel, 
      EditorialModel
    ]),
    AuthModule,
  ],
  controllers: [BooksController],
  providers: [
    {
      provide: BOOKS_INTERFACE,
      useClass: BookSequelizeRepository,
    },
    BooksService,
  ],
  exports: [SequelizeModule]
})
export class BooksModule {}
