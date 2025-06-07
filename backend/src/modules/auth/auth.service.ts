import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User } from "./user.entity";
import { USERS_INTERFACE } from "src/constants";
import { IUserRepository } from "./user.interface";
import { CreateUserDto, AuthCredentialsDto } from "./dto";

const SALT = 10;
@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_INTERFACE)
    private readonly userRepository: IUserRepository,
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

  verifyToken(token: string) {
    return this.jwtService.verify(token);
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
      return await this.userRepository.create(authCredentialsDto);
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
    let user: User | null = null;
    const email = authCredentialsDto.email;
    const password = authCredentialsDto.password;
    try {
      user = await this.userRepository.findOne({ email });
      if (!user) return null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
    }

    const hashedPassword = user?.password as string;
    const passwordMatch = await this.comparePassword(password, hashedPassword);
    if (!passwordMatch) {
      return null;
    }

    const payload = { id: user?.id, email: user?.email };
    return this.jwtService.sign(payload);
  }
}
