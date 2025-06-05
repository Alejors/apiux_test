import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../users/user.service";
import { CreateUserDto, AuthCredentialsDto } from "./dto";
import { User } from "../users/user.entity";

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

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  createToken(user: User) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async register(authCredentialsDto: CreateUserDto): Promise<User> {
    try {
      authCredentialsDto.password = await this.hashPassword(
        authCredentialsDto.password,
      );
      return await this.usersService.create(authCredentialsDto);
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "UniqueConstraintError"
      ) {
        throw new ConflictException("El correo ya está registrado");
      }
      throw error;
    }
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<string | null> {
    let user;
    const email = authCredentialsDto.email;
    const password = authCredentialsDto.password;
    try {
      user = await this.usersService.findOne({ email });
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log("User Not Found on Log in Attempt");
        return null;
      }
    }
    const hashedPassword = user.password;
    const passwordMatch = await this.comparePassword(password, hashedPassword);
    if (!passwordMatch) {
      console.log("Wrong Password");
      return null;
    }
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
