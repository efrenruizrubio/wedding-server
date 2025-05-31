import type {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export interface GenericServiceOptions<T> {
  filters?: FindOptionsWhere<T>;
  getOptionSelect?: FindOptionsSelect<T>;
  getTableSelect?: FindOptionsSelect<T>;
  allowedRelations?: FindOptionsRelations<T>;
  getOneSelect?: FindOptionsSelect<T>;
  buildOptionLabel?: (values) => string;
}
