import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationSchedulerModule } from '@qbit-tech/libs-notification';
import { NotificationModel } from '@qbit-tech/libs-notification/dist/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    SequelizeModule.forFeature([NotificationModel]),
    NotificationSchedulerModule.forFeature([
      // 'firebase',
      'postmark',
      'sendgrid',
      'sendinblue',
      'waba',
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class NotifSchedulerModule {}
