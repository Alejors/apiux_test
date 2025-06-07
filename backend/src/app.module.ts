import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { UserModel } from "./models/user.model";
import { BookModel } from "./models/book.model";
import { GenreModel } from "./models/genre.model";
import { AuthorModel } from "./models/author.model";
import { EditorialModel } from "./models/editorial.model";
import { BookEventModel } from "./models/bookEvent.model";
import { GenreEventModel } from "./models/genreEvent.model";
import { AuthorEventModel } from "./models/authorEvent.model";
import { EditorialEventModel } from "./models/editorialEvent.model";
import jwtConfig from "./config/jwt.config";
import { AuthModule } from "./modules/auth/auth.module";
import { BooksModule } from "./modules/books/books.module";
import { UploadModule } from "./modules/upload/upload.module";
import { BooksEventsModule } from "./modules/booksEvents/bookEvent.module";
import { GenreEventsModule } from "./modules/genreEvents/genreEvent.module";
import { AuthorEventsModule } from "./modules/authorEvents/authorEvent.module";
import { EditorialEventsModule } from "./modules/editorialEvents/editorialEvent.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DOCKER_DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        UserModel,
        AuthorModel,
        BookModel,
        EditorialModel,
        GenreModel,
        BookEventModel,
        AuthorEventModel,
        EditorialEventModel,
        GenreEventModel,
      ],
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    BooksModule,
    BooksEventsModule,
    AuthorEventsModule,
    EditorialEventsModule,
    GenreEventsModule,
    UploadModule,
  ],
})
export class AppModule {}
