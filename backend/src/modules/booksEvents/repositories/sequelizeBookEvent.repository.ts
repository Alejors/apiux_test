import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateBookEventDto } from "../dto/bookEvent.dto";
import { BookEventModel } from "../../../models/bookEvent.model";
import { IBookEventsRepository } from "../bookEvent.interface";

@Injectable()
export class BookEventSequelizeRepository implements IBookEventsRepository {
  constructor(
    @InjectModel(BookEventModel)
    private readonly bookEventModel: typeof BookEventModel,
  ) {}
  async create(bookEvent: CreateBookEventDto): Promise<void> {
    await this.bookEventModel.create({ ...bookEvent });
  }
}
