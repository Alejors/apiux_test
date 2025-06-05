import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    UserModule,
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
  providers: [AuthService],
  exports: [AuthModule, JwtModule, AuthService]
})
export class AuthModule {}
