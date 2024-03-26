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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { WhatsappRequest } from './whatsapp.contract';
import { WA_TO_NUMBER } from 'apps/base/config/whatsapp';

@ApiTags('Whatsapp Business API')
@Controller('/whatsapp')
export class WhatsappController{
  constructor(
    private readonly whatsappService: WhatsappService,
  ){}

  @Post()
  async reqSendMessage(
    @Body() body: WhatsappRequest,
  ):Promise<any>{
    try{
      Logger.log("===WA CONTROLLER SEND===");
      const placeholder: WhatsappRequest = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": WA_TO_NUMBER,
        "type": "text",
        "text": {
          "preview_url": false,
          "body": "test",
        },
      }
      const res = await this.whatsappService.sendMessage(placeholder);
      Logger.log(JSON.stringify(res));
    }catch(err){
      Logger.log(JSON.stringify(err));
    }
    
  }
}