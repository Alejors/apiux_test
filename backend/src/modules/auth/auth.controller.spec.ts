import * as request from "supertest";
import { INestApplication } from "@nestjs/common";

import { UserModel } from "../../models/user.model";
import { AuthModule } from "./auth.module";
import { createTestModule } from "../../../tests/utils/test-utils";

describe("AuthController", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { app: testApp } = await createTestModule([UserModel], [AuthModule]);
    app = testApp;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/auth/register (POST)", () => {
    it("debería registrar un usuario exitosamente", async () => {
      const res = await request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "test@example.com",
          name: "Test User",
          password: "12345678",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        message: "User Created",
        code: "success",
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });
    });

    it("debería fallar al registrar un email repetido", async () => {
      // El mismo correo del test anterior
      const res = await request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "test@example.com",
          name: "Otro",
          password: "12345678",
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe("/auth/login (POST)", () => {
    it("debería iniciar sesión con credenciales válidas y setear la cookie", async () => {
      const res = await request(app.getHttpServer()).post("/auth/login").send({
        email: "test@example.com",
        password: "12345678",
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"][0]).toMatch(/token=.*HttpOnly/);
    });

    it("debería fallar con credenciales incorrectas", async () => {
      const res = await request(app.getHttpServer()).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpass",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Correo y/o Contraseña Incorrectos.");
    });
  });

  describe("/auth/check (GET)", () => {
    let cookie: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer()).post("/auth/login").send({
        email: "test@example.com",
        password: "12345678",
      });

      const cookies = res.headers["set-cookie"];

      if (!cookies || !Array.isArray(cookies)) {
        throw new Error("No se recibió ninguna cookie del login");
      }

      const accessTokenCookie = cookies.find((c) => c.startsWith("access_token="));
      if (!accessTokenCookie) {
        throw new Error("No se encontró la cookie access_token");
      }

      const match = accessTokenCookie.match(/(access_token=[^;]+);?/);
      if (!match) {
        throw new Error("No se pudo extraer el token");
      }
      cookie = match[1];
    });

    it("debería retornar 204 si la cookie del token es válida", async () => {
      const res = await request(app.getHttpServer())
        .get("/auth/check")
        .set("Cookie", cookie);

      expect(res.statusCode).toBe(204);
    });

    it("debería retornar 401 si no se envía la cookie", async () => {
      const res = await request(app.getHttpServer()).get("/auth/check");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("/auth/logout (POST)", () => {
    it("debería retornar 204", async () => {
      const res = await request(app.getHttpServer()).post("/auth/logout");
      expect(res.statusCode).toBe(204);

      const setCookieHeader = res.headers["set-cookie"];
      expect(setCookieHeader).toBeDefined();

      const cleared = /access_token=;/.test(setCookieHeader);
      expect(cleared).toBe(true);
    });
  });
});
