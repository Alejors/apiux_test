import { Sequelize } from "sequelize-typescript";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CREATE_GENRE_EVENT } from "../../constants";
import { GenreEventsModule } from "./genreEvent.module";
import { CreateGenreEventDto } from "./dto/genreEvent.dto";

import { UserModel } from "../../models/user.model";
import { GenreModel } from "../../models/genre.model";
import { GenreEventModel } from "../../models/genreEvent.model";

import { EventTypeEnum } from "../../common/enums/eventType.enum";
import { createTestModule } from "../../../tests/utils/test-utils";

describe("GenreEvents Service", () => {
  let eventEmitter: EventEmitter2;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const { moduleRef } = await createTestModule(
      [UserModel, GenreEventModel, GenreModel],
      [GenreEventsModule],
    );

    eventEmitter = moduleRef.get(EventEmitter2);
    sequelize = moduleRef.get(Sequelize);

    await UserModel.create({
      id: 1,
      name: "Test User",
      email: "test@test.com",
      password: "test",
    });

    await GenreModel.create({
      id: 1,
      name: "Genre",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("debería insertar un evento de Genero al emitir", async () => {
    const payload: CreateGenreEventDto = {
      genre_id: 1,
      user_id: 1,
      event_type: EventTypeEnum.DELETE,
      previous_state: { random: "state" },
      new_state: { random: "state", deletedAt: "date" },
    };

    eventEmitter.emit(CREATE_GENRE_EVENT, payload);

    await new Promise((res) => setTimeout(res, 200));

    const found = await GenreEventModel.findOne({ where: { genre_id: 1 } });

    expect(found).toBeDefined();

    const data = found?.dataValues;
    expect(data.user_id).toBe(payload.user_id);
    expect(data.event_type).toBe("DELETE");
    expect(data.new_state).toHaveProperty("deletedAt");
  });
});
