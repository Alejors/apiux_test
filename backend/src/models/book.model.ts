import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { AuthorModel } from "./author.model";
import { EditorialModel } from "./editorial.model";
import { GenreModel } from "./genre.model";

@Table({
  tableName: "books",
  paranoid: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      name: "unique_book_title_author_editorial",
      fields: ["title", "author_id", "editorial_id"],
    },
  ],
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url: string;

  @BelongsTo(() => AuthorModel, { as: "author", foreignKey: "author_id" })
  author: AuthorModel;

  @BelongsTo(() => EditorialModel, {
    as: "editorial",
    foreignKey: "editorial_id",
  })
  editorial: EditorialModel;

  @BelongsTo(() => GenreModel, { as: "genre", foreignKey: "genre_id" })
  genre: GenreModel;
}
