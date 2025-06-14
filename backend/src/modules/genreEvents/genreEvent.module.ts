import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { GenreEventModel } from "../../models/genreEvent.model";
import { GENRE_EVENT_INTERFACE } from "../../constants";
import { GenreEventsService } from "./genreEvent.service";
import { GenreEventSequelizeRepository } from "./repositories/sequelizeGenreEvent.repository";

@Module({
  imports: [SequelizeModule.forFeature([GenreEventModel])],
  providers: [
    {
      provide: GENRE_EVENT_INTERFACE,
      useClass: GenreEventSequelizeRepository,
    },
    GenreEventsService,
  ],
  exports: [SequelizeModule],
})
export class GenreEventsModule {}
