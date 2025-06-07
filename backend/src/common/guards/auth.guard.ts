import { Observable } from "rxjs";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../modules/auth/auth.service";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    if (!cookies) {
      throw new UnauthorizedException("Not Logged In");
    }
    const token = cookies["access_token"];
    if (!token) {
      throw new UnauthorizedException("Not Logged In");
    }
    try {
      const decoded = this.authService.verifyToken(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid Token");
    }
  }
}
