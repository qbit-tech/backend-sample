import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubWebhookController } from './githubWebhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  providers: [],
  controllers: [GithubWebhookController],
  exports: [],
})
export class GithubWebhookModule {}
