import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { LoggerModule } from "./modules/logger/logger.module";
import { UserModule } from "./modules/users/user.module";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "./models";

// TODO: agregar books y export modules
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DOCKER_DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [UserModel]
    }),
    AuthModule,
    UserModule,
    LoggerModule,
  ],
})
export class AppModule {}
