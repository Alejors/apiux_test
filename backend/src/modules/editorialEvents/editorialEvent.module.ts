import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { EditorialEventModel } from "src/models";
import { EDITORIAL_EVENT_INTERFACE } from "src/constants";
import { EditorialEventSequelizeRepository } from "./repositories/sequelizeEditorialEvent.repository";
import { EditorialEventsService } from "./editorialEvent.service";

@Module({
  imports: [SequelizeModule.forFeature([EditorialEventModel])],
  providers: [
    {
      provide: EDITORIAL_EVENT_INTERFACE,
      useClass: EditorialEventSequelizeRepository,
    },
    EditorialEventsService,
  ],
  exports: [SequelizeModule],
})
export class EditorialEventsModule {}
