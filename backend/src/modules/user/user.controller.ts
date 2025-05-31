import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateUserDTO } from './user.dto';
import { User } from './user.entity';
import { GenericController } from '@modules/generic/generic.controller';
import { Roles } from 'decorators/roles.decorator';
import { UserRole } from '@type/enums/user-role';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController extends GenericController(User, UpdateUserDTO) {
  constructor(private readonly service: UserService) {
    super();
  }

  getAll() {
    return this.service.getAllEntries();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('relations') relations?: string | string[],
    @Query('select') select?: string | string[],
  ) {
    return super.getOne(id, relations, select);
  }
}
