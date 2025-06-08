import { Sequelize } from "sequelize-typescript";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CREATE_BOOK_EVENT } from "../../constants";
import { BooksEventsModule } from "./bookEvent.module";
import { CreateBookEventDto } from "./dto/bookEvent.dto";

import { UserModel } from "../../models/user.model";
import { BookModel } from "../../models/book.model";
import { GenreModel } from "../../models/genre.model";
import { AuthorModel } from "../../models/author.model";
import { EditorialModel } from "../../models/editorial.model";
import { BookEventModel } from "../../models/bookEvent.model";

import { EventTypeEnum } from "../../common/enums/eventType.enum";
import { createTestModule } from "../../../tests/utils/test-utils";

describe("BookEvents Service", () => {
  let eventEmitter: EventEmitter2;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const { moduleRef } = await createTestModule(
      [
        UserModel,
        BookModel,
        BookEventModel,
        GenreModel,
        EditorialModel,
        AuthorModel,
      ],
      [BooksEventsModule],
    );

    eventEmitter = moduleRef.get(EventEmitter2);
    sequelize = moduleRef.get(Sequelize);

    await UserModel.create({
      id: 1,
      name: "Test User",
      email: "test@test.com",
      password: "test",
    });

    await AuthorModel.create({
      id: 1,
      name: "Author",
    });

    await EditorialModel.create({
      id: 1,
      name: "Editorial",
    });

    await GenreModel.create({
      id: 1,
      name: "Genre",
    });

    await BookModel.create({
      id: 1,
      title: "test title",
      author_id: 1,
      editorial_id: 1,
      price: 1,
      availability: true,
      genre_id: 1,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("debería insertar un evento de libro al emitir", async () => {
    const payload: CreateBookEventDto = {
      book_id: 1,
      user_id: 1,
      event_type: EventTypeEnum.CREATE,
      previous_state: null,
      new_state: { random: "state" },
    };

    eventEmitter.emit(CREATE_BOOK_EVENT, payload);

    await new Promise((res) => setTimeout(res, 200));

    const found = await BookEventModel.findOne({ where: { book_id: 1 } });

    expect(found).toBeDefined();

    const data = found?.dataValues;
    expect(data.user_id).toBe(payload.user_id);
    expect(data.event_type).toBe("CREATE");
  });
});
