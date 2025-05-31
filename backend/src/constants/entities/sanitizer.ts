import { User } from '@modules/entities';

export const Sanitizers = {
  [User.name]: ({ password, ...entry }: User) => {
    return entry;
  },
};
