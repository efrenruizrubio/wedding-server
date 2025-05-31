import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class GenericUpdateEntityDto {
  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
