import { Controller, Logger, Post, Body, HttpException } from '@nestjs/common';
import { TestNotificationEmailRequest } from './notification.contract';
import { getErrorStatusCode } from 'libs/libs-utils/src/utils';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'libs/libs-notification/src/notification.service';
import { ENotificationPlatform } from 'libs/libs-notification/src/notification.service';
// import { ENotificationPlatform } from 'libs/libs-notification/src/notification.entity';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('test-email')
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
        title: 'Test',
        message: 'Test',
        body: {},
        requestData: {},
      });
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
