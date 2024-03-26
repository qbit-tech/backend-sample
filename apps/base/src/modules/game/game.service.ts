import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../user/user.entity';
import {
  GameCreateRequest,
  GameCreateResponse,
  GameDeleteResponse,
  GameFindAllResponse,
  GameListItem,
  GameUpdateRequest,
  GameUpdateResponse,
  GameFindOneRequest,
} from './contract/game.contract';
import { v4 as uuidv4 } from 'uuid';
import {
  generateResultPagination,
  cleanPhoneNumber,
} from '@qbit-tech/libs-utils';
import { Op, Sequelize } from 'sequelize';
import { GameModel } from './entity/game.entity';
import cryptoRandomString = require('crypto-random-string');
import {
  Game_ClaimRewardRequest,
  Game_LoginRequest,
  Game_LoginResponse,
  Game_PlayersCreateRequest,
  Game_PlayersCreateResponse,
  Game_PlayersDeleteResponse,
  Game_PlayersFindAllRequest,
  Game_PlayersFindAllResponse,
} from './contract/game_players.contract';
import { Game_PlayersModel } from './entity/game_players.entity';
import { Game_PlayerHistoriesModel } from './entity/game_player_histories.entity';
import {
  Game_PlayersHistoriesFindAllRequest,
  Game_PlayersHistoriesFindAllResponse,
} from './contract/game_player_history.contract';
import { ulid } from 'ulid';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import { SessionService } from '@qbit-tech/libs-session';
import { EAuthMethod } from '@qbit-tech/libs-authv3/dist/authentication.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameModel)
    private readonly gameModelRepository: typeof GameModel,

    @InjectModel(UserModel)
    private readonly User: typeof UserModel,

    @InjectModel(Game_PlayersModel)
    private readonly gamePlayersModelRepository: typeof Game_PlayersModel,

    @InjectModel(Game_PlayerHistoriesModel)
    private readonly gamePlayerHistoriesModelRepository: typeof Game_PlayerHistoriesModel,

    private readonly sessionService: SessionService,
  ) { }

  // Game Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  async findAll(params: {
    limit?: number;
    offset?: number;
    search?: string;
    status?: string;
  }): Promise<GameFindAllResponse> {
    try {
      let where = {};

      if (params.search) {
        where = {
          ...where,
          title: {
            [Op.iLike]: params.search,
          },
        };
      }
      if (params.status) {
        where = {
          ...where,
          status: params.status,
        };
      }

      const result = await this.gameModelRepository.findAll({
        where,
        attributes: [
          'id',
          'game_code',
          'title',
          'description',
          'max_gameplay_per_user',
          'min_reward_per_gameplay_per_user',
          'max_reward_per_gameplay_per_user',
          'max_round_per_gameplay_per_user',
          'expired_at',
          'status',
          'updatedAt',
          'createdAt',
        ],
        offset: params.offset,
        limit: params.limit || 10,
      });
      const count = await this.gameModelRepository.count({ where });
      return {
        count: count,
        next: '',
        prev: '',
        ...generateResultPagination(count, params),
        results: result.map((item) => item.get()),
        // results: result.map(item => item.get()),
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_find_all',
        message: error.message,
        payload: null,
      });
    }
  }

  async findOne(params: GameFindOneRequest): Promise<GameListItem> {
    try {
      const result = await this.gameModelRepository.findOne({
        where: {
          id: params.id,
        },
        attributes: [
          'id',
          'game_code',
          'title',
          'description',
          'max_gameplay_per_user',
          'min_reward_per_gameplay_per_user',
          'max_reward_per_gameplay_per_user',
          'max_round_per_gameplay_per_user',
          'expired_at',
          'status',
          'updatedAt',
          'createdAt',
        ],
      });
      return result ? result.get() : null;
    } catch (error) {
      return Promise.reject({
        code: 'error_in_find_one',
        message: error.message,
        payload: null,
      });
    }
  }

  async create(params: GameCreateRequest): Promise<GameCreateResponse> {
    try {
      const randomstring = cryptoRandomString({
        length: 8,
        type: 'distinguishable',
      });

      const result = await this.gameModelRepository.create({
        id: uuidv4(),
        game_code: randomstring,
        title: params.title,
        description: params.description,
        min_reward_per_gameplay_per_user:
          params.min_reward_per_gameplay_per_user,
        max_gameplay_per_user: params.max_gameplay_per_user,
        max_reward_per_gameplay_per_user:
          params.max_reward_per_gameplay_per_user,
        max_round_per_gameplay_per_user: params.max_round_per_gameplay_per_user,
        expired_at: params.expired_at,
        status: params.status || 'active',
      });

      console.log('result', result);
      return result.get();
    } catch (error) {
      return Promise.reject({
        code: 'error_in_create',
        message: error.message,
        payload: null,
      });
    }
  }

  async update(
    params: GameUpdateRequest,
    id: string,
  ): Promise<GameUpdateResponse> {
    try {
      const game = await this.gameModelRepository.findOne({
        where: { id: id },
      });

      if (game === null) {
        return Promise.reject({
          code: 'error_in_update',
          message: 'Game not found',
          payload: null,
        });
      }

      game.game_code = params.game_code;
      game.title = params.title;
      game.description = params.description;
      game.max_gameplay_per_user = params.max_gameplay_per_user;
      game.max_reward_per_gameplay_per_user =
        params.max_reward_per_gameplay_per_user;
      game.max_round_per_gameplay_per_user =
        params.max_round_per_gameplay_per_user;
      game.expired_at = params.expired_at;
      game.status = params.status || 'active';
      await game.save();

      return {
        isSuccess: true,
        id: id,
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_update',
        message: error.message,
        payload: null,
      });
    }
  }

  async delete(id: string): Promise<GameDeleteResponse> {
    try {
      const game = await this.gameModelRepository.findOne({
        where: { id: id },
      });

      if (game === null) {
        return Promise.reject({
          code: 'error_in_delete',
          message: 'Game not found',
          payload: null,
        });
      }

      await game.destroy();

      return {
        isSuccess: true,
        id: id,
        game_code: game.game_code,
        title: game.title,
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_delete',
        message: error.message,
        payload: null,
      });
    }
  }

  // Game Players Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  generateGameRewards(
    maxRound: number,
    minTotalReward: number,
    maxTotalReward: number,
  ): number[] {
    // Pastikan maxRound minimal 1
    if (maxRound < 1) {
      // throw new Error('Max round must be at least 1');
      Promise.reject({
        code: 'error_in_generate_game_rewards',
        message: 'Max round must be at least 1',
        payload: null,
      });
    }

    const rewards = [];
    let totalReward = 0;

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomNum(min, max) {
      return Math.round((Math.random() * (max - min) + min) / 500) * 500;
    }

    for (let i = 0; i < maxRound; i++) {
      let reward = randomNum(1000, 5000);

      if (i > 0) {
        while (rewards.every((val) => val === reward)) {
          reward = randomNum(1000, 5000);
        }
      }

      rewards.push(reward);
      totalReward += reward;
    }

    if (minTotalReward === maxTotalReward) {
      function getRandomInt(max) {
        return Math.floor((Math.random() * max) / 500) * 500;
      }

      const rewardWithSameTotalReward = [];

      for (let i = 0; i < maxRound - 1; i++) {
        const randomValue = getRandomInt(maxTotalReward);
        rewardWithSameTotalReward.push(randomValue);
        maxTotalReward -= randomValue;
      }
      rewardWithSameTotalReward.push(maxTotalReward);

      rewardWithSameTotalReward.sort(() => Math.random() - 0.5);
      return rewardWithSameTotalReward;
    }

    // Cek apakah total reward kurang dari minTotalReward atau lebih dari maxTotalReward
    if (totalReward < minTotalReward) {
      const remainingReward = minTotalReward - totalReward;

      for (let i = 0; i < remainingReward; i++) {
        if (totalReward < minTotalReward) {
          const index = randomIntFromInterval(0, maxRound - 1);
          rewards[index] += 1000;
          totalReward += 1000;
        }
      }
    } else if (totalReward > maxTotalReward) {
      const excessReward = totalReward - maxTotalReward;

      for (let i = 0; i < excessReward; i++) {
        if (totalReward > maxTotalReward) {
          const index = randomIntFromInterval(0, maxRound - 1);
          if (rewards[index] > 1000) {
            rewards[index] -= 1000;
            totalReward -= 1000;
          }
        }
      }
    }

    return rewards;
  }

  async addPlayerToGame(
    id: string,
    params: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    try {
      const phone = cleanPhoneNumber(params.phone);

      // find where the params phone and name is exist
      let user = await this.User.findOne({
        where: { phone },
      });
      console.log('user', user);

      if (!user) {
        user = await this.User.create({
          userId: ulid(),
          name: params.name,
          phone,
        });
      }

      const game = await this.gameModelRepository.findOne({
        where: { id: id },
      });

      const maxGameplay = game.max_gameplay_per_user;
      const availableRewards = {};

      for (let i = 1; i <= maxGameplay; i++) {
        const rewards = this.generateGameRewards(
          game.max_round_per_gameplay_per_user,
          game.min_reward_per_gameplay_per_user,
          game.max_reward_per_gameplay_per_user,
        );
        availableRewards[`gameplay_${i}`] = rewards;
      }

      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: id,
          playerId: user.userId,
        },
      });

      if (!gamePlayer) {
        const result = await this.gamePlayersModelRepository.create({
          gameId: id,
          playerId: user.userId,
          availableRewards,
        });

        await this.gamePlayerHistoriesModelRepository.create({
          playerId: user.userId,
          gameId: id,
          gameplay: 1,
          currentRound: null,
        });

        console.log('result', result);
        return result.get();
      } else {
        // return {
        //   isSuccess: false,
        //   id: gamePlayer.id,
        //   message: {
        //     catch: 'Player already exist in this game.',
        //     playerId: gamePlayer.playerId,
        //     gameId: gamePlayer.gameId,
        //   },
        // };
        return Promise.reject({
          code: 'error_in_add_player',
          message: 'Player already exist in this game.',
          payload: null,
        });
      }
    } catch (error) {
      return Promise.reject({
        code: 'error_in_add_player',
        message: error.message,
        payload: null,
      });
    }
  }

  // async getListPlayerByGame(
  //   id: string,
  //   params: Game_PlayersFindAllRequest,
  // ): Promise<any> {
  //   // get all players by game id
  //   try {
  //     const where = {
  //       gameId: id,
  //     };

  //     const result = await this.gamePlayersModelRepository.findAll({
  //       where,
  //       attributes: ['playerId'],
  //       include: [
  //         {
  //           model: UserModel,
  //           attributes: ['name', 'phone'],
  //           as: 'player',
  //         },
  //       ],
  //       offset: params.offset,
  //       limit: params.limit || 10,
  //     });
  //     // const count = await this.gamePlayersModelRepository.count({ where });
  //     // return {
  //     //   count: count,
  //     //   next: '',
  //     //   prev: '',
  //     //   ...generateResultPagination(count, params),
  //     //   results: result.map((item) => item.get()),
  //     //   // results: result.map(item => item.get()),
  //     // };



  //   } catch (error) {
  //     return Promise.reject({
  //       code: 'error_in_find_all',
  //       message: error.message,
  //       payload: null,
  //     });
  //   }
  // }

  async getListPlayerByGame(
    id: string,
    params: Game_PlayersFindAllRequest,
  ): Promise<any> {
    try {
      const playerHistories = await this.gamePlayerHistoriesModelRepository.findAll({
        where: { gameId: id },
        attributes: [
          'id',
          'playerId',
          'gameId',
          'gameplay',
          'rewardClaimedAt',
          'rewardClaimed_AllRounds',
          'totalRewardClaimed',
          'createdAt',
          'updatedAt',
          'currentRound',
          'roundHistories',
        ],
        include: [
          {
            model: UserModel,
            attributes: ['name', 'phone'],
            as: 'player',
          },
        ],
        offset: params.offset,
        limit: params.limit || 10,
      });

      const game = await this.gameModelRepository.findOne({
        where: { id },
      });

      const groupedHistories = playerHistories.reduce((acc, history) => {
        if (!acc[history.playerId]) {
          acc[history.playerId] = [];
        }
        acc[history.playerId].push(history);
        return acc;
      }, {});

      const mappingPlayer = Object.keys(groupedHistories).map(playerId => {
        const histories = groupedHistories[playerId];
        const totalReward = histories.reduce((acc, history) => acc + (history.rewardClaimed_AllRounds || []).reduce((a, b) => a + b, 0), 0);
        const detail = histories.map(history => ({
          gameplay: history.gameplay,
          allRound: (history.rewardClaimed_AllRounds || []).map((reward, index) => ({
            round: index + 1,
            rewardClaimed: reward,
          })),
        }));

        return {
          playerId,
          game_name: game ? game.title : null,
          maxGameplay: game ? game.max_gameplay_per_user : null,
          maxRound: game ? game.max_round_per_gameplay_per_user : null,
          currentGameplay: histories.length,
          totalReward,
          createdAt: histories[0].createdAt,
          updatedAt: histories[0].updatedAt,
          name: histories[0].player ? histories[0].player.name : null,
          phone: histories[0].player ? histories[0].player.phone : null,
          detail,
        };
      });

      return {
        results: mappingPlayer,
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_find_all',
        message: error.message,
        payload: null,
      });
    }
  }

  async deletePlayerFromGame(
    id: string,
    playerId: string,
  ): Promise<Game_PlayersDeleteResponse> {
    // delete player by game id and player id
    try {
      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: id,
          playerId: playerId,
        },
        include: [
          {
            model: UserModel,
            attributes: ['name', 'phone'],
            as: 'player',
          },
        ],
      });

      if (gamePlayer === null) {
        throw new HttpException(
          {
            code: 'ERROR WHEN DELETE PLAYER',
            message: 'Game player not found',
            payload: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await gamePlayer.destroy();

      return {
        isSuccess: true,
        id: id,
        gameId: gamePlayer.gameId,
        playerId: playerId,
        name: gamePlayer.player.name,
        phone: gamePlayer.player.phone,
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_delete_player',
        message: error.message,
        payload: null,
      });
    }
  }

  // Game Start Game Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  async startGame(
    code: string,
    params: Game_PlayersCreateRequest,
  ): Promise<any> {
    try {
      // Cek apakah game dengan gameCode tersedia
      const game = await this.gameModelRepository.findOne({
        where: { game_code: code, status: 'active' },
      });
      if (!game) {
        return Promise.reject({
          code: 'error_in_start_game',
          message: 'Game not found',
          payload: null,
        });
      }

      // Cek apakah phone tersebut sudah terdata di database dan userId nya ada di daftar players game ini?
      const user = await this.User.findOne({
        where: { phone: cleanPhoneNumber(params.phone) },
      });

      // Cari pengguna berdasarkan nomor telepon
      console.log('user', user);
      if (!user) {
        return Promise.reject({
          code: 'error_in_start_game',
          message: 'User not registered.',
          payload: null,
        });
      }

      // Cek apakah game sudah expired atau belum, jika sudah expired, tolak.
      if (game.expired_at && new Date(game.expired_at) < new Date()) {
        return Promise.reject({
          code: 'error_in_start_game',
          message: 'Game has expired.',
          payload: null,
        });
      }

      /// Login
      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: game.id,
          playerId: user.userId,
        },
      });

      const signInResult = await this.sessionService.generateLoginToken(
        {
          method: EAuthMethod.emailPassword,
          username: user.name,
          userId: user.userId,
        },
        user,
      );

      if (signInResult.access_token === null) {
        throw new HttpException(
          {
            code: 401,
            message: 'Failed to sign in',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const gamePlayerIdSession = gamePlayer.get().id;

      // Cek apakah pengguna sudah pernah main dan claim reward
      const isUserAlreadyClaimReward =
        await this.gamePlayerHistoriesModelRepository.findAll({
          where: {
            gameId: game.id,
            playerId: user.userId,
            rewardClaimedAt: {
              [Op.not]: null,
            },
          },
        });
      if (isUserAlreadyClaimReward.length === game.max_gameplay_per_user) {
        return Promise.reject({
          code: 'error_in_start_game',
          message: 'User has already played.',
          payload: null,
        });
      }
      // Cek apakah pengguna terdaftar dalam pemain game ini
      const isUserInGame = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: game.id,
          playerId: user.userId,
        },
      });

      // Jika user ini sudah pernah main game
      const isUserInGameHistory =
        await this.gamePlayerHistoriesModelRepository.findOne({
          where: {
            gameId: game.id,
            playerId: user.userId,
          },
          order: [['createdAt', 'DESC']],
        });

      if (!isUserInGameHistory) {
        await this.gamePlayerHistoriesModelRepository.create({
          playerId: user.userId,
          gameId: game.id,
          gameplay: 1,
          currentRound: 1,
        });

        return {
          access_token: signInResult.access_token,
          refresh_token: signInResult.refresh_token,
          userId: user.userId,
          gamePlayerId: gamePlayerIdSession,
          isVerified: 'true',
          isPasswordExpired: 'false',
          passwordExpiredAt: null,
          isBlocked: 'false',
          blockedAt: null,
          code: 'success',
          message: 'Game started For the first time',
          payload: {
            gameId: game.id,
            playerId: user.userId,
            gameplay: 1,
            currentRound: 1,
            maxGameplayPerUser: game.max_gameplay_per_user,
            maxRoundPerUser: game.max_round_per_gameplay_per_user,
          },
        };
      }

      if (isUserInGame) {
        // Pengguna telah bermain sebelumnya
        // Cek apakah masih ada gameplay yang belum selesai

        const gamePlayerHistory =
          await this.gamePlayerHistoriesModelRepository.findOne({
            where: {
              gameId: game.id,
              playerId: user.userId,
            },
            order: [['createdAt', 'DESC']],
          });

        if (
          gamePlayerHistory.currentRound < game.max_round_per_gameplay_per_user
        ) {

          if (!params.initGame) {
            const gameplayKey = `gameplay_${gamePlayerHistory.gameplay}`;
            const availableRewards = gamePlayer.availableRewards[gameplayKey];
            if (!availableRewards || availableRewards.length === 0) {
              // throw new Error('No rewards left for this gameplay');
              return Promise.reject({
                code: 'error_in_start_game',
                message: 'No rewards left for this gameplay',
                payload: null,
              });
            }

            const reward = availableRewards.shift();
            gamePlayer.availableRewards[gameplayKey] = availableRewards;
            gamePlayer.updatedAt = new Date();
            // await this.gamePlayerRepository.save(gamePlayer)
            await this.gamePlayersModelRepository.update(
              {
                availableRewards: gamePlayer.availableRewards,
                updatedAt: new Date(),
              },
              {
                where: {
                  id: gamePlayer.id,
                },
              },
            );

            // gamePlayerHistory.rewardClaimed_AllRounds.push(reward);
            await this.gamePlayerHistoriesModelRepository.update(
              {
                currentRound: gamePlayerHistory.currentRound + 1,
                rewardClaimed_AllRounds: Sequelize.fn(
                  'array_append',
                  Sequelize.col('rewardClaimed_AllRounds'),
                  reward,
                ),
                totalRewardClaimed:
                  gamePlayerHistory.totalRewardClaimed + reward,
              },
              {
                where: {
                  id: gamePlayerHistory.id,
                },
              },
            );
          }

          return {
            access_token: signInResult.access_token,
            refresh_token: signInResult.refresh_token,
            userId: user.userId,
            gamePlayerId: gamePlayerIdSession,
            isVerified: 'true',
            isPasswordExpired: 'false',
            passwordExpiredAt: null,
            isBlocked: 'false',
            blockedAt: null,
            code: 'success',
            message: `Game started in the ${gamePlayerHistory.currentRound + 1
              } round.`,
            payload: {
              gameId: game.id,
              playerId: user.userId,
              gameplay: gamePlayerHistory.gameplay,
              currentRound: gamePlayerHistory.currentRound + 1,
              realRound: gamePlayerHistory.currentRound,
              realGameplay: gamePlayerHistory.gameplay,
              maxGameplayPerUser: game.max_gameplay_per_user,
              maxRoundPerUser: game.max_round_per_gameplay_per_user,
            },
          };
        } else if (
          gamePlayerHistory.currentRound ===
          game.max_round_per_gameplay_per_user
        ) {
          // if (gamePlayerHistory.gameplay == game.max_gameplay_per_user) {
          //   throw new HttpException(
          //     {
          //       status: 'ERROR',
          //       message: 'User has reached maximum rounds allowed.',
          //       payload: null,
          //     },
          //     HttpStatus.BAD_REQUEST,
          //   );
          // }
          if (!params.initGame) {
            const gameplayKey = `gameplay_${gamePlayerHistory.gameplay}`;
            const availableRewards = gamePlayer.availableRewards[gameplayKey];

            if (availableRewards.length > 0) {
              const reward = availableRewards.shift();
              gamePlayer.availableRewards[gameplayKey] = availableRewards;
              gamePlayer.updatedAt = new Date();
              // await this.gamePlayerRepository.save(gamePlayer)
              await this.gamePlayersModelRepository.update(
                {
                  availableRewards: gamePlayer.availableRewards,
                  updatedAt: new Date(),
                },
                {
                  where: {
                    id: gamePlayer.id,
                  },
                },
              );

              // gamePlayerHistory.rewardClaimed_AllRounds.push(reward);
              await this.gamePlayerHistoriesModelRepository.update(
                {
                  currentRound: gamePlayerHistory.currentRound,
                  rewardClaimed_AllRounds: Sequelize.fn(
                    'array_append',
                    Sequelize.col('rewardClaimed_AllRounds'),
                    reward,
                  ),
                  totalRewardClaimed:
                    gamePlayerHistory.totalRewardClaimed + reward,
                },
                {
                  where: {
                    id: gamePlayerHistory.id,
                  },
                },
              );
            }

            if (gamePlayerHistory.gameplay !== game.max_gameplay_per_user) {
              await this.gamePlayerHistoriesModelRepository.create({
                playerId: user.userId,
                gameId: game.id,
                gameplay: gamePlayerHistory.gameplay + 1,
                currentRound: 1,
                realRound: gamePlayerHistory.currentRound,
                realGameplay: gamePlayerHistory.gameplay,
              });
            }
          }

          return {
            access_token: signInResult.access_token,
            refresh_token: signInResult.refresh_token,
            userId: user.userId,
            gamePlayerId: gamePlayerIdSession,
            isVerified: 'true',
            isPasswordExpired: 'false',
            passwordExpiredAt: null,
            isBlocked: 'false',
            blockedAt: null,
            code: 'success',
            message: `Game has started in the gameplay ${gamePlayerHistory.gameplay + 1
              }.`,
            payload: {
              gameId: game.id,
              playerId: user.userId,
              gameplay: gamePlayerHistory.gameplay + 1,
              currentRound: 1,
              realRound: gamePlayerHistory.currentRound,
              realGameplay: gamePlayerHistory.gameplay,
              maxGameplayPerUser: game.max_gameplay_per_user,
              maxRoundPerUser: game.max_round_per_gameplay_per_user,
            },
          };
        } else {
          return Promise.reject({
            code: 'error_in_start_game',
            message: 'User has reached maximum rounds allowed.',
            payload: null,
          });
        }
      } else {
        // Pengguna belum pernah bermain game ini
        // Cek apakah masih boleh bermain
        const newGamePlayer =
          await this.gamePlayerHistoriesModelRepository.create({
            playerId: user.userId,
            gameId: game.id,
            gameplay: 1,
            currentRound: 1,
          });

        return {
          access_token: signInResult.access_token,
          refresh_token: signInResult.refresh_token,
          userId: user.userId,
          gamePlayerId: gamePlayerIdSession,
          isVerified: 'true',
          isPasswordExpired: 'false',
          passwordExpiredAt: null,
          isBlocked: 'false',
          blockedAt: null,
          code: 'success',
          message: `First Time Playing Game Started.`,
          payload: {
            newGamePlayer,
          },
        };
      }
    } catch (error) {
      return Promise.reject({
        code: 'error_in_start_game',
        message: error.message,
        payload: null,
      });
    }
  }

  // Game Claim Reward Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  async claimReward(
    code: string,
    params: Game_ClaimRewardRequest,
  ): Promise<{
    isSuccess: true;
  }> {
    try {
      // Temukan game berdasarkan game code
      const game = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });
      if (!game) {
        return Promise.reject({
          code: 'error_in_claim_reward',
          message: 'Game not found',
          payload: null,
        });
      }

      const user = await this.User.findOne({
        where: { userId: params.playerId },
      });
      if (!user) {
        return Promise.reject({
          code: 'error_in_claim_reward',
          message: 'User not registered.',
          payload: null,
        });
      }

      // Temukan history gameplay yang belum diklaim
      const unclaimedGameplay =
        await this.gamePlayerHistoriesModelRepository.findOne({
          where: {
            gameId: game.id,
            playerId: user.userId,
            id: params.playerHistoryId,
            rewardClaimedAt: null,
          },
        });

      if (!unclaimedGameplay) {
        return Promise.reject({
          code: 'error_in_claim_reward',
          message:
            'Can’t claim this game reward. Please start the game before claim.',
          payload: null,
        });
      }

      // Lakukan update untuk menandai reward telah diklaim
      await unclaimedGameplay.update({
        rewardClaimedAt: new Date(),
      });

      return {
        isSuccess: true,
      };
    } catch (error) {
      // throw new Error(error.message);
      return Promise.reject({
        code: 'error_in_claim_reward',
        message: error.message,
        payload: null,
      });
    }
  }

  // For Web Game App

  async gameCodeCheck(code: string): Promise<any> {
    try {
      const gameCodeExtract = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });

      if (!gameCodeExtract) {
        return Promise.reject({
          code: 'error_in_game_code_check',
          message: 'Game code not found',
          payload: null,
        });
      }

      return {
        code: 'success',
        message: 'Game code found',
        payload: gameCodeExtract.get(),
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_game_code_check',
        message: error.message,
        payload: null,
      });
    }
  }

  async getStatusSession(code: string, playerId: string): Promise<any> {
    try {
      const game = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });
      if (!game) {
        return Promise.reject({
          code: 'error_in_get_status',
          message: 'Game not found',
          payload: null,
        });
      }

      const user = await this.User.findOne({
        where: { userId: playerId },
      });
      if (!user) {
        return Promise.reject({
          code: 'error_in_get_status',
          message: 'User not registered.',
          payload: null,
        });
      }

      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: game.id,
          playerId,
        },
      });

      if (!gamePlayer) {
        return Promise.reject({
          code: 'error_in_get_status',
          message: 'Game player not found.',
          payload: null,
        });
      }

      const gamePlayerHistory =
        await this.gamePlayerHistoriesModelRepository.findOne({
          where: {
            gameId: game.id,
            playerId,
          },
          order: [['createdAt', 'DESC']],
        });

      if (!gamePlayerHistory) {
        return Promise.reject({
          code: 'error_in_get_status',
          message: 'Game player history not found.',
          payload: null,
        });
      }
      // cek kalau user di step claim reward
      let isClaimPage = false;
      const currentAvailableRewards = gamePlayer.get()?.availableRewards;
      if (currentAvailableRewards) {
        const keys = Object.keys(currentAvailableRewards);
        const arrReward = [];
        for (const key of keys) {
          arrReward.push(...currentAvailableRewards[key]);
        }

        if (arrReward.length === 0) {
          isClaimPage = true;
        }
      }

      const lastGetReward = gamePlayerHistory.get().rewardClaimed_AllRounds
        ? gamePlayerHistory.get().rewardClaimed_AllRounds[
        gamePlayerHistory.get().rewardClaimed_AllRounds?.length - 1
        ]
        : null;

      return {
        code: 'success',
        message: 'Game status found',
        payload: {
          game: game.get(),
          user: user.get(),
          gamePlayer: gamePlayer.get(),
          gamePlayerHistory: gamePlayerHistory.get(),
          isClaimPage,
          lastGetReward,
        },
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_get_status',
        message: error.message,
        payload: null,
      });
    }
  }

  async getDataClaimReward(
    code: string,
    playerId: string,

    currentGameplay: number,
  ): Promise<any> {
    console.log('currentGameplay', currentGameplay);
    try {
      const game = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });
      if (!game) {
        return Promise.reject({
          code: 'error_in_get_data_claim_reward',
          message: 'Game not found',
          payload: null,
        });
      }

      const user = await this.User.findOne({
        where: { userId: playerId },
      });
      if (!user) {
        return Promise.reject({
          code: 'error_in_get_data_claim_reward',
          message: 'User not registered.',
          payload: null,
        });
      }

      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: game.id,
          playerId,
        },
      });

      if (!gamePlayer) {
        return Promise.reject({
          code: 'error_in_get_data_claim_reward',
          message: 'Game player not found.',
          payload: null,
        });
      }

      const gamePlayerHistory =
        await this.gamePlayerHistoriesModelRepository.findAll({
          where: {
            gameId: game.id,
            playerId,
            // rewardClaimedAt: null,
          },
          order: [['gameplay', 'ASC']],
        });

      if (!gamePlayerHistory) {
        return Promise.reject({
          code: 'error_in_get_data_claim_reward',
          message: 'Game player history not found.',
          payload: null,
        });
      }

      const resGamePlayerHistories = gamePlayerHistory.map((item) =>
        item.get(),
      );

      const resGamePlayerHistorySpesificGameplay = resGamePlayerHistories.find(
        (item2) => item2.gameplay === currentGameplay,
      );
      // const totalReward = resGamePlayerHistory.reduce(
      //   (acc, curr) => acc + (curr?.totalRewardClaimed || 0),
      //   0,
      // );

      return {
        code: 'success',
        message: 'Game status found',
        payload: {
          game: game.get(),
          // user: user.get(),
          gamePlayer: gamePlayer.get(),
          gamePlayerHistory: resGamePlayerHistorySpesificGameplay,
          gamePlayerHistories: resGamePlayerHistories,
          // totalReward,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'ERROR',
          message: [error, error.message],
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // For CMS
  async getAllPlayers(
    params: Game_PlayersHistoriesFindAllRequest,
  ): Promise<Game_PlayersHistoriesFindAllResponse> {
    try {
      const where = {};

      // Get the latest updatedAt for each playerId and gameId
      const latestUpdates =
        await this.gamePlayerHistoriesModelRepository.findAll({
          where,
          attributes: [
            'playerId',
            'gameId',
            [Sequelize.fn('max', Sequelize.col('updatedAt')), 'maxUpdatedAt'],
          ],
          group: ['playerId', 'gameId'],
        });

      // Convert the result to a format that can be used in a where condition
      const latestUpdatesCondition = latestUpdates.map((u) => ({
        playerId: u.playerId,
        gameId: u.gameId,
        updatedAt: u.getDataValue('maxUpdatedAt'),
      }));

      // Get the records that match the latest updatedAt for each playerId and gameId
      const result = await this.gamePlayerHistoriesModelRepository.findAll({
        where: {
          [Op.or]: latestUpdatesCondition,
        },
        attributes: [
          'id',
          'gameId',
          'playerId',
          'gameplay',
          'rewardClaimedAt',
          'rewardClaimed_AllRounds',
          'totalRewardClaimed',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: UserModel,
            attributes: ['name', 'phone'],
            as: 'player',
          },
        ],
        offset: params.offset,
        limit: params.limit || 10,
      });

      const count = await this.gamePlayerHistoriesModelRepository.count({
        where,
      });

      // Group the result by playerId and map to the desired format
      const groupedResult = _.groupBy(result, 'playerId');
      const mappedResult = Object.entries(groupedResult).map(
        ([playerId, playerHistories]) => {
          const player = playerHistories[0].player
            ? playerHistories[0].player.get()
            : null;
          const totalGameplay = _.sumBy(playerHistories, 'gameplay');
          const totalRewardAllGame = _.sumBy(
            playerHistories,
            'totalRewardClaimed',
          );
          const detail = playerHistories.map((history) => ({
            gameId: history.gameId,
            gameplay: history.gameplay,
            rewardClaimed_AllRounds: history.rewardClaimed_AllRounds,
          }));

          return {
            id: playerHistories[0].id,
            playerId,
            totalGameplay,
            totalRewardAllGame,
            totalRewardClaimed: playerHistories[0].totalRewardClaimed,
            createdAt: playerHistories[0].createdAt,
            updatedAt: playerHistories[0].updatedAt,
            name: player ? player.name : null,
            phone: player ? player.phone : null,
            detail,
          };
        },
      );

      return {
        ...generateResultPagination(count, params),
        results: mappedResult.map((item) => ({
          ...item,
          id: item.id.toString(),
        })),
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_find_all',
        message: error.message,
        payload: null,
      });
    }
  }

  async getAllPlayersByGameId(
    id: string,
    params: Game_PlayersHistoriesFindAllRequest,
  ): Promise<Game_PlayersHistoriesFindAllResponse> {
    try {
      const where = { gameId: id };

      // Get all records for the specified gameId
      const result = await this.gamePlayerHistoriesModelRepository.findAll({
        where,
        attributes: [
          'id',
          'gameId',
          'playerId',
          'gameplay',
          'rewardClaimedAt',
          'rewardClaimed_AllRounds',
          'totalRewardClaimed',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: UserModel,
            attributes: ['name', 'phone'],
            as: 'player',
          },
        ],
        offset: params.offset,
        limit: params.limit || 10,
      });

      const count = await this.gamePlayerHistoriesModelRepository.count({
        where,
      });

      // Group the result by playerId and map to the desired format
      const groupedResult = _.groupBy(result, 'playerId');
      const mappedResult = Object.entries(groupedResult).map(
        ([playerId, playerHistories]) => {
          const player = playerHistories[0].player
            ? playerHistories[0].player.get()
            : null;
          const totalGameplay = _.sumBy(playerHistories, 'gameplay');
          const totalRewardAllGame = _.sumBy(
            playerHistories,
            'totalRewardClaimed',
          );
          const detail = playerHistories.map((history) => ({
            gameplay: history.gameplay,
            rewardClaimed_AllRounds: history.rewardClaimed_AllRounds,
          }));

          return {
            playerId,
            totalGameplay,
            totalRewardAllGame,
            totalRewardClaimed: playerHistories[0].totalRewardClaimed,
            createdAt: playerHistories[0].createdAt,
            updatedAt: playerHistories[0].updatedAt,
            name: player ? player.name : null,
            phone: player ? player.phone : null,
            detail,
          };
        },
      );

      return {
        ...generateResultPagination(count, params),
        results: mappedResult,
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_find_all',
        message: error.message,
        payload: null,
      });
    }
  }

  async getAllPlayerHistory(
    params: Game_PlayersHistoriesFindAllRequest,
  ): Promise<any> {
    try {
      const playerHistories = await this.gamePlayerHistoriesModelRepository.findAll({
        attributes: [
          'id',
          'playerId',
          'gameId',
          'gameplay',
          'totalRewardClaimed',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: UserModel,
            attributes: ['name', 'phone'],
            as: 'player',
          },
        ],
      });

      const mappingPlayer = playerHistories.reduce((acc, history) => {
        const existingPlayer = acc.find(
          (player) => player.playerId === history.playerId
        );

        if (existingPlayer) {
          existingPlayer.totalGameplay += history.gameplay;
          existingPlayer.totalRewardAllGame += history.totalRewardClaimed;
          existingPlayer.updatedAt = existingPlayer.updatedAt > history.updatedAt ? existingPlayer.updatedAt : history.updatedAt;
          existingPlayer.gameIds.add(history.gameId);
        } else {
          acc.push({
            playerId: history.playerId,
            totalGameplay: history.gameplay,
            totalRewardAllGame: history.totalRewardClaimed,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
            name: history.player ? history.player.name : null,
            phone: history.player ? history.player.phone : null,
            gameIds: new Set([history.gameId]),
          });
        }

        return acc;
      }, []);

      return {
        ...generateResultPagination(mappingPlayer.length, params),
        results: mappingPlayer.map(({ gameIds, ...rest }) => ({
          ...rest,
          totalGame: gameIds.size,
        })),
      };

    } catch (error) {
      throw new Error('Error while fetching player history: ' + error.message);
    }
  }

  async getAllPlayerHistoryByPlayerId(id: string): Promise<any> {
    try {
      const playerHistories = await this.gamePlayerHistoriesModelRepository.findAll({
        where: { playerId: id },
        attributes: [
          'id',
          'playerId',
          'gameId',
          'gameplay',
          'rewardClaimedAt',
          'rewardClaimed_AllRounds',
          'totalRewardClaimed',
          'createdAt',
          'updatedAt',
          'currentRound',
          'roundHistories',
        ],
        include: [
          {
            model: UserModel,
            attributes: ['name', 'phone'],
            as: 'player',
          },
        ],
      });

      const gamePlayer = await this.gamePlayersModelRepository.findAll({
        where: { playerId: id },
      });

      const game = await this.gameModelRepository.findAll({
        where: { id: gamePlayer.map((item) => item.gameId) },
      });

      const groupedHistories = playerHistories.reduce((acc, history) => {
        if (!acc[history.gameId]) {
          acc[history.gameId] = [];
        }
        acc[history.gameId].push(history);
        return acc;
      }, {});

      const mappingPlayer = Object.keys(groupedHistories).map(gameId => {
        const histories = groupedHistories[gameId];
        const totalReward = histories.reduce((acc, history) => acc + (history.rewardClaimed_AllRounds || []).reduce((a, b) => a + b, 0), 0);
        // const maxGameplay = Math.max(...histories.map(history => history.gameplay));
        const detail = histories.map(history => ({
          gameplay: history.gameplay,
          allRound: (history.rewardClaimed_AllRounds || []).map((reward, index) => ({
            round: index + 1,
            rewardClaimed: reward,
          })),
        }));

        const gameForPlayer = game.find(game => game.id === gameId);

        return {
          gameId,
          game_name: gameForPlayer ? gameForPlayer.title : null,
          maxGameplay: gameForPlayer ? gameForPlayer.max_gameplay_per_user : null,
          maxRound: gameForPlayer ? gameForPlayer.max_round_per_gameplay_per_user : null,
          currentGameplay: histories.length,
          totalReward,
          // totalRewardClaimed: histories.reduce((acc, history) => acc + history.totalRewardClaimed, 0),
          createdAt: histories[0].createdAt,
          updatedAt: histories[0].updatedAt,
          name: histories[0].player ? histories[0].player.name : null,
          phone: histories[0].player ? histories[0].player.phone : null,
          detail,
        };
      });

      return {
        
          results: mappingPlayer,
        
      };
    } catch (error) {
      return Promise.reject({
        code: 'error_in_find_all',
        message: [error, error.message],
        payload: null,
      });
    }
  }


}
