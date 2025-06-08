import { IsNumber } from "class-validator";

import { BaseEventDto } from "../../../common/dto/baseEvent.dto";
import { EventTypeEnum } from "../../../common/enums/eventType.enum";

export class CreateBookEventDto extends BaseEventDto {
  @IsNumber()
  book_id: number;

  constructor(
    book_id: number,
    user_id: number,
    event_type: EventTypeEnum,
    new_state: object,
    previous_state?: object,
  ) {
    super(user_id, event_type, new_state, previous_state);
    this.book_id = book_id;
  }
}
