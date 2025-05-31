import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({ example: 'Johndoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'text' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
