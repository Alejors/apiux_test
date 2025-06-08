import { IsNumber } from "class-validator";
import { BaseEventDto } from "../../../common/dto/baseEvent.dto";
import { EventTypeEnum } from "../../../common/enums/eventType.enum";

export class CreateEditorialEventDto extends BaseEventDto {
  @IsNumber()
  editorial_id: number;
  constructor(
    editorial_id: number,
    user_id: number,
    event_type: EventTypeEnum,
    new_state: object,
    previous_state?: object,
  ) {
    super(user_id, event_type, new_state, previous_state);
    this.editorial_id = editorial_id;
  }
}
