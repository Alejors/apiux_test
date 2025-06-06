import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { UserModel } from "./user.model";
import { AuthorModel } from "./author.model";
import { EventTypeEnum } from "src/common/enums/eventType.enum";

@Table({
  tableName: "author_events",
  timestamps: true,
  updatedAt: false,
  paranoid: false,
})
export class AuthorEventModel extends Model {
  @ForeignKey(() => AuthorModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  author_id: number;

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
