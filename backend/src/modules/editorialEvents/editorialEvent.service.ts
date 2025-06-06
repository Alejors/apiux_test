import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  CREATE_EDITORIAL_EVENT,
  EDITORIAL_EVENT_INTERFACE,
} from "src/constants";
import { IEditorialEventsRepository } from "./editorialEvent.interface";
import { CreateEditorialEventDto } from "./dto/editorialEvent.dto";

@Injectable()
export class EditorialEventsService {
  constructor(
    @Inject(EDITORIAL_EVENT_INTERFACE)
    private readonly editorialEventsRepository: IEditorialEventsRepository,
  ) {}

  @OnEvent(CREATE_EDITORIAL_EVENT)
  async create(createEditorialEvent: CreateEditorialEventDto): Promise<void> {
    await this.editorialEventsRepository.create(createEditorialEvent);
  }
}
