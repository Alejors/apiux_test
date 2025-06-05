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
  previous_state: object;

  @IsObject()
  new_state: object;
}
