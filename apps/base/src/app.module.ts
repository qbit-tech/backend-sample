import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';
import { TestNotifModule } from './modules/testNotif/testNotif.module';
import { NotificationModule } from '@qbit-tech/libs-notification';
import { AppVersionModule, AppConfigModule } from '@qbit-tech/libs-utils';

const notificationOptions = [
  {
    name: 'sendinblue' as any,
    setting: {
      apiKey: process.env.SENDINBLUE_API_KEY || '-',
      from: {
        email: process.env.SENDINBLUE_EMAIL_FROM,
        name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
      },
    },
  },
];

export const rootImportedModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.ENV_PATH,
  }),
  RedisModule.forRoot({
    config: {
      url: process.env.REDIS_URL,
    },
  }),
  SequelizeModule.forRoot({
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'letmein',
    database: process.env.DB_NAME || 'App',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    // dialectOptions: {
    //   statement_timeout: 600000
    // },
    dialect: 'postgres',
    autoLoadModels: true,
    logging: false,
    synchronize: false,
  }),
  NotificationModule.forRoot(notificationOptions),
  // AuthenticationModule.forRoot(
  //   [
  //     {
  //       name: 'email',
  //       setting: {},
  //     },
  //     {
  //       name: 'apple',
  //       setting: {
  //         clientId: process.env.APPLE_CLIENT_ID,
  //       },
  //     },
  //     {
  //       name: 'google',
  //       setting: {
  //         appId: process.env.GOOGLE_CLIENT_ID.split(','),
  //         appSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       },
  //     },
  //     {
  //       name: 'fb',
  //       setting: {
  //         appId: process.env.FACEBOOK_CLIENT_ID,
  //         appSecret: process.env.FACEBOOK_CLIENT_SECRET,
  //         baseUrl: process.env.FACEBOOK_BASE_URL,
  //       },
  //     },
  //     {
  //       name: 'phone',
  //       setting: {},
  //     },
  //   ],
  //   notificationOptions,
  // ),
  // FirebaseModule.forRoot({
  //   credential: process.env.FIREBASE_CERT
  //     ? FirebaseAdmin.credential.cert(process.env.FIREBASE_CERT)
  //     : FirebaseAdmin.credential.applicationDefault(),
  // }),
];
@Module({
  imports: [
    ...rootImportedModules,
    AppVersionModule,
    AppConfigModule,
    // TagModule,
    // Authv3Module,
    TestNotifModule,
    // UserModule,
    // PermissionModule,
    // RoleModule,
    // AuthSessionModule
  ],
  controllers: [AppController],
})
export class AppModule {}
