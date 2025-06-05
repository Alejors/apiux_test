import { CreateBookEventDto } from "./dto/bookEvent.dto";

export interface IBookEventsRepository {
  create(book: CreateBookEventDto): Promise<void>;
}
