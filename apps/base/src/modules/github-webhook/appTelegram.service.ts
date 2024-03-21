import { Injectable } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class AppTelegramService {
  constructor(private readonly telegram: TelegramService) {}

  sendNotif(to: string, message: string) {
    return this.telegram
      .sendMessage({
        chat_id: to,
        text: message,
        parse_mode: 'markdown',
      })
      .toPromise();
  }
}
