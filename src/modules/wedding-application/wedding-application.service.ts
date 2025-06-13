import { Injectable } from '@nestjs/common';

import { MailService } from '@modules/mail/mail.service';
import { Repository } from 'typeorm';
import { WeddingApplication } from './wedding-application.entity';
import { WeddingApplicationDto } from './wedding-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleSheetsService } from '@modules/google-sheets/google-sheets.service';

@Injectable()
export class WeddingApplicationService {
  constructor(
    private readonly mailService: MailService,
    private readonly sheetsService: GoogleSheetsService,
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
      let weddingApplication: WeddingApplication;

      const emailExists = await this.findByEmail(email);

      if (emailExists) {
        weddingApplication = await this.repo.save({ ...emailExists, ...payload });
      } else {
        const newWeddingApplication = this.repo.create({ email, ...payload });
        weddingApplication = await this.repo.save(newWeddingApplication);
      }

      await this.sheetsService.writeToSheet(weddingApplication);

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
