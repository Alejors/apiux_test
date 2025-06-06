import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";

const userMock = new User(1, "Test", "test@mail.com", "hashed");

const userServiceMock = {
  create: jest.fn().mockResolvedValue(userMock),
  findAll: jest.fn().mockResolvedValue([userMock]),
  findOne: jest.fn().mockResolvedValue(userMock),
  update: jest.fn().mockResolvedValue(userMock),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return all users", async () => {
    await expect(controller.findAll()).resolves.toEqual([userMock]);
  });

  it("should update a user", async () => {
    await expect(controller.update(1, {} as any)).resolves.toEqual(userMock);
  });

  it("should remove a user", async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
  });
});
