import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

const configs: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: Number(configService.get('DATABASE_PORT')),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  synchronize: false,
  // logging: true,
  migrationsRun: false,
  migrations: [`${__dirname}/src/database/migrations/*{.ts,.js}`],
};

const dataSource = new DataSource(configs);

export default dataSource;
