import { Controller, Logger, HttpException, Post, Body } from '@nestjs/common';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Github Webhook')
@Controller('github-webhook')
export class GithubWebhookController {
  logger = new Logger(GithubWebhookController.name);
  // constructor() {}

  @ApiOperation({ summary: 'Receive data from github' })
  @Post()
  async receiveGithubWebhookData(@Body() body: any): Promise<any> {
    try {
      this.logger.log('github-webhook body : ' + JSON.stringify(body));

      return { isSuccess: true };
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
