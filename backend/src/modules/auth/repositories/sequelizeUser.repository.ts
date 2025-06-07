import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../../models/user.model";
import { User } from "../user.entity";
import { IUserRepository } from "../user.interface";
import { buildSequelizeFilters } from "src/common/utils/sequelizeFilters.util";
import { CreateUserDto } from "src/modules/auth/dto";

@Injectable()
export class UserSequelizeRepository implements IUserRepository {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  private toDomain(userModel: UserModel): User {
    return new User(
      userModel.id as number,
      userModel.name,
      userModel.email,
      userModel.password,
    );
  }

  async create(user: CreateUserDto): Promise<User> {
    const { name, email, password } = user;
    const created = await this.userModel.create({ name, email, password });
    if (created) {
      return this.toDomain(created.dataValues as UserModel);
    }
    throw new Error("Something Went Wrong");
  }

  async findOne(filters: object): Promise<User | null> {
    const processedFilters = buildSequelizeFilters(filters);
    const user = await this.userModel.findOne({ where: processedFilters });
    return user ? this.toDomain(user.dataValues as UserModel) : null;
  }
}
