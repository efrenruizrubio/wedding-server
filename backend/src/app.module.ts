import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from '@modules/mail/mail.module';
import { TasksOnBootstrap } from '@modules/boostrap/tasks';
import { SeedApplicator } from '@modules/seed-applier/seed-applicator.entity';
import { User } from '@modules/user/user.entity';
import { ApplicationModule } from './modules/application/application.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WebSocketModule } from '@modules/websocket/websocket.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (_req, _file, cb) => {
            cb(null, './uploads/');
          },
          filename: (_req, file, cb) => {
            const uniqueSuffix = Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`,
            );
          },
        }),
        preservePath: true,
        limits: { fileSize: 1024 * 1024 * 1024 * 15 },
      }),
    }),
    TypeOrmModule.forFeature([User, SeedApplicator]),
    UserModule,
    AuthModule,
    MailModule,
    ApplicationModule,
    WebSocketModule,
  ],
  providers: [TasksOnBootstrap],
  exports: [MulterModule],
})
export class AppModule {}
