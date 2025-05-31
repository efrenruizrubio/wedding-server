import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { GenericService } from './generic.service';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { GenericUpdateEntityDto } from './generic.dto';

type Constructor<I> = new (...args: any[]) => I;

export function GenericController<T, UpdateDto>(
  entity: Constructor<T>,
  updateDto?: Constructor<UpdateDto>,
) {
  @Controller()
  class GenericController extends GenericService(entity) {
    constructor() {
      super();
    }

    @Get()
    async getAll() {
      return this.getAllEntries();
    }

    @Get(':id')
    @ApiQuery({
      name: 'join',
      required: false,
      type: 'array',
      description: 'Relations to include in the query',
    })
    @ApiQuery({
      name: 'select',
      required: false,
      type: 'array',
      description: 'Fields to select in the query',
    })
    async getOne(
      @Param('id') id: number,
      @Query('join') join?: string | string[],
      @Query('select') select?: string | string[],
    ) {
      const parsedJoins: FindOptionsRelations<T> = {};
      const parsedSelect: FindOptionsSelect<T> = {};

      if (join) {
        (typeof join === 'string' ? [join] : join).forEach((relation) => {
          parsedJoins[relation] = true;
        });
      }

      if (select) {
        (typeof select === 'string' ? [select] : select).forEach((field) => {
          parsedSelect[field] = true;
        });
      }

      return this.getOneEntry({
        id,
      });
    }

    @Get('/pagination/get-data')
    async data(@Query('page') page: number, @Query('limit') limit: number) {
      return this.getPaginatedData(page, limit);
    }

    @Patch(':id')
    @ApiBody({
      type: updateDto ?? GenericUpdateEntityDto,
      description: 'Update entity',
    })
    public async updateRecord(
      @Param('id', ParseIntPipe) id: number,
      @Body() payload: UpdateDto,
    ) {
      return this.update(id, payload);
    }
  }

  return GenericController;
}
