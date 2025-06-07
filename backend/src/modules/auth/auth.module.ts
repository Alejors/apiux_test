import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { UserModel } from "src/models";
import { AuthService } from "./auth.service";
import { USERS_INTERFACE } from "src/constants";
import { AuthController } from "./auth.controller";
import { UserSequelizeRepository } from "./repositories/sequelizeUser.repository";

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("jwt.secret"),
        signOptions: {
          expiresIn: config.get<string>("jwt.expiresIn"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USERS_INTERFACE,
      useClass: UserSequelizeRepository,
    },
    AuthService,
  ],
  exports: [AuthModule, JwtModule, AuthService],
})
export class AuthModule {}
