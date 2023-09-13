Clone this repo use SSH. Don't use HTTPS.

## Requirements:
- Please use `yarn`
- NodeJS v18.17.0
- Database PostgreSQL

## Step By Step, How to Install & Start (LINUX / MACOS / Windows WSL)
1. Enter the folder apps/[project]. Misalnya `cd apps/base`.
2. Copy file `.env.example` to `.env.local`. Then fill the value.
3. Back to root project folder. Run command `cd ../..` from folder apps/[project].
4. Run command `./install.sh`
5. Run command `yarn start-[folder-name-in-apps]`. e.g `yarn start-base`

## Step By Step, How to Install & Start (WINDOWS without WSL)
1. Enter the folder apps/[project]. Misalnya `cd apps/base`.
2. Copy file `.env.example` to `.env.local`. Then fill the value.
3. Back to root project folder. Run command `cd ../..` from folder apps/[project].
4. Run command `yarn install`
5. Run all migrations manually
- ?? ask your mentor !!
6. Run command `yarn start-[folder-name-in-apps]`. e.g `yarn start-base`

## Generate SSH & Add to Github
- Run command `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
- Don't use `passphrases`. Ignore it.
- Add your SSH Key to Github >> https://github.com/settings/keys
  
Refferences: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

## How to Generate New Migration
- cd apps/[project]
- npx sequelize migration:generate --name [migration_name]
- write some code in new created file
- cd ../.. (back to root project)

===

## ABOUT NEST

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## If you're using windows and struggling run yarn :
- delete node_modules & yarn.lock
- delete libs address, notification-scheduler, session, uploader, product on package.json
- run yarn
- run yarn add libs session -> address | notification-scheduler -> uploader -> product
