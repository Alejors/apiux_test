import { Model } from "sequelize-typescript";
import { ConfigModule } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ExecutionContext, INestApplication } from "@nestjs/common";

import jwtConfig from "../../src/config/jwt.config";
import { AuthGuard } from "../../src/common/guards/auth.guard";

export async function createTestModule(
  entities: (typeof Model)[],
  imports: any[] = [],
  providers: any[] = [],
  controllers: any[] = [],
  overrideGuard: boolean = false,
) {
  const moduleBuilder = Test.createTestingModule({
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
  });

  if (overrideGuard) {
    moduleBuilder.overrideGuard(AuthGuard).useValue({
      canActivate: (context: ExecutionContext) => true,
    });
  }

  const moduleRef: TestingModule = await moduleBuilder.compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.use(cookieParser());
  await app.init();

  return { app, moduleRef };
}
