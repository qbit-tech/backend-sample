import { GithubPullRequestPayload } from './githubPullRequest.type';
import { GithubPushPayload } from './githubPush.type';
import { GithubWorkflowRunPayload } from './githubWorkflowRun.type';

export type GithubPayload =
  | GithubPushPayload
  | GithubPullRequestPayload
  | GithubWorkflowRunPayload;
