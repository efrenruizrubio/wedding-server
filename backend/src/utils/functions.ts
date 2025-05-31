import { Sanitizers } from '@constants/entities/sanitizer';
import { FindOptionsSelect, FindOptionsWhere } from 'typeorm';

export const falsyToNull = (obj: { [k: string]: any }) => {
  return Object.keys(obj).reduce(
    (acc: { [k: string]: FormDataEntryValue | null }, key) => {
      acc[key] = obj[key] || null;
      return acc;
    },
    {},
  );
};

export const removeEmptyValues = (obj: { [k: string]: any }) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  );
};

export const transformQueryParams = <T>(
  obj: FindOptionsWhere<T> | FindOptionsSelect<T>,
) => {
  const transformObject = {};

  Object.entries(obj).forEach(([key]) => {
    if (key.includes('.')) {
      const [entity, field] = key.split('.');

      if (entity) {
        if (!transformObject[entity]) {
          transformObject[entity] = {};
        }

        transformObject[entity][field] = true;
      }
    }
  });

  return transformObject;
};

export const sanitizeEntry = ({
  entity,
  entry,
}: {
  entity: string;
  entry: any;
}) => {
  return Sanitizers[entity](entry);
};
