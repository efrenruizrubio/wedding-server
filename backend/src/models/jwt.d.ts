import { User } from '@modules/user/user.entity';
import { UserRole } from '@type/enums/user-role';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export type UserSession = Omit<User, 'password'>;
