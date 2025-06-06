import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { UserModel } from "./user.model";
import { EditorialModel } from "./editorial.model";
import { EventTypeEnum } from "src/common/enums/eventType.enum";

@Table({
  tableName: "editorial_events",
  timestamps: true,
  updatedAt: false,
  paranoid: false,
})
export class EditorialEventModel extends Model {
  @ForeignKey(() => EditorialModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  editorial_id: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(EventTypeEnum)),
    allowNull: false,
  })
  event_type: EventTypeEnum;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  previous_state: object;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  new_state: object;
}
