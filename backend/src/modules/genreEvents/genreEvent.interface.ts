import { CreateGenreEventDto } from "./dto/genreEvent.dto";

export interface IGenreEventsRepository {
  create(genre: CreateGenreEventDto): Promise<void>;
}
