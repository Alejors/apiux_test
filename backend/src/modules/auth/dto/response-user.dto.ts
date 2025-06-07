import { User } from "../../auth/user.entity";
import { IsString, IsEmail, IsNumber } from "class-validator";

export class ResponseUserDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromUser(user: User): ResponseUserDTO {
    return new ResponseUserDTO(user.id, user.name, user.email);
  }
}
