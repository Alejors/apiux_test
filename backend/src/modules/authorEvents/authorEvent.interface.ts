import { CreateAuthorEventDto } from "./dto/authorEvent.dto";

export interface IAuthorEventsRepository {
  create(author: CreateAuthorEventDto): Promise<void>;
}
