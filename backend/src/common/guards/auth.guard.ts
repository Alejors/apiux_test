import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies["access_token"];
    if (!token) {
      throw new UnauthorizedException("Not Logged In");
    }
    try {
      const decoded = this.authService.verifyToken(token);
      request.user = decoded;
      return true;
    } catch (Error) {
      throw new UnauthorizedException("Invalid Token");
    }
  }
}
