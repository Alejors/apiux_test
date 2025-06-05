import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({
  tableName: "authors",
  timestamps: true,
  paranoid: true,
})
export class AuthorModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
