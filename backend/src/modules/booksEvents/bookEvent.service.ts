import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Inject } from "@nestjs/common";

import { CreateBookEventDto } from "./dto/bookEvent.dto";
import { IBookEventsRepository } from "./bookEvent.interface";
import { CREATE_BOOK_EVENT, BOOK_EVENT_INTERFACE } from "../../constants";

@Injectable()
export class BookEventsService {
  constructor(
    @Inject(BOOK_EVENT_INTERFACE)
    private readonly bookEventsRepository: IBookEventsRepository,
  ) {}

  @OnEvent(CREATE_BOOK_EVENT)
  async create(createBookEvent: CreateBookEventDto): Promise<void> {
    await this.bookEventsRepository.create(createBookEvent);
  }
}
