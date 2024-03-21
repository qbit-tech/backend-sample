import { Injectable } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class AppTelegramService {
  constructor(private readonly telegram: TelegramService) {}

  sendNotif(to: string, message: string, reply_to_message_id?: any) {
    return this.telegram
      .sendMessage({
        chat_id: to,
        text: message,
        parse_mode: 'markdown',
        disable_web_page_preview: true,
        reply_to_message_id,
      })
      .toPromise();
  }
}
