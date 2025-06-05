import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "./user.interface";
import { User } from "./user.entity";
import { CreateUserDto, UpdateUserDto } from "../auth/dto";
import { ResponseUserDTO } from "./dto/response-user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDTO> {
    const userCreated = await this.userRepository.create(createUserDto);
    return ResponseUserDTO.fromUser(userCreated);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(filters: object): Promise<User> {
    const user = await this.userRepository.findOne(filters);
    if (!user) {
      throw new NotFoundException("User Not Found");
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDTO> {
    const userExist = await this.findOne({ id });
    const userUpdated = await this.userRepository.update(
      userExist.id,
      updateUserDto,
    );
    return ResponseUserDTO.fromUser(userUpdated);
  }

  async remove(id: number): Promise<void> {
    const userExist = await this.findOne({ id });
    await this.userRepository.remove(userExist.id);
  }
}
