import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

const userMock = new User(1, 'Test', 'test@mail.com', 'hashed');

const userRepositoryMock = {
  create: jest.fn().mockResolvedValue(userMock),
  findAll: jest.fn().mockResolvedValue([userMock]),
  findOne: jest.fn().mockResolvedValue(userMock),
  update: jest.fn().mockResolvedValue(userMock),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'IUserRepository', useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    await expect(service.create({} as any)).resolves.toEqual(userMock);
  });

  it('should return all users', async () => {
    await expect(service.findAll()).resolves.toEqual([userMock]);
  });

  it('should return a user by filter', async () => {
    await expect(service.findOne({ id: 1 })).resolves.toEqual(userMock);
  });

  it('should throw NotFoundException if user not found', async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne({ id: 999 })).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    await expect(service.update(1, {} as any)).resolves.toEqual(userMock);
  });

  it('should remove a user', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
