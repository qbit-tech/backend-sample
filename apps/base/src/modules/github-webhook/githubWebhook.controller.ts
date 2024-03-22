import { Controller, Logger, HttpException, Post, Body } from '@nestjs/common';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GithubPayload } from './github.type';
import { GithubPushPayload } from './githubPush.type';
import { AppTelegramService } from './appTelegram.service';
import { GithubPullRequestPayload } from './githubPullRequest.type';
import { GithubWorkflowRunPayload } from './githubWorkflowRun.type';
import { detectEventAndPayload } from './githubHelper';
import { getRepo } from './github.data';

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
      // const TELEGRAM_TO_CHANNEL = process.env.TELEGRAM_TO_CHANNEL;
      const TELEGRAM_TO = process.env.TELEGRAM_TO;
      let REPLY_TO_MESSAGE_ID;

      if (
        (rawBody as any).sender?.type === 'Bot' ||
        (rawBody as any).sender?.login === 'github-actions[bot]' ||
        (rawBody as any).pusher?.name === 'github-actions[bot]'
      ) {
        // ignore
        return { isSuccess: false };
      }

      let personName;
      const repoName = rawBody.repository.full_name;
      const { project, repo } = getRepo(repoName);
      let message = project ? `*${project || repoName}*\n` : '';
      const repoUrl = rawBody.repository.html_url;
      let detailUrl;
      const { event, payload: body } = detectEventAndPayload(rawBody);

      const clickableRepo = `[${repoName}](${repoUrl})`;

      this.logger.log('github event: ' + event);

      if (event === 'push') {
        REPLY_TO_MESSAGE_ID = 3;
        const payload = body as GithubPushPayload;
        personName = payload.pusher.name || payload.pusher.email;

        const commits = payload.commits || [];
        const commitsMessages = commits
          .map((com) => '+ ' + com.message + '\n')
          .join('');

        if (payload.head_commit?.message || commits.length > 0) {
          message += `${personName} *push* the code to ${clickableRepo}\n\n*Commits*:\n${
            commitsMessages || '_empty_'
          }`;
        }
      } else if (event === 'pull_request') {
        REPLY_TO_MESSAGE_ID = 3;
        const payload = body as GithubPullRequestPayload;
        personName = payload.sender.login;

        const action = payload.action;
        const title = payload.pull_request.title;
        const prNumber = payload.pull_request.number;
        const prURL = payload.pull_request.html_url;
        const description = payload.pull_request.body;

        if (action === 'opened') {
          message += `⏱️ New pull request [#${prNumber}](${prURL}) has been created by *${personName}*.\n\nTitle: ${title}\nDescription: ${
            description || '_empty! please provide description in the next PR_'
          }\nRepo: ${clickableRepo}`;

          detailUrl = '';
        } else if (action === 'closed') {
          message += `✅ Pull Request [#${prNumber}](${prURL}) has been closed by *${personName}*.\nRepo: ${clickableRepo}`;

          detailUrl = '';
        } else {
          message = '';
        }
      } else if (event === 'workflow_run') {
        REPLY_TO_MESSAGE_ID = 2;
        const payload = body as GithubWorkflowRunPayload;
        personName = payload.sender.login;
        const action = payload.action;
        const conclusion = payload.workflow_run.conclusion;
        const wrID = payload.workflow_run.id;
        const wrURL = payload.workflow_run.html_url;
        const displayTitle = payload.workflow_run.display_title;
        const pullRequests = payload.workflow_run.pull_requests
          .map((pr) => `+ PR #${pr.number}`)
          .join('\n');
        const headBranch = payload.workflow_run.head_branch;
        const headSha = payload.workflow_run.head_sha;
        const commitUrl = `https://github.com/${repoName}/commit/${headSha}`;

        const mode =
          headBranch === 'main' || headBranch === 'master'
            ? 'PROD'
            : headBranch === 'stable'
            ? 'STAGING'
            : headBranch === 'dev' || headBranch === 'development'
            ? 'DEV'
            : '';

        if (action === 'in_progress') {
          message += `⏱️ ${
            mode ? '(' + mode + ') ' : ''
          }Deployment [#${wrID}](${wrURL}) started by ${personName}.\n\n${headBranch} <- \nRepo: ${clickableRepo}\n\n[${displayTitle}](${commitUrl}) ${
            pullRequests ? '\nPull Request:\n' + pullRequests : ''
          }`;
        } else if (action === 'completed') {
          const icon = conclusion === 'failure' ? '❌' : '✅';
          message += `${icon} ${
            mode ? '(' + mode + ') ' : ''
          }Deployment [#${wrID}](${wrURL}) has been ${conclusion}.\n\n${headBranch} <- \nRepo: ${clickableRepo}`;
        } else {
          message = '';
        }

        detailUrl = '';
      } else {
        message = '';
      }

      if (message) {
        if (detailUrl) {
          message += `\n\n👉 [CLICK TO SEE DETAIL](${detailUrl})`;
        }

        await this.appTelegramService.sendNotif(
          TELEGRAM_TO,
          message,
          REPLY_TO_MESSAGE_ID,
        );
      }

      return { isSuccess: true };
    } catch (error) {
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
