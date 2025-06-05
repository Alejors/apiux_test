import { CreateEditorialEventDto } from "./dto/editorialEvent.dto";

export interface IEditorialEventsRepository {
  create(editorial: CreateEditorialEventDto): Promise<void>;
}
