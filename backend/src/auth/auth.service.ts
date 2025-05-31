import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '@modules/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from 'models/jwt';
import { UserService } from '@modules/user/user.service';
import { Session } from 'types/session';
import { NotFoundError } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    private service: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserSession> {
    const { password: hash, ...rest } = await this.service.findByEmail(email);
    if (await bcrypt.compare(password, hash)) {
      return rest;
    }
    return null;
  }

  async login({
    id,
    name,
    lastName,
    surname,
    email,
    role,
    isActive,
    createdAt,
    updatedAt,
  }: User): Promise<Session> {
    const payload = { email: email, sub: id, role, isActive };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id,
        name,
        lastName,
        surname,
        email,
        role,
        isActive,
        createdAt,
        updatedAt,
      },
    };
  }

  async getUser(id: number) {
    const user = await this.service.repo.findOne({
      where: { id },
      select: {
        createdAt: true,
        email: true,
        id: true,
        isActive: true,
        lastName: true,
        name: true,
        role: true,
        surname: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundError('Usuario no encontrado.');
    }

    return user;
  }
}
