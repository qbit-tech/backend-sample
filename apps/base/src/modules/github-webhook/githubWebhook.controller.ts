import { Controller, Logger, HttpException, Post, Body } from '@nestjs/common';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GithubPayload } from './github.type';
import { GithubPushPayload } from './githubPush.type';
import { AppTelegramService } from './appTelegram.service';
import { GithubPullRequestPayload } from './githubPullRequest.type';
import { GithubWorkflowRunPayload } from './githubWorkflowRun.type';
import { detectEventAndPayload } from './githubHelper';

@ApiTags('Github Webhook')
@Controller('github-webhook')
export class GithubWebhookController {
  logger = new Logger(GithubWebhookController.name);
  constructor(private readonly appTelegramService: AppTelegramService) {}

  @ApiOperation({ summary: 'Receive data from github' })
  @Post()
  async receiveGithubWebhookData(@Body() rawBody: GithubPayload): Promise<any> {
    try {
      this.logger.log('github-webhook rawBody : ' + JSON.stringify(rawBody));
      const TELEGRAM_TO = process.env.TELEGRAM_TO;

      let personName;
      let message;
      const repoName = rawBody.repository.full_name;
      const repoUrl = rawBody.repository.html_url;
      let detailUrl = repoUrl;
      const { event, payload: body } = detectEventAndPayload(rawBody);

      this.logger.log('github event: ' + event);

      if (event === 'push') {
        const payload = body as GithubPushPayload;
        personName = payload.pusher.name + ' (' + payload.pusher.email + ')';

        message = personName + ' <b>push</b> the code to ' + repoName;
      } else if (event === 'pull_request') {
        const payload = body as GithubPullRequestPayload;
        personName = payload.sender.login;

        const action = payload.action;
        const title = payload.pull_request.title;
        const description = payload.pull_request.body;

        if (action === 'opened') {
          message = `New pull request has been created by ${personName}.\n\nTitle: ${title}\nDescription: ${
            description ||
            '<i>empty! please provide description in the next PR</i>\nRepository'
          }\nRepository: ${repoName}`;
        } else if (action === 'closed') {
          message = `Pull Request <b>[${title}]</b> has been closed by ${personName}`;
        }
      } else if (event === 'workflow_run') {
        const payload = body as GithubWorkflowRunPayload;

        const action = payload.action;
        if (action === 'in_progress') {
          message = `Deployment started by ${personName}.\n\nRepository: ${repoName}`;
        } else if (action === 'completed') {
          message = `Deployment has been completed.\n\nRepository: ${repoName}`;
        }

        detailUrl = payload.workflow_run.html_url;
      }

      if (message) {
        message = message + '\n\n' + detailUrl;

        await this.appTelegramService.sendNotif(TELEGRAM_TO, message);
      }

      return { isSuccess: true };
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
