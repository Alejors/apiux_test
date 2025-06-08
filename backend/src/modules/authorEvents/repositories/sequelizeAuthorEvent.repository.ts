import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { AuthorEventModel } from "../../../models/authorEvent.model";
import { CreateAuthorEventDto } from "../dto/authorEvent.dto";
import { IAuthorEventsRepository } from "../authorEvent.interface";

@Injectable()
export class AuthorEventSequelizeRepository implements IAuthorEventsRepository {
  constructor(
    @InjectModel(AuthorEventModel)
    private readonly authorEventModel: typeof AuthorEventModel,
  ) {}
  async create(authorEvent: CreateAuthorEventDto): Promise<void> {
    await this.authorEventModel.create({ ...authorEvent });
  }
}
