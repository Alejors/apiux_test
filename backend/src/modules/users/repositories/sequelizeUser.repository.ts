import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../../models/user.model";
import { User } from "../user.entity";
import { IUserRepository } from "../user.interface";
import { buildSequelizeFilters } from "src/common/utils/sequelizeFilters.util";
import { CreateUserDto, UpdateUserDto } from "src/modules/auth/dto";

@Injectable()
export class UserSequelizeRepository implements IUserRepository {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  private toDomain(userModel: UserModel): User {
    return new User(
      userModel.id,
      userModel.name,
      userModel.email,
      userModel.password,
    );
  }

  async create(user: CreateUserDto): Promise<User> {
    const { name, email, password } = user;
    const created = await this.userModel.create({ name, email, password });
    if (created) {
      return this.toDomain(created.dataValues);
    }
    throw new Error("Something Went Wrong")
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll();
    return users.map((user) => this.toDomain(user));
  }

  async findOne(filters: object): Promise<User | null> {
    const processedFilters = buildSequelizeFilters(filters);
    const user = await this.userModel.findOne({ where: processedFilters });
    return user ? this.toDomain(user) : null;
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    await this.userModel.update(data, { where: { id } });
    const updated = await this.findOne({ id });
    if (!updated) {
      throw new Error("Something went wrong");
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.userModel.destroy({ where: { id } });
  }
}
