import { IsObject, IsNumber, IsEnum, IsOptional } from "class-validator";
import { EventTypeEnum } from "src/common/enums/eventType.enum";

export class CreateBookEventDto {
  @IsNumber()
  book_id: number;

  @IsNumber()
  user_id: number;

  @IsEnum(EventTypeEnum)
  event_type: EventTypeEnum;

  @IsObject()
  @IsOptional()
  previous_state: object | null;

  @IsObject()
  new_state: object;

  constructor(book_id: number, user_id: number, event_type: EventTypeEnum, new_state: object, previous_state?: object){
    this.book_id = book_id;
    this.user_id = user_id;
    this.event_type = event_type;
    this.new_state = new_state;
    this.previous_state = previous_state ?? null;
  }
}
