import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from './database/database.service';
import { MailModule } from '@modules/mail/mail.module';
import { WeddingApplicationModule } from '@modules/wedding-application/wedding-application.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailModule,
    WeddingApplicationModule,
  ],
})
export class AppModule {}
