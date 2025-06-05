import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UnauthorizedException,
  HttpCode,
} from "@nestjs/common";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto, AuthCredentialsDto } from "./dto";
import { CookieInterceptor } from "./interceptors/cookie.interceptor";
import { ResponseUserDTO } from "../users/dto/response-user.dto";
import { ApiResponseType } from "src/common/dto/responses.dto";
import { ClearCookieInterceptor } from "./interceptors/clearCookie.interceptor";

const FAILED_ACCESS = "email and/or password incorrect.";
@Controller("auth")
@ApiTags("Authorization")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiResponse({ status: 201, description: "Registration Successful" })
  @ApiResponse({ status: 409, description: "Email is Already Registered" })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseType<ResponseUserDTO>> {
    let message;
    let code;
    let data;
    const response = await this.authService.register(createUserDto);
    if (response) {
      data = ResponseUserDTO.fromUser(response);
      message = "User Created";
      code = "success";
    } else {
      message = "Failed Registration";
      code = "failed";
    }
    return { message, code, data };
  }

  @Post("login")
  @HttpCode(200)
  @ApiResponse({ status: 200, description: "User logged in Successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseInterceptors(CookieInterceptor)
  async login(
    @Body() loginUserDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const token = await this.authService.login(loginUserDto);
    if (!token) {
      throw new UnauthorizedException(FAILED_ACCESS);
    }
    return { token };
  }

  @Post("logout")
  @HttpCode(204)
  @UseInterceptors(ClearCookieInterceptor)
  @ApiResponse({ status: 204, description: "User logged out successfully" })
  async logoutUser(): Promise<void> {}
}
