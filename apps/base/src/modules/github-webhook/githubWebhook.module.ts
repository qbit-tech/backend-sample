import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubWebhookController } from './githubWebhook.controller';
import { TelegramModule } from 'nestjs-telegram';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    TelegramModule.forRoot({
      botKey: process.env.TELEGRAM_TOKEN,
    }),
  ],
  providers: [],
  controllers: [GithubWebhookController],
  exports: [],
})
export class GithubWebhookModule {}
