import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import {
  WA_ACCESS_TOKEN,
  WA_FROM_NUMBER,
  WA_TO_NUMBER,
} from 'apps/base/config/whatsapp';
import { WhatsappRequest } from './whatsapp.contract';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  constructor(private httpService: HttpService) {}

  async sendMessage(body: WhatsappRequest): Promise<any> {
    try {
      Logger.log('===WA SERVICE SEND===');
      const res = await firstValueFrom(
        this.httpService
          .post(
            'https://graph.facebook.com/v18.0/' + WA_FROM_NUMBER + '/messages',
            body,
            {
              headers: {
                Authorization: 'Bearer ' + WA_ACCESS_TOKEN,
                'Content-Type': 'application/json',
              },
            },
          )
          .pipe(
            catchError((error) => {
              Logger.error('Error when request API');
              throw error;
            }),
          ),
      );
      this.logger.log('sendMessage res');
      this.logger.log(res.data);

      return res.data;
    } catch (err) {
      this.logger.error('err sendMessage');
      this.logger.error(err);
      return Promise.reject(err);
    }
  }
}
