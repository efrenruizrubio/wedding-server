import { Injectable } from '@nestjs/common';

import { MailService } from '@modules/mail/mail.service';
import { Repository } from 'typeorm';
import { WeddingApplication } from './wedding-application.entity';
import { WeddingApplicationDto } from './wedding-application.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WeddingApplicationService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(WeddingApplication) private readonly repo: Repository<WeddingApplication>,
  ) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async sendEmail({ email, name }: { email: string; name: string }) {
    await this.mailService.sendMail({
      receiver: email,
      subject: 'Confirmación de asistencia Boda N&E',
      template: 'wedding-application',
      context: {
        name: name,
        email,
      },
    });
  }

  async create({ email, ...payload }: WeddingApplicationDto) {
    try {
      const emailExists = await this.findByEmail(email);

      if (emailExists) {
        await this.sendEmail({ email, name: payload.name });
        return this.repo.save({ ...emailExists, ...payload });
      }

      const weddingApplication = this.repo.create({ email, ...payload });

      await this.repo.save(weddingApplication);

      await this.mailService.sendMail({
        receiver: email,
        subject: 'Confirmación de asistencia Boda N&E',
        template: 'wedding-application',
        context: {
          name: weddingApplication.name,
          email,
        },
      });
      return weddingApplication;
    } catch (e) {
      console.log(e);
    }
  }
}
