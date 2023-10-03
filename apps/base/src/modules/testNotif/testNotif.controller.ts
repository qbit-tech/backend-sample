import { Controller, Logger, Post, Body, HttpException } from '@nestjs/common';
import {
  TestNotificationEmailRequest,
  TestNotificationSmsRequest,
} from './testNotif.contract';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiTags } from '@nestjs/swagger';
import {
  NotificationService,
  ENotificationPlatform,
} from '@qbit-tech/libs-notification';

@ApiTags('Test Notif')
@Controller('test-notif')
export class TestNotifController {
  constructor(private readonly notificationService: NotificationService) { }

  // @Post('email')
  // async testSendNotifEmail(
  //   @Body() body: TestNotificationEmailRequest,
  // ): Promise<any> {
  //   try {
  //     Logger.log('--ENTER TEST EMAIL CONTROLLER--');
  //     Logger.log('tag : ' + JSON.stringify(body), 'tag.controller');
  //     const queue = await this.notificationService.addToQueue({
  //       externalId: 'TEST',
  //       platform: ENotificationPlatform.NODEMAILER,
  //       senderUserId: 'SYSTEM-TEST',
  //       receiverUserId: 'system-test-receiver-user-id',
  //       title: 'Test Title',
  //       message: 'Test Message',
  //       body: {
  //         name: 'User',
  //       },
  //       requestData: {
  //         templateId: process.env.NODEMAILER_TEMPLATE_ID_TEST_NOTIF,
  //         from: {
  //           email: process.env.NODEMAILER_EMAIL_FROM,
  //           name: process.env.NODEMAILER_EMAIL_FROM_NAME,
  //         },
  //         to: {
  //           email: body.email,
  //           name: 'User',
  //         },
  //       },
  //       createdByUserId: 'SYSTEM',
  //     });

  //     const res = await this.notificationService.sendFromQueue(queue.id);

  //     return res;
  //   } catch (error) {
  //     throw new HttpException(error, getErrorStatusCode(error));
  //   }
  // }

  @Post('email')
  async testSendNotifEmail(
    @Body() body: TestNotificationEmailRequest,
  ): Promise<any> {
    try {
      Logger.log('--ENTER TEST EMAIL CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(body), 'tag.controller');
      const queue = await this.notificationService.addToQueue({
        externalId: 'TEST',
        platform: ENotificationPlatform.NODEMAILER,
        senderUserId: 'SYSTEM-TEST',
        receiverUserId: 'system-test-receiver-user-id',
        title: 'Test Title',
        message: 'Test Message',
        body: {
          name: 'User',
        },
        requestData: {
          templateId: process.env.NODEMAILER_TEMPLATE_ID_TEST_NOTIF,
          from: {
            email: process.env.NODEMAILER_EMAIL_FROM,
            name: process.env.NODEMAILER_EMAIL_FROM_NAME,
          },
          to: {
            email: body.email,
            name: 'User',
          },
        },
        createdByUserId: 'SYSTEM',
      });

      const res = await this.notificationService.sendFromQueue(queue.id);

      return res;
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }

  @Post('sms')
  async testSendNotifGoSmsGateway(
    @Body() body: TestNotificationSmsRequest,
  ): Promise<any> {
    if (!body.phoneNumber) {
      throw new HttpException('phone number is required', 400);
    }

    try {
      Logger.log('--ENTER TEST SMS CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(body), 'tag.controller');

      const queue = await this.notificationService.addToQueue({
        externalId: 'TEST',
        platform: ENotificationPlatform.GOSMSGATEWAY,
        senderUserId: 'SYSTEM-TEST',
        receiverUserId: 'system-test-receiver-user-id',
        body: {
          name: 'Username',
        },
        title: 'Test SMS Title',
        message: body.message || 'Test SMS Message',
        requestData: {
          templateId: 1,
          from: 'SYSTEM',
          to: body.phoneNumber,
        },
        createdByUserId: 'SYSTEM',
      });

      const res = await this.notificationService.sendFromQueue(queue.id);

      return res;
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}