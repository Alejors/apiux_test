import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";

import { User } from "./user.entity";
import { UpdateUserDto } from "../auth/dto";
import { UserService } from "./user.service";
import { ResponseUserDTO } from "./dto/response-user.dto";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller("users")
@ApiTags("Users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get All Users" })
  @ApiResponse({ status: 200, description: "Collect All Users" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  async findAll(): Promise<ResponseUserDTO[]> {
    const users = await this.userService.findAll();
    return users.map((user: User) => ResponseUserDTO.fromUser(user));
  }

  /**Este método no debería recibir el id como query param, sino que debería usarse el decorador custom para extraer el id propio desde el token y sólo permitir actualizar información propia. No existen roles actualmente como para permitir también que admins actualicen a otros usuarios. Sin embargo esta consideración escapa del scope del requerimiento y se dejará así de momento. */
  @Put(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Update User" })
  @ApiResponse({ status: 200, description: "User Updated" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<ResponseUserDTO> {
    return await this.userService.update(id, user);
  }

  /**Mismas consideraciones del update de usuarios. No está dentro de lo solicitado la eliminación de usuarios y no se trabajará en ello. A pesar de tener consciencia que esto no es la mejor práctica. */
  @Delete(":id")
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Delete User" })
  @ApiResponse({ status: 204, description: "User Deleted" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
