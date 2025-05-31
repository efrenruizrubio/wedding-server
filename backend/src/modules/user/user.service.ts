import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { GenericService } from '@modules/generic/generic.service';
import { UserRole } from '@type/enums/user-role';
import { MailService } from '@modules/mail/mail.service';
import { ConfigService } from '@nestjs/config';

const saltOrRounds = 10;

@Injectable()
export class UserService extends GenericService(User) {
  constructor(
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) {
    super();
  }

  async create(body: CreateUserDTO): Promise<User> {
    const email = body.email.toLowerCase();

    const user = await this.repo.findOne({
      where: { email },
    });

    if (user)
      throw new ConflictException({
        message: 'El correo ya se encuentra registrado.',
      });

    const payload = {
      ...body,
      email,
      password: await bcrypt.hash(body.password, saltOrRounds),
    };

    const newUser = this.repo.create(payload);
    return this.repo.save(newUser);
  }

  async createCitizen(body: CreateUserDTO): Promise<User> {
    const email = body.email.toLowerCase();

    const user = await this.repo.findOne({
      where: { email },
    });
    if (user)
      throw new ConflictException({
        message: 'El correo ya se encuentra registrado.',
      });

    const payload = {
      ...body,
      email,
      isActive: false,
      role: UserRole.REVIEWER,
      password: await bcrypt.hash(body.password, saltOrRounds),
    };

    const newUser = this.repo.create(payload);

    const response = await this.repo.save(newUser);
    const { name, lastName, surname } = response;

    await this.mailService.sendMail({
      receiver: email,
      subject: 'Verificación de correo electrónico',
      template: './new-user',
      context: {
        name: this.getFullName(name, lastName, surname),
        url: `${this.configService.get('FRONTEND_URL')}/verificar-correo-electronico/${response.id}`,
      },
    });

    return response;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (user === null) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }

  async updateUser(body: UpdateUserDTO, id: number): Promise<User> {
    const user = await this.getOneEntry({ id });
    return this.repo.save({ ...user, ...body });
  }

  async delete(id: number): Promise<User> {
    const user = await this.getOneEntry({ id });

    user.isActive = false;

    return this.repo.save(user);
  }

  async getPersonalInfo(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      select: {
        email: true,
        name: true,
        lastName: true,
        surname: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const { email, name, lastName, surname } = user;

    return {
      email: email,
      fullName: this.getFullName(name, lastName, surname),
    };
  }

  getFullName(...variables: string[]): string {
    return variables.filter(Boolean).join(' ');
  }
}
