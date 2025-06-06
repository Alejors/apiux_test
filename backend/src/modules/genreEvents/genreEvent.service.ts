import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CREATE_GENRE_EVENT, GENRE_EVENT_INTERFACE } from "src/constants";
import { IGenreEventsRepository } from "./genreEvent.interface";
import { CreateGenreEventDto } from "./dto/genreEvent.dto";

@Injectable()
export class GenreEventsService {
  constructor(
    @Inject(GENRE_EVENT_INTERFACE)
    private readonly genreEventsRepository: IGenreEventsRepository,
  ) {}

  @OnEvent(CREATE_GENRE_EVENT)
  async create(createGenreEvent: CreateGenreEventDto): Promise<void> {
    await this.genreEventsRepository.create(createGenreEvent);
  }
}
