import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDTO {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ example: 'Domínguez' })
  @IsString()
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty({ example: 'juanperez@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'secreto' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {}

export class CreateUserDTO extends CreateAdminDTO {}

export class UpdateUserDTO extends PartialType(CreateAdminDTO) {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: boolean;
}
