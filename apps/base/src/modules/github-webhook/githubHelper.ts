import { GithubPayload } from './github.type';
import { GithubPullRequestPayload } from './githubPullRequest.type';
import { GithubPushPayload } from './githubPush.type';
import { GithubWorkflowRunPayload } from './githubWorkflowRun.type';

export function detectEventAndPayload(body: GithubPayload): {
  event: 'push' | 'pull_request';
  payload: GithubPayload;
} {
  let event;
  if ((body as GithubPullRequestPayload).pull_request) {
    event = 'pull_request';
  } else if (
    (body as GithubPushPayload).ref &&
    (body as GithubPushPayload).before &&
    (body as GithubPushPayload).after
  ) {
    event = 'push';
  } else if ((body as GithubWorkflowRunPayload).workflow_run) {
    event = 'workflow_run';
  }

  return {
    event,
    payload: body,
  };
}
