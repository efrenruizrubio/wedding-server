import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeddingApplication } from './wedding-application.entity';
import { MailModule } from '@modules/mail/mail.module';
import { WeddingApplicationController } from './wedding-application.controller';
import { WeddingApplicationService } from './wedding-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeddingApplication]), MailModule],
  controllers: [WeddingApplicationController],
  providers: [WeddingApplicationService],
  exports: [WeddingApplicationService],
})
export class WeddingApplicationModule {}
