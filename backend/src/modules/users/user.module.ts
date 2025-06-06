import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserService } from "./user.service";
import { UserSequelizeRepository } from "./repositories/sequelizeUser.repository";
import { UserModel } from "src/models";
import { USERS_INTERFACE } from "src/constants";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    forwardRef(() => AuthModule),
  ],
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
