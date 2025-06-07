import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService, private configService: ConfigService) {}

  async sendMail({
    receiver,
    subject,
    template,
    context = {},
  }: {
    receiver: string;
    subject: string;
    template?: string;
    context?: Record<string, any>;
  }) {
    try {
      await this.mailService.sendMail({
        from: `Confirmación de asistencia Boda N&E<${this.configService.get('EMAIL_USERNAME')}>`,
        to: receiver,
        subject,
        template,
        context,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
