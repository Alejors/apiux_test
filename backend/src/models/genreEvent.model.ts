import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { UserModel } from "./user.model";
import { EventTypeEnum } from "src/common/enums/eventType.enum";
import { GenreModel } from "./genre.model";

@Table({
  tableName: "genre_events",
  timestamps: true,
  updatedAt: false,
  paranoid: false,
})
export class GenreEventModel extends Model {
  @ForeignKey(() => GenreModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  genre_id: number;

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
