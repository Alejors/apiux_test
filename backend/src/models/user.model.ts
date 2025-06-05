import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
  paranoid: true,
  timestamps: true,
})
export class UserModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}
