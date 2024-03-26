import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthSessionModule } from '../authUser/authUser.module';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({
    timeout: 10000,
    maxRedirects: 5,
  }),],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule{}