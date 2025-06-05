import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({
  tableName: "genres",
  timestamps: true,
  paranoid: true,
})
export class GenreModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
