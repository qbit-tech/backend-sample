import {
  Body,
  Controller,
  Delete,
  Get,
  Req,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { WhatsappRequest } from './whatsapp.contract';
import { WA_TO_NUMBER } from 'apps/base/config/whatsapp';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';

@ApiTags('Whatsapp Business API')
@Controller('/whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async reqSendMessage(@Body() body: WhatsappRequest): Promise<any> {
    try {
      Logger.log('===WA CONTROLLER SEND===');
      const placeholder: WhatsappRequest = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: WA_TO_NUMBER,
        type: 'text',
        text: {
          preview_url: false,
          body: 'test',
        },
      };
      const resData = await this.whatsappService.sendMessage(placeholder);
      this.logger.log('resData ' + JSON.stringify(resData));

      return resData;
    } catch (err) {
      this.logger.error('ERROR reqSendMessage');
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }
}
