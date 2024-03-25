export const REPOS = [
  {
    project: '📋 TASK MANAGEMENT 📋',
    org: 'qbit-tech',
    repo: 'task-management-be',
    repoName: 'Task Management (BE)',
    previewUrl: {
      dev: 'https://tm-api-dev.qbit.co.id',
    },
  },
  {
    project: '📋 TASK MANAGEMENT 📋',
    org: 'qbit-tech',
    repo: 'task-management-web',
    repoName: 'Task Management (Web)',
    previewUrl: {
      dev: 'https://tm-web-dev.qbit.co.id',
    },
  },
  {
    project: '📋 TASK MANAGEMENT 📋',
    org: 'qbit-tech',
    repo: 'task-management-fe',
    repoName: 'Task Management (Mobile App)',
  },
  {
    project: '🏩 MEDEASY 🏩',
    org: 'qbit-tech',
    repo: 'medeasy-fe',
    repoName: 'Medeasy FE (WEB, CMS, MOBILE, PDF)',
    previewUrl: {
      dev: 'https://medeasy-web-staging.qbit.co.id',
      staging: 'https://medeasy-web-staging.qbit.co.id',
      prod: 'https://medeasy.ph',
    },
  },
  {
    project: '🏩 MEDEASY 🏩',
    org: 'qbit-tech',
    repo: 'medeasy-be',
    repoName: 'Medeasy BE',
    previewUrl: {
      dev: 'https://medeasy-api-staging.qbit.co.id',
      staging: 'https://medeasy-api-staging.qbit.co.id',
      // prod: 'https://api.medeasy.ph',
    },
  },
  {
    project: '🍲 SPOONFUL 🍲',
    org: 'qbit-tech',
    repo: 'spoonful-fe',
    repoName: 'Spoonful FE',
  },
  {
    project: '🍲 SPOONFUL 🍲',
    org: 'qbit-tech',
    repo: 'spoonful-be',
    repoName: 'Spoonful BE',
  },
  {
    project: '🏠 REMAX 🏠',
    org: 'qbit-tech',
    repo: 'remax-fe',
    repoName: 'Remax FE (WEB, CMS, PDF)',
    previewUrl: {
      dev: 'https://remax-web-dev.qbit.co.id\nhttps://remax-cms-staging.qbit.co.id',
      staging:
        'https://remax-web-dev.qbit.co.id\nhttps://remax-cms-staging.qbit.co.id',
      prod: 'https://remax.co.id',
    },
  },
  {
    project: '🏠 REMAX 🏠',
    org: 'qbit-tech',
    repo: 'remax-be',
    repoName: 'Remax BE',
    previewUrl: {
      dev: 'https://remax-api-staging.qbit.co.id',
      staging: 'https://remax-api-staging.qbit.co.id',
      // prod: 'https://api-v2.remax.co.id',
    },
  },
  {
    project: '🏠 ASTRALAND 🏠',
    org: 'qbit-tech',
    repo: 'astraland-fe',
    repoName: 'Astraland FE (WEB, CMS)',
    previewUrl: {
      dev: 'https://astraland-web-staging.qode.biz.id',
      staging: 'https://astraland-web-staging.qode.biz.id',
      prod: 'https://astralandindonesia.co.id',
    },
  },
  {
    project: '🏠 ASTRALAND 🏠',
    org: 'qbit-tech',
    repo: 'astraland-be',
    repoName: 'Astraland BE',
    previewUrl: {
      dev: 'https://astraland-api-staging.qode.biz.id',
      staging: 'https://astraland-api-staging.qode.biz.id',
      // prod: 'https://api.astralandindonesia.co.id',
    },
  },
  {
    project: '🏃 BORMAR 🏃',
    org: 'qbit-tech',
    repo: 'borobudurmarathon-new',
    repoName: 'BORMAR Mobile App',
  },
  {
    project: '🎮 GAME SCRATCH 🎮',
    org: 'qbit-tech',
    repo: 'game-scratch-cms',
    repoName: 'Game Scratch CMS',
    previewUrl: {
      dev: 'https://scratch-cms-dev.qbit.co.id',
      staging: 'https://scratch-cms-dev.qbit.co.id',
    },
  },
  {
    project: '🎮 GAME SCRATCH 🎮',
    org: 'qbit-tech',
    repo: 'game-scratch',
    repoName: 'Game Scratch (Web)',
    previewUrl: {
      dev: 'https://scratch-dev.qbit.co.id',
      staging: 'https://scratch-dev.qbit.co.id',
    },
  },
  {
    project: 'OXONE MOBILE OPA',
    org: 'qbit-tech',
    repo: 'oxone-mobile-opa',
    repoName: 'Oxone Mobile OPA',
  },
  {
    project: 'BACKEND SAMPLE',
    org: 'qbit-tech',
    repo: 'backend-sample',
    repoName: 'Backend Sample',
    previewUrl: {
      dev: 'https://base-api-development.qbit.co.id',
      staging: 'https://base-api-development.qbit.co.id',
    },
  },
  {
    project: 'CMS TEMPLATE',
    org: 'qbit-tech',
    repo: 'cms-template',
    repoName: 'CMS Template',
    previewUrl: {
      dev: 'https://base-cms-development.qbit.co.id',
      staging: 'https://base-cms-development.qbit.co.id',
    },
  },
];

export function getRepo(repository: string) {
  const exp = repository.split('/');
  const org = exp[0];
  const repo = exp[1];

  return (
    REPOS.find((item) => item.org === org && item.repo === repo) || {
      org,
      repo,
      repoName: undefined,
      project: undefined,
    }
  );
}
