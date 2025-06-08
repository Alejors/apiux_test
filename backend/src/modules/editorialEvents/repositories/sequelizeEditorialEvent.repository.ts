import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { EditorialEventModel } from "../../../models/editorialEvent.model";
import { CreateEditorialEventDto } from "../dto/editorialEvent.dto";
import { IEditorialEventsRepository } from "../editorialEvent.interface";

@Injectable()
export class EditorialEventSequelizeRepository
  implements IEditorialEventsRepository
{
  constructor(
    @InjectModel(EditorialEventModel)
    private readonly editorialEventModel: typeof EditorialEventModel,
  ) {}
  async create(editorialEvent: CreateEditorialEventDto): Promise<void> {
    await this.editorialEventModel.create({ ...editorialEvent });
  }
}
