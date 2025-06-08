import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { BookEventModel } from "../../models/bookEvent.model";
import { BOOK_EVENT_INTERFACE } from "../../constants";
import { BookEventSequelizeRepository } from "./repositories/sequelizeBookEvent.repository";
import { BookEventsService } from "./bookEvent.service";

@Module({
  imports: [SequelizeModule.forFeature([BookEventModel])],
  providers: [
    {
      provide: BOOK_EVENT_INTERFACE,
      useClass: BookEventSequelizeRepository,
    },
    BookEventsService,
  ],
  exports: [SequelizeModule],
})
export class BooksEventsModule {}
