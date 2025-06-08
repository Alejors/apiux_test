import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { AuthorEventModel } from "../../models/authorEvent.model";
import { AUTHOR_EVENT_INTERFACE } from "../../constants";
import { AuthorEventSequelizeRepository } from "./repositories/sequelizeAuthorEvent.repository";
import { AuthorEventsService } from "./authorEvent.service";

@Module({
  imports: [SequelizeModule.forFeature([AuthorEventModel])],
  providers: [
    {
      provide: AUTHOR_EVENT_INTERFACE,
      useClass: AuthorEventSequelizeRepository,
    },
    AuthorEventsService,
  ],
  exports: [SequelizeModule],
})
export class AuthorEventsModule {}
