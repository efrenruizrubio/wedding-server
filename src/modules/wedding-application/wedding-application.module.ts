import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeddingApplication } from './wedding-application.entity';
import { MailModule } from '@modules/mail/mail.module';
import { WeddingApplicationController } from './wedding-application.controller';
import { WeddingApplicationService } from './wedding-application.service';
import { GoogleSheetsModule } from '@modules/google-sheets/google-sheets.module';

@Module({
  imports: [TypeOrmModule.forFeature([WeddingApplication]), MailModule, GoogleSheetsModule],
  controllers: [WeddingApplicationController],
  providers: [WeddingApplicationService],
  exports: [WeddingApplicationService],
})
export class WeddingApplicationModule {}
