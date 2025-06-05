import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserSequelizeRepository } from "./repositories/sequelizeUser.repository";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "src/models";

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    {
      provide: "IUserRepository",
      useClass: UserSequelizeRepository,
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
