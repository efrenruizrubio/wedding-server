import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Constructor } from 'types/generic';
import { sanitizeEntry, transformQueryParams } from 'utils/functions';
import { GenericServiceOptions } from '@type/generic-service';

export function GenericService<T>(
  entity: Constructor<T>,
  options?: GenericServiceOptions<T>,
) {
  class Generic {
    @InjectRepository(entity) public readonly repo: Repository<T>;

    filters: FindOptionsWhere<T> = {};
    getOptionSelect: FindOptionsSelect<T> = {};
    getTableSelect: FindOptionsSelect<T> = {};
    allowedRelations: FindOptionsRelations<T> = {};
    getOneSelect: FindOptionsSelect<T> = { id: true, isActive: true } as any;
    buildOptionLabel: (values) => string = (values) => {
      const data = Object.entries(values).filter(([, value]) => value);

      return data
        .map(([key, value]) => (key === 'id' ? `[${value}]: ` : value))
        .join('  ');
    };

    constructor() {
      if (options) {
        const {
          allowedRelations,
          buildOptionLabel,
          getOneSelect,
          getOptionSelect,
          getTableSelect,
          filters,
        } = options;

        this.buildOptionLabel = buildOptionLabel ?? this.buildOptionLabel;
        this.filters = filters ?? this.filters;
        this.allowedRelations = allowedRelations ?? this.allowedRelations;
        this.getOneSelect = getOneSelect ?? this.getOneSelect;
        this.getOptionSelect = getOptionSelect ?? this.getOptionSelect;
        this.getTableSelect = getTableSelect ?? this.getTableSelect;
      }
    }

    async getAllEntries() {
      return this.repo.find({
        where: this.filters,
        select: this.getOneSelect,
        relations: this.allowedRelations,
      });
    }

    async getPaginatedData(page: number, limit: number) {
      const [list, count] = await this.repo.findAndCount({
        where: this.filters,
        select: this.getTableSelect,
        relations: this.allowedRelations,
        take: limit,
        order: { id: 'ASC' } as any,
        skip: (page - 1) * limit,
      });

      return {
        list,
        count,
        totalPages: Math.ceil(count / limit),
      };
    }

    async getOneEntry({ id }: { id: number }) {
      const entry = await this.repo.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        relations: this.allowedRelations,
        select: transformQueryParams(this.getOneSelect),
      });

      if (!entry) {
        throw new NotFoundException(
          `No se encontró el registro con el ID \'${id}\'.`,
        );
      }

      return sanitizeEntry({ entity: entity.name, entry });
    }

    async getSelectOptions() {
      const elements = await this.repo.find({
        where: { isActive: true } as any,
        select: this.getOptionSelect,
      });

      return elements.map((element) => ({
        id: element['id'],
        label: this.buildOptionLabel(element),
      }));
    }

    async create(payload) {
      const record = this.repo.create({ ...(payload as any) });

      return (await this.repo.save(record)) as T;
    }

    async update(id: number, payload: any) {
      const entry = await this.getOneEntry({ id });

      return await this.repo.save({ ...entry, ...payload });
    }
  }

  return Generic;
}
