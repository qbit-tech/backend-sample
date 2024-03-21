export const REPOS = [
  {
    project: 'TASK MANAGEMENT',
    org: 'qbit-tech',
    repo: 'task-management-be',
    repoName: 'Task Management (BE)',
  },
  {
    project: 'TASK MANAGEMENT',
    org: 'qbit-tech',
    repo: 'task-management-web',
    repoName: 'Task Management (Web)',
  },
  {
    project: 'TASK MANAGEMENT',
    org: 'qbit-tech',
    repo: 'task-management-fe',
    repoName: 'Task Management (Mobile App)',
  },
  {
    project: 'MEDEASY',
    org: 'qbit-tech',
    repo: 'medeasy-fe',
    repoName: 'Medeasy FE (WEB, CMS, MOBILE, PDF)',
  },
  {
    project: 'MEDEASY',
    org: 'qbit-tech',
    repo: 'medeasy-be',
    repoName: 'Medeasy BE',
  },
  {
    project: 'ASTRALAND',
    org: 'qbit-tech',
    repo: 'astraland-fe',
    repoName: 'Astraland FE (WEB, CMS)',
  },
  {
    project: 'ASTRALAND',
    org: 'qbit-tech',
    repo: 'astraland-be',
    repoName: 'Astraland BE',
  },
  {
    project: 'BORMAR',
    org: 'qbit-tech',
    repo: 'borobudurmarathon-new',
    repoName: 'BORMAR Mobile App',
  },
  {
    project: 'GAME SCRATCH',
    org: 'qbit-tech',
    repo: 'game-scratch-cms',
    repoName: 'Game Scratch CMS',
  },
  {
    project: 'GAME SCRATCH',
    org: 'qbit-tech',
    repo: 'game-scratch',
    repoName: 'Game Scratch (Web)',
  },
  {
    project: 'BACKEND SAMPLE',
    org: 'qbit-tech',
    repo: 'backend-sample',
    repoName: 'Backend Sample',
  },
  {
    project: 'CMS TEMPLATE',
    org: 'qbit-tech',
    repo: 'cms-template',
    repoName: 'CMS Template',
  },
];

export function getRepo(repository: string) {
  const exp = repository.split('/');
  const org = exp[0];
  const repo = exp[1];

  return (
    REPOS.find((item) => item.org === org && item.repo === repo) || {
      org: undefined,
      repo: undefined,
      repoName: undefined,
      project: undefined,
    }
  );
}
