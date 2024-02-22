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
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from '@qbit-tech/libs-role';
import {
  FeatureConfigModule,
  FeatureVersionModule,
} from '@qbit-tech/feature-utils';
// import { TransactionModule } from '@qbit-tech/libs-transaction';
import { TagModule } from './modules/tag/tag.module';
// import { PaymentModule } from '@qbit-tech/libs-payments/dist/payment.module';
import { ProductsModule } from '@qbit-tech/libs-products/dist/products.module';
import { FileUploadModule } from './modules/testMinio/fileUpload/fileUpload.module';
import { TestMinio2Module } from './modules/testMinio2/minioWithLibsUploader.module';
// import { ArticleModule } from './modules/article/article.module';
import { SessionModule } from '@qbit-tech/libs-session';
import { RegionModule } from '@qbit-tech/libs-address';
import { NotificationScheduleModule } from '@qbit-tech/libs-notification-scheduler';
import { SubscriptionModule } from '@qbit-tech/libs-subscription';
import { EbookModule } from './modules/ebook/ebook.module';
import { InitDataModule } from './modules/initData/initData.module';
import { BannerModule } from './modules/banner/banner.module';
import { FaqModule } from '@qbit-tech/libs-faq';
import { GithubWebhookModule } from './modules/github-webhook/githubWebhook.module';
import { TestFileUploadModule } from './modules/testFileUpload/testFileUpload.module';
import { SponsorModule } from '@qbit-tech/libs-sponsor';
import { redisOption, sessionOption } from '../config/session';
import { notificationOptions } from '../config/notification';
import { authenticationOptions } from '../config/authentication';
import { UPLOADER_OPTIONS, generateMulterOptions } from '../config/uploader';
import { PromoModule } from '@qbit-tech/libs-promo';
import { ArticlesModule } from '@qbit-tech/libs-article';

export const rootImportedModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.ENV_PATH,
  }),
  GithubWebhookModule,
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
  AuthenticationModule.forRoot(authenticationOptions, notificationOptions),
  SessionModule.forRoot(sessionOption, redisOption),
  RegionModule.forRoot(sessionOption, redisOption),
  NotificationScheduleModule.forRoot(sessionOption, redisOption),
  SubscriptionModule.forRoot(sessionOption, redisOption),
  FaqModule.forRoot(sessionOption, redisOption),
  FeatureConfigModule.forRoot(sessionOption, redisOption),
  FeatureVersionModule.forRoot(sessionOption, redisOption),
  SponsorModule.forRoot(
    sessionOption,
    UPLOADER_OPTIONS,
    generateMulterOptions('sponsor'),
    redisOption,
  ),
  PromoModule.forRoot(
    sessionOption,
    UPLOADER_OPTIONS,
    generateMulterOptions('promo'),
    redisOption,
  ),
  ArticlesModule.forRoot(
    sessionOption,
    UPLOADER_OPTIONS,
    generateMulterOptions('article'),
    redisOption,
  ),

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
    AuthModule,
    TestNotifModule,
    UserModule,
    // TransactionModule,
    RoleModule,
    ProductsModule,
    FileUploadModule,
    TestMinio2Module,
    // ArticleModule,
    EbookModule,
    InitDataModule,
    BannerModule,
    TestFileUploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
