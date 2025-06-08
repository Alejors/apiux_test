import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { GenreEventModel } from "../../../models/genreEvent.model";
import { CreateGenreEventDto } from "../dto/genreEvent.dto";
import { IGenreEventsRepository } from "../genreEvent.interface";

@Injectable()
export class GenreEventSequelizeRepository implements IGenreEventsRepository {
  constructor(
    @InjectModel(GenreEventModel)
    private readonly genreEventModel: typeof GenreEventModel,
  ) {}
  async create(genreEvent: CreateGenreEventDto): Promise<void> {
    await this.genreEventModel.create({ ...genreEvent });
  }
}
