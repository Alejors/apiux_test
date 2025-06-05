import { 
  Controller, 
  Post, 
  Body, 
  UseInterceptors, 
  HttpCode, 
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, AuthCredentialsDto } from './dto';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { ResponseUserDTO } from '../users/dto/response-user.dto';
import { ApiResponseType } from 'src/common/dto/responses.dto';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponseType<ResponseUserDTO>> {
    let message;
    let code;
    const data = await this.authService.register(createUserDto)
    if (data) {
      message = "User Created"
      code = "success"
    } else {
      message = "Failed Registration"
      code = "failed"
    }
    return { message, code, data };
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'User logged in Successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(CookieInterceptor)
  async login(@Body() loginUserDto: AuthCredentialsDto): Promise<{token: string}> {
    const token = await this.authService.login(loginUserDto);
    return { token }
  }
}
