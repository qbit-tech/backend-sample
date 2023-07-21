import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification.controller';
import { NotificationModule } from 'libs/libs-notification/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    NotificationModule,
  ],
  providers: [],
  controllers: [NotificationController],
  exports: [],
})
export class TestNotifModule {}
