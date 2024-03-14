import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { NotificationSchedulerModule } from '@qbit-tech/libs-notification';
import { MonitorApiSchedulerModule } from '@qbit-tech/libs-monitor-api';

export const rootImportedModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.ENV_PATH,
  }),
  SequelizeModule.forRoot({
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'letmein',
    database: process.env.DB_NAME || 'App',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    autoLoadModels: true,
    logging: false,
    synchronize: false,
    dialectOptions: {
      ...(process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {}),
      pool: {
        min: parseInt(process.env.POOL_MIN || '0'),
        max: parseInt(process.env.POOL_MAX || '10'),
        acquire: parseInt(process.env.POOL_ACQUIRE || '10'),
        idle: parseInt(process.env.POOL_IDLE || '5'),
      },
    },
  }),
  NotificationSchedulerModule.forRoot([
    // {
    //   name: 'sendgrid',
    //   setting: {
    //     apiKey: process.env.SENDINBLUE_API_KEY,
    //     from: {
    //       email: process.env.SENDINBLUE_EMAIL_FROM,
    //       name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
    //     },
    //   },
    // },
    {
      name: 'sendinblue',
      setting: {
        apiKey: process.env.SENDINBLUE_API_KEY || '-',
        from: {
          email: process.env.SENDINBLUE_EMAIL_FROM || '-',
          name: process.env.SENDINBLUE_EMAIL_FROM_NAME || '-',
        },
      },
    },
    {
      name: 'postmark',
      setting: {
        apiKey: process.env.SENDINBLUE_API_KEY || '-',
        from: {
          email: process.env.SENDINBLUE_EMAIL_FROM || '-',
          name: process.env.SENDINBLUE_EMAIL_FROM_NAME || '-',
        },
      },
    },
  ]),
  MonitorApiSchedulerModule.forRoot(),
];
@Module({
  imports: [...rootImportedModules],
  controllers: [AppController],
})
export class AppModule {}
