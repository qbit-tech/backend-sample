import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestNotifController } from './testNotif.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  providers: [],
  controllers: [TestNotifController],
  exports: [],
})
export class TestNotifModule {}
