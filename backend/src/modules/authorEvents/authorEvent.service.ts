import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CreateAuthorEventDto } from "./dto/authorEvent.dto";
import { IAuthorEventsRepository } from "./authorEvent.interface";
import { CREATE_AUTHOR_EVENT, AUTHOR_EVENT_INTERFACE } from "../../constants";

@Injectable()
export class AuthorEventsService {
  constructor(
    @Inject(AUTHOR_EVENT_INTERFACE)
    private readonly authorEventsRepository: IAuthorEventsRepository,
  ) {}

  @OnEvent(CREATE_AUTHOR_EVENT)
  async create(createBookEvent: CreateAuthorEventDto): Promise<void> {
    await this.authorEventsRepository.create(createBookEvent);
  }
}
