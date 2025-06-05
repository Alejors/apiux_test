import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { UserService } from "../users/user.service";
import { UserSequelizeRepository } from "../users/repositories/sequelizeUser.repository";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "src/models";

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
    AuthService,
    {
      provide: "IUserRepository",
      useClass: UserSequelizeRepository,
    },
    UserService,
  ],
})
export class AuthModule { }
