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
import { AuthenticationModule } from '@qbit-tech/libs-authv3';
import { UserModule } from './modules/user/user.module';
import { Authv3Module } from './modules/authv3/authv3.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from '@qbit-tech/libs-role';
import {
  FeatureConfigModule,
  FeatureVersionModule,
} from '@qbit-tech/feature-utils';
import { TransactionModule } from '@qbit-tech/libs-transaction';
import { FaqModule } from '@qbit-tech/libs-faq';
import { TagModule } from './modules/tag/tag.module';
import { PaymentModule } from '@qbit-tech/libs-payments/dist/payment.module';
import { ProductsModule } from '@qbit-tech/libs-products/dist/products.module';
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
  PaymentModule.forRoot({
    STAGE: 'development',
    SERVER_KEY: process.env.SERVER_KEY,
    CLIENT_KEY: process.env.CLIENT_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    PASSWORD: process.env.PASSWORD,
    BASE_URL: process.env.BASE_URL,
    BASE_URL_PAYMENT_PAGE: process.env.BASE_URL_PAYMENT_PAGE,
    MERCHANT_ID: process.env.MERCHANT_ID,
    MERCHANT_KEY_ID: process.env.MERCHANT_KEY_ID,
  })
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
    Authv3Module,
    TestNotifModule,
    UserModule,
    TransactionModule,
    FaqModule,
    PermissionModule,
    RoleModule,
    // AuthSessionModule
    FeatureConfigModule,
    FeatureVersionModule,
    ProductsModule
  ],
  controllers: [AppController],
})
export class AppModule { }
