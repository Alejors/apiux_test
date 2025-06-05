import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({
  tableName: "editorials",
  timestamps: true,
  paranoid: true,
})
export class EditorialModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
