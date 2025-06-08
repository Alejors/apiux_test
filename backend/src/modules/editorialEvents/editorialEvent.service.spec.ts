import { Sequelize } from "sequelize-typescript";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CREATE_EDITORIAL_EVENT } from "../../constants";
import { EditorialEventsModule } from "./editorialEvent.module";
import { CreateEditorialEventDto } from "./dto/editorialEvent.dto";

import { UserModel } from "../../models/user.model";
import { EditorialModel } from "../../models/editorial.model";
import { EditorialEventModel } from "../../models/editorialEvent.model";

import { EventTypeEnum } from "../../common/enums/eventType.enum";
import { createTestModule } from "../../../tests/utils/test-utils";
import { ModuleRef } from "@nestjs/core";

describe("EditorialEvents Service", () => {
  let eventEmitter: EventEmitter2;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const { moduleRef } = await createTestModule(
      [UserModel, EditorialEventModel, EditorialModel],
      [EditorialEventsModule],
    );

    eventEmitter = moduleRef.get(EventEmitter2);
    sequelize = moduleRef.get(Sequelize);

    await UserModel.create({
      id: 1,
      name: "Test User",
      email: "test@test.com",
      password: "test",
    });

    await EditorialModel.create({
      id: 1,
      name: "Editorial",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("debería crear evento de editorial al emitir", async () => {
    const payload: CreateEditorialEventDto = {
      editorial_id: 1,
      user_id: 1,
      event_type: EventTypeEnum.UPDATE,
      previous_state: { random: "state" },
      new_state: { random: "different" },
    };

    eventEmitter.emit(CREATE_EDITORIAL_EVENT, payload);

    await new Promise((res) => setTimeout(res, 200));

    const found = await EditorialEventModel.findOne({
      where: { editorial_id: 1 },
    });

    expect(found).toBeDefined();

    const data = found?.dataValues;
    expect(data.editorial_id).toBe(payload.editorial_id);
    expect(data.event_type).toBe("UPDATE");
  });
});
