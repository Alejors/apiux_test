import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthCredentialsDto {
  @ApiProperty({
    example: "user@test.com",
    description: "Correo electrónico registrado",
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: "abc123",
    description: "Contraseña utilizada al registrarse",
  })
  @IsString()
  password: string;
}
