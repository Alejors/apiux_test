import { IsNumber } from "class-validator";
import { BaseEventDto } from "../../../common/dto/baseEvent.dto";
import { EventTypeEnum } from "../../../common/enums/eventType.enum";

export class CreateAuthorEventDto extends BaseEventDto {
  @IsNumber()
  author_id: number;
  constructor(
    author_id: number,
    user_id: number,
    event_type: EventTypeEnum,
    new_state: object,
    previous_state?: object,
  ) {
    super(user_id, event_type, new_state, previous_state);
    this.author_id = author_id;
  }
}
