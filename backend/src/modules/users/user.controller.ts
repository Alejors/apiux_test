import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { ResponseUserDTO } from "./dto/response-user.dto";
import { UpdateUserDto } from "../auth/dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ResponseUserDTO[]> {
    const users = await this.userService.findAll();
    return users.map((user: User) => ResponseUserDTO.fromUser(user));
  }

  @Put(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto): Promise<ResponseUserDTO> {
    return await this.userService.update(id, user);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
