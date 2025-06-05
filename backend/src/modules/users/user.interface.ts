import { CreateUserDto, UpdateUserDto } from "../auth/dto";
import { User } from "./user.entity";

export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(filters: object): Promise<User | null>;
  update(id: number, user: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<void>;
}
