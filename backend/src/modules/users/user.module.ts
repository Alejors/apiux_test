import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserSequelizeRepository } from "./repositories/sequelizeUser.repository";
import { UserModel } from "src/models";
import { USERS_INTERFACE } from "src/constants";

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    {
      provide: USERS_INTERFACE,
      useClass: UserSequelizeRepository,
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
