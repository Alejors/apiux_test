import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { CreateUserDto, AuthCredentialsDto } from "./dto";
import { ResponseUserDTO } from "../users/dto/response-user.dto";

const SALT = 10;
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT);
  }

  async register(
    authCredentialsDto: CreateUserDto,
  ): Promise<ResponseUserDTO | null> {
    authCredentialsDto.password = await this.hashPassword(
      authCredentialsDto.password,
    );
    const data = await this.usersService.create(authCredentialsDto);
    if (data) {
      return data;
    }
    return null;
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const email = authCredentialsDto.email;
    const user = await this.usersService.findOne({ email });
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
