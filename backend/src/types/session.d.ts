import { User } from '@modules/user/user.entity';

export interface Session {
  token: string;
  user: Omit<User, 'password'>;
}
