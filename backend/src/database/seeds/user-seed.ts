import bcrypt from 'bcrypt';
import { UserRole } from '../../types/enums/user-role';
import { User } from '@modules/user/user.entity';
const saltRounds = 10;

export const UserSeed: User[] = [
  {
    id: 0,
    name: 'Admin',
    lastName: 'COMUNN',
    email: 'educavial@zapopan.gob.mx',
    password: '123456',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: 0,
    name: 'Efrén',
    lastName: 'Ruíz',
    surname: 'Rubio',
    email: 'efren.ruiz@zapopan.gob.mx',
    password: '123456',
    role: UserRole.REVIEWER,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
];

export async function encryptPassword(pass: string) {
  const password = await bcrypt.hash(pass, saltRounds);
  return password;
}
