import {
  Controller,
  Get,
  Query,
  Logger,
  Post,
  Body,
  HttpException,
} from '@nestjs/common';
import { TrackMeService } from './trackme.service';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';

@Controller('trackme')
export class TrackMeController {
  constructor(private readonly trackMeService: TrackMeService) {}

  @Get()
  async findAll(@Query() query: any): Promise<any> {
    try {
      Logger.log('--ENTER FIND ALL TRACKME CONTROLLER--');
      Logger.log('trackMe : ' + JSON.stringify(query), 'trackMe.controller');
      return await this.trackMeService.findAll(query);
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }

  @Post('bulk')
  async bulkCreate(@Body() body: any): Promise<any> {
    try {
      Logger.log('--ENTER CREATE TRACKME CONTROLLER--');

      const res = await this.trackMeService.bulkCreate(body.bulk);

      return res;
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
