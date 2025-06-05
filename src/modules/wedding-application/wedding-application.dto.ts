import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class WeddingApplicationDto {
  @ApiProperty({ example: 'Efrén Ruíz Rubio' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: '3312345678' })
  @IsNumberString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ example: 'efren@email.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Name or link to the song' })
  @IsString()
  @IsNotEmpty()
  readonly song: string;
}
