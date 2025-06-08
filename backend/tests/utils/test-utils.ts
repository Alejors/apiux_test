import { EventEmitterModule } from "@nestjs/event-emitter";
import { Model } from "sequelize-typescript";
import { ConfigModule } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { INestApplication } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import jwtConfig from "../../src/config/jwt.config";

export async function createTestModule(
  entities: (typeof Model)[],
  imports: any[] = [],
  providers: any[] = [],
  controllers: any[] = [],
) {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
      SequelizeModule.forRoot({
        dialect: "sqlite",
        storage: ":memory:",
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
      SequelizeModule.forFeature(entities),
      ...imports,
    ],
    controllers,
    providers,
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.use(cookieParser());
  await app.init();

  return { app, moduleRef };
}
