import { ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { AuthGuard } from "./auth.guard";
import { AuthService } from "../../modules/auth/auth.service";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    authService = { verifyToken: jest.fn() } as any;
    guard = new AuthGuard(authService);
  });

  it("debería permitir el acceso si el token es válido", () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { access_token: "valid-token" },
        }),
      }),
    } as unknown as ExecutionContext;

    (authService.verifyToken as jest.Mock).mockReturnValue({ userId: 1 });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it("debería lanzar UnauthorizedException si no hay token", () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ cookies: {} }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
  });
});
