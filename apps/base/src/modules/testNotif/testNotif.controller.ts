import { Controller, Logger, Post, Body, HttpException } from '@nestjs/common';
import { TestNotificationEmailRequest } from './testNotif.contract';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiTags } from '@nestjs/swagger';
import {
  NotificationService,
  ENotificationPlatform,
} from '@qbit-tech/libs-notification';

@ApiTags('Test Notif')
@Controller('test-notif')
export class TestNotifController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  async testSendNotifEmail(
    @Body() body: TestNotificationEmailRequest,
  ): Promise<any> {
    try {
      Logger.log('--ENTER TEST EMAIL CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(body), 'tag.controller');
      return await this.notificationService.addToQueue({
        externalId: 'TEST',
        platform: ENotificationPlatform.SENDINBLUE,
        senderUserId: 'SYSTEM-TEST',
        receiverUserId: 'system-test-receiver-user-id',
        title: 'Test Title',
        message: 'Test Message',
        body: {
          name: 'User',
        },
        requestData: {
          templateId: process.env.SENDINBLUE_TEMPLATE_ID_TEST_NOTIF,
          from: {
            email: process.env.SENDINBLUE_EMAIL_FROM,
            name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
          },
          to: {
            email: body.email,
            name: 'User',
          },
        },
        createdByUserId: 'SYSTEM',
      });
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
