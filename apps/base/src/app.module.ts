import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { TestNotifModule } from './modules/testNotif/testNotif.module';
import { NotificationModule } from '@qbit-tech/libs-notification';
import { NotificationModule as NotificationFindFullModule } from './modules/notification/notification.module'
import { AuthenticationModule } from '@qbit-tech/libs-authv3';
import { UserModule } from './modules/user/user.module';
// import { Authv3Module } from './modules/authv3/authv3.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from '@qbit-tech/libs-role';
// import { AuthenticationModule } from '@qbit-tech/libs-authv3';
import {
  FeatureConfigModule,
  FeatureVersionModule,
} from '@qbit-tech/feature-utils';
import { TransactionModule } from '@qbit-tech/libs-transaction';
import { FaqModule } from '@qbit-tech/libs-faq';
import { TagModule } from './modules/tag/tag.module';
// import { PaymentModule } from '@qbit-tech/libs-payments/dist/payment.module';
import { ProductsModule } from '@qbit-tech/libs-products/dist/products.module';
import { FileUploadModule } from './modules/testMinio/fileUpload/fileUpload.module';
import { TestMinio2Module } from './modules/testMinio2/minioWithLibsUploader.module';
import { ArticleModule } from './modules/article/article.module';
import { SessionModule } from '@qbit-tech/libs-session';
import { RegionModule } from '@qbit-tech/libs-address';
import { NotificationScheduleModule } from '@qbit-tech/libs-notification-scheduler';
import { SubscriptionModule } from '@qbit-tech/libs-subscription';
// import { TransactionModule } from './modules/transaction/transaction.module';

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
  {
    name: 'brevo' as any,
    setting: {
      apiKey: process.env.BREVO_API_KEY || '-',
      from: {
        email: process.env.BREVO_EMAIL_FROM,
        name: process.env.BREVO_EMAIL_FROM_NAME,
      },
    },
  },
  {
    name: 'nodemailer' as any,
    setting: {
      apiKey: process.env.NODEMAILER_API_KEY || '-',
      from: {
        email: process.env.NODEMAILER_EMAIL_FROM,
        name: process.env.NODEMAILER_EMAIL_FROM_NAME,
      },
      nodemailer: {
        username: process.env.NODEMAILER_USERNAME,
        password: process.env.NODEMAILER_PASSWORD,
        service: process.env.NODEMAILER_SERVICE,
        host: process.env.NODEMAILER_SMTP_HOST,
        port: process.env.NODEMAILER_SMTP_PORT,
        secure: process.env.NODEMAILER_SMTP_SECURE,
      },
    },
  },
  {
    name: 'goSMSGateway' as any,
    setting: {
      apiKey: process.env.NODE_ENV,
      goSmsGateway: {
        username: process.env.GOSMSGATEWAY_USERNAME,
        password: process.env.GOSMSGATEWAY_PASSWORD,
      },
    },
  },
];

const sessionOption = {
  sessionHashToken: process.env.SESSION_HASH_TOKEN,
  randomSessionIdKey: process.env.RANDOM_SESSIONID_KEY,
  projectId: process.env.PROJECT_ID,
  expiredJWTTokenAccessInMinutes: parseInt(
    process.env.EXPIRED_JWT_TOKEN_ACCESS_IN_MINUTES,
  ),
  expiredJWTTokenRefreshInMinutes: parseInt(
    process.env.EXPIRED_JWT_TOKEN_REFRESH_IN_MINUTES,
  ),
};

const redisOption = {
  config: {
    url: process.env.REDIS_URL,
  },
};

export const rootImportedModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.ENV_PATH,
  }),
  RedisModule.forRoot(redisOption),
  CacheModule.register<RedisClientOptions>({
    isGlobal: true,
    store: redisStore,

    // Store-specific configuration:
    host: process.env.REDIS_URL,
  } as any),
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
  AuthenticationModule.forRoot(
    [
      {
        name: 'email',
        setting: {},
      },
      {
        name: 'apple',
        setting: {
          clientId: process.env.APPLE_CLIENT_ID,
        },
      },
      {
        name: 'google',
        setting: {
          appId: process.env.GOOGLE_CLIENT_ID.split(','),
          appSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
      // {
      //   name: 'fb',
      //   setting: {
      //     appId: process.env.FACEBOOK_CLIENT_ID,
      //     appSecret: process.env.FACEBOOK_CLIENT_SECRET,
      //     baseUrl: process.env.FACEBOOK_BASE_URL,
      //   },
      // },
      {
        name: 'phone',
        setting: {},
      },
    ],
    notificationOptions,
  ),
  SessionModule.forRoot(sessionOption, redisOption),
  RegionModule.forRoot(sessionOption, redisOption),
  NotificationScheduleModule.forRoot(sessionOption, redisOption),
  SubscriptionModule.forRoot(sessionOption, redisOption),
  // PaymentModule.forRoot({
  //   STAGE: 'development',
  //   SERVER_KEY: process.env.SERVER_KEY,
  //   CLIENT_KEY: process.env.CLIENT_KEY,
  //   SECRET_KEY: process.env.SECRET_KEY,
  //   PASSWORD: process.env.PASSWORD,
  //   BASE_URL: process.env.BASE_URL,
  //   BASE_URL_PAYMENT_PAGE: process.env.BASE_URL_PAYMENT_PAGE,
  //   MERCHANT_ID: process.env.MERCHANT_ID,
  //   MERCHANT_KEY_ID: process.env.MERCHANT_KEY_ID,
  // })
  // FirebaseModule.forRoot({
  //   credential: process.env.FIREBASE_CERT
  //     ? FirebaseAdmin.credential.cert(process.env.FIREBASE_CERT)
  //     : FirebaseAdmin.credential.applicationDefault(),
  // }),
];
@Module({
  imports: [
    ...rootImportedModules,
    TagModule,
    // Authv3Module,
    AuthModule,
    TestNotifModule,
    UserModule,
    // TransactionModule,
    // FaqModule,
    PermissionModule,
    RoleModule,
    // AuthSessionModule
    FeatureConfigModule,
    FeatureVersionModule,
    ProductsModule,
    FileUploadModule,
    TestMinio2Module,
    ArticleModule,
    NotificationFindFullModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
