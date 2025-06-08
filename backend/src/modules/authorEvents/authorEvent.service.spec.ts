import { Sequelize } from "sequelize-typescript";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CREATE_AUTHOR_EVENT } from "../../constants";
import { AuthorEventsModule } from "./authorEvent.module";
import { CreateAuthorEventDto } from "./dto/authorEvent.dto";

import { UserModel } from "../../models/user.model";
import { AuthorModel } from "../../models/author.model";
import { AuthorEventModel } from "../../models/authorEvent.model";

import { EventTypeEnum } from "../../common/enums/eventType.enum";
import { createTestModule } from "../../../tests/utils/test-utils";

describe("AuthorEvents Service", () => {
  let eventEmitter: EventEmitter2;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const { moduleRef } = await createTestModule(
      [UserModel, AuthorEventModel, AuthorModel],
      [AuthorEventsModule],
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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("debería insertar un evento de autor al emitir", async () => {
    const payload: CreateAuthorEventDto = {
      author_id: 1,
      user_id: 1,
      event_type: EventTypeEnum.CREATE,
      previous_state: null,
      new_state: { random: "state" },
    };

    eventEmitter.emit(CREATE_AUTHOR_EVENT, payload);

    await new Promise((res) => setTimeout(res, 200));

    const found = await AuthorEventModel.findOne({ where: { author_id: 1 } });

    expect(found).toBeDefined();

    const data = found?.dataValues;
    expect(data.user_id).toBe(payload.user_id);
    expect(data.event_type).toBe("CREATE");
  });
});
