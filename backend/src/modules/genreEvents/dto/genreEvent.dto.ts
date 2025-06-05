import { IsNumber } from "class-validator";
import { BaseEventDto } from "src/common/dto/baseEvent.dto";
import { EventTypeEnum } from "src/common/enums/eventType.enum";

export class CreateGenreEventDto extends BaseEventDto {
  @IsNumber()
  genre_id: number;

  constructor(genre_id: number, user_id: number, event_type: EventTypeEnum, new_state: object, previous_state?: object){
    super(user_id, event_type, new_state, previous_state)
    this.genre_id = genre_id;
  }
}
