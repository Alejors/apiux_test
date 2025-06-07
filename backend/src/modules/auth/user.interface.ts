import { CreateUserDto } from "./dto";
import { User } from "./user.entity";

export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findOne(filters: object): Promise<User | null>;
}
