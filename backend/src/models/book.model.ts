import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { AuthorModel } from "./author.model";
import { EditorialModel } from "./editorial.model";
import { GenreModel } from "./genre.model";

@Table({
  tableName: "books",
  paranoid: true,
  timestamps: true,
})
export class BookModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ForeignKey(() => AuthorModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  author_id: number;

  @ForeignKey(() => EditorialModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  editorial_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  availability: boolean;

  @ForeignKey(() => GenreModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  genre_id: number;
}
