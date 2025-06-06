import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UnauthorizedException,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto, AuthCredentialsDto } from "./dto";
import { CookieInterceptor } from "./interceptors/cookie.interceptor";
import { ResponseUserDTO } from "../users/dto/response-user.dto";
import { ApiResponseType } from "src/common/dto/responses.dto";
import { ClearCookieInterceptor } from "./interceptors/clearCookie.interceptor";
import { AuthGuard } from "src/common/guards/auth.guard";

const FAILED_ACCESS = "email and/or password incorrect.";
@Controller("auth")
@ApiTags("Authorization")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Registrarse al Servicio" })
  @ApiResponse({
    status: 201,
    description: "Registro Exitoso",
    schema: {
      example: {
        message: "Mensaje de Éxito",
        code: "Código de Éxito",
        data: "Información del usuario",
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Email Ya en Uso",
    schema: {
      example: {
        message: "Mensaje de Error",
        error: "Tipo de Error",
        statusCode: "Código del Error",
      },
    },
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseType<ResponseUserDTO>> {
    let message: string;
    let code: string;
    let data: ResponseUserDTO | null = null;
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
  @ApiOperation({ summary: "Iniciar Sesión" })
  @ApiResponse({
    status: 200,
    description: "Inicio de Sesión Exitoso",
    schema: {
      example: {},
    },
  })
  @ApiResponse({ status: 401, description: "No Autorizado" })
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

  @Get("check")
  @HttpCode(204)
  @ApiOperation({ summary: "Revisar Credenciales" })
  @ApiResponse({ status: 204, description: "Usuario Está Autenticado" })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  @UseGuards(AuthGuard)
  async checkCredentials(): Promise<void> {}

  @Post("logout")
  @HttpCode(204)
  @UseInterceptors(ClearCookieInterceptor)
  @ApiOperation({ summary: "Cerrar Sesión" })
  @ApiResponse({ status: 204, description: "Usuario Cerró Sesión" })
  async logoutUser(): Promise<void> {}
}
