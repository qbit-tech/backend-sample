import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
// import { NotificationModule } from '../../../libs/notification/src';
// import { AuthenticationModule } from '@comika/authv2';
// import { AuthModule } from './modules/auth/auth.module';
// import { Authv2Module } from './modules/authv2/authv2.module';
import { AppController } from './app.controller';
// import { NotificationModule } from 'submodule';
// import { UserModule } from './modules/user/user.module';
// import { AppVersionModule } from 'libs/appVersion/src/app-version/app-version.module';
// import { AppConfigModule } from './modules/appConfig/appConfig.module';
// import { EventModule } from './modules/event/event.module';
// import { VenueModule } from './modules/venue/venue.module';
// import { RoleModule } from './modules/role/role.module';
import { TagModule } from './modules/tag/tag.module';
import { Authv3Module } from './modules/authv3/authv3.module';
import { AuthenticationModule } from 'libs/authv3/src';
// import { TicketModule } from './modules/ticket/ticket.module';
// import { TicketClassModule } from './modules/ticketClass/ticketClass.module';
// import { TalentModule } from './modules/talent/talent.module';
// import { EventVariantModule } from './modules/eventVariant/eventVariant.module';
// import { PermissionModule } from './modules/permission/permission.module';
// import { SendInBlueModule } from 'libs/sendInBlue/src';
// import { InitDataModule } from './modules/_initData/initData.module';
// import { TransactionModule } from './modules/transaction/transaction.module';
// import { TransactionItemModule } from './modules/transactionItem/transactionItem.module';
// import { CartModule } from './modules/cart/cart.module';
// import { MidtransModule } from '../../../libs/midtrans/src/midtrans.module';
// import { LiveStreamingModule } from './modules/eventLiveStreaming/liveStreaming.module';
// import { SnapModule } from './modules/midtrans/midtrans.module';
// import { FixedVAModule } from './modules/fixedVA/fixedVA.module';
// import { PaymentModule } from './modules/payment/payment.module';
// import { UserRelativeModule } from './modules/userRelative/userRelative.module';
// import { EventLogModule } from './modules/eventLog/eventLog.module';
// import { VoucherModule } from './modules/voucher/voucher.module';
// import { EventReviewModule } from './modules/eventReview/eventReview.module';
// import { EventFavouriteModule } from './modules/eventFavourite/eventFavourite.module';
// import { ImportTransactionModule } from './modules/importTransaction/importTransaction.module';
// import { TemplateModule } from './modules/template/template.module';
// import { MasterIconLauncherModule } from './modules/masterIconLauncher/masterIconLauncher.module';
// import { IconLauncherScheduleModule } from './modules/iconLauncherSchedule/iconLauncherSchedule.module';
// import { PaymentMethodModule } from './modules/paymentMethod/paymentMethod.module';
// import { EventRerunModule } from './modules/eventRerun/eventRerun.module';
// import { NotificationsModule } from './modules/notification/notification.module';
// import * as FirebaseAdmin from 'firebase-admin';
// import { ExportTransactionModule } from './modules/exportTransaction/exportTransaction.module';
// import { FirebaseModule } from '@comika/firebase';

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
  // NotificationModule.forRoot([
  //   {
  //     name: 'sendgrid',
  //     setting: {
  //       apiKey: process.env.SENDINBLUE_API_KEY,
  //       from: {
  //         email: process.env.SENDINBLUE_EMAIL_FROM,
  //         name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
  //       },
  //     },
  //   },
  // ]),
  // SendInBlueModule.forRoot([
  //   {
  //     name: 'sendinblue',
  //     setting: {
  //       apiKey: process.env.SENDINBLUE_API_KEY,
  //       from: {
  //         email: process.env.SENDINBLUE_EMAIL_FROM,
  //         name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
  //       },
  //     },
  //   },
  // ]),
  // MidtransModule.forRoot([
  //   {
  //     name: 'midtrans',
  //     setting: {
  //       isProduction: process.env.MIDTRANS_MODE === 'PRODUCTION',
  //       serverKey: process.env.MIDTRANS_SERVER_KEY,
  //       clientKey: process.env.MIDTRANS_CLIENT_KEY,
  //     },
  //   },
  // ]),
  // AuthenticationModule.forRoot([
  //   {
  //     name: 'email',
  //     setting: {},
  //   },
  //   {
  //     name: 'apple',
  //     setting: {
  //       clientId: process.env.APPLE_CLIENT_ID,
  //     },
  //   },
  //   {
  //     name: 'google',
  //     setting: {
  //       appId: process.env.GOOGLE_CLIENT_ID.split(','),
  //       appSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     },
  //   },
  //   {
  //     name: 'fb',
  //     setting: {
  //       appId: process.env.FACEBOOK_CLIENT_ID,
  //       appSecret: process.env.FACEBOOK_CLIENT_SECRET,
  //       baseUrl: process.env.FACEBOOK_BASE_URL,
  //     },
  //   },
  //   {
  //     name: 'phone',
  //     setting: {},
  //   },
  // ]),
  // FirebaseModule.forRoot({
  //   credential: process.env.FIREBASE_CERT
  //     ? FirebaseAdmin.credential.cert(process.env.FIREBASE_CERT)
  //     : FirebaseAdmin.credential.applicationDefault(),
  // }),
  // NotificationModule.forRoot([
  //   {
  //     name: 'sendinblue',
  //     setting: {
  //       apiKey: process.env.SENDINBLUE_API_KEY,
  //       from: {
  //         email: process.env.SENDINBLUE_EMAIL_FROM,
  //         name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
  //       },
  //     },
  //   },
  // ]),
  AuthenticationModule.forRoot([
    {
      name: 'email',
      setting: {},
    },
  ]),
];
@Module({
  imports: [
    ...rootImportedModules,
    // InitDataModule,
    // AuthModule,
    // Authv2Module,
    // UserModule,
    // SnapModule,
    // PaymentModule,
    // TransactionModule,
    // TransactionItemModule,
    // CartModule,
    // PermissionModule,
    // FixedVAModule,
    // RoleModule,
    // ImportTransactionModule,
    // EventModule,
    // UserRelativeModule,
    // EventReviewModule,
    // VenueModule,
    // EventVariantModule,
    // EventFavouriteModule,
    TagModule,
    Authv3Module,
    // TalentModule,
    // EventLogModule,
    // TicketModule,
    // TicketClassModule,
    // VoucherModule,
    // LiveStreamingModule,
    // EventRerunModule,
    // MasterIconLauncherModule,
    // IconLauncherScheduleModule,
    // PaymentMethodModule,
    // TemplateModule,
    // AppConfigModule,
    // ExportTransactionModule,
    // NotificationsModule,
    // AppVersionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
