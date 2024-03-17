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
      throw new HttpException(
        {
          status: 'ERROR IN FIND ALL',
          message: [error, error.message],
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        {
          status: 'ERROR IN FIND ONE',
          message: error,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        {
          status: 'ERR_COMPANY_REQUEST',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
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
        throw new HttpException(
          {
            code: 'ERR_COMPANY_NOT_FOUND',
            message: 'company tidak tersedia',
            payload: null,
          },
          HttpStatus.NOT_FOUND,
        );
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
      throw new HttpException(
        {
          status: 'ERR_COMPANY_UPDATE',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string): Promise<GameDeleteResponse> {
    try {
      const game = await this.gameModelRepository.findOne({
        where: { id: id },
      });

      if (game === null) {
        throw new HttpException(
          {
            code: 'ERR_COMPANY_NOT_FOUND',
            message: 'company tidak tersedia',
            payload: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await game.destroy();

      return {
        isSuccess: true,
        id: id,
        game_code: game.game_code,
        title: game.title,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'ERR_COMPANY_UPDATE',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }





  // Game Players Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  generateGameRewards(maxRound: number, minTotalReward: number, maxTotalReward: number): number[] {
    const rewards: number[] = [];

    // Pastikan maxRound minimal 1
    if (maxRound < 1) {
      throw new Error('Max round must be at least 1');
    }

    // Hitung nilai range reward
    // const rewardRange = maxTotalReward - minTotalReward;
    // const rewardRange = Math.floor((maxTotalReward - minTotalReward) / maxRound);
    let rewardRange: number;

    if (maxTotalReward <= 100) {
      rewardRange = Math.floor(Math.random() * (maxTotalReward - minTotalReward) / 10) * 10;
    } else if (maxTotalReward <= 1000) {
      rewardRange = Math.floor(Math.random() * (maxTotalReward - minTotalReward) / 100) * 100;
    } else {
      rewardRange = Math.floor(Math.random() * (maxTotalReward - minTotalReward) / 1000) * 1000;
    }

    console.log('rewardRange', rewardRange);

    let remainingReward = rewardRange;

    for (let i = 0; i < maxRound - 1; i++) {
      console.log('remainingReward', remainingReward);
      let randomReward: number;
      if (i === 0) {
        // Jika posisi i adalah i[0]
        const halfRewardRange = rewardRange / 2;

        if (halfRewardRange <= 100) {
          randomReward = Math.floor(Math.random() * (halfRewardRange / 10)) * 10;
        } else if (halfRewardRange <= 1000) {
          randomReward = Math.floor(Math.random() * (halfRewardRange / 100)) * 100;
        } else {
          randomReward = Math.floor(Math.random() * (halfRewardRange / 1000)) * 1000;
        }

      } else {
        if (remainingReward <= 100) {
          randomReward = Math.floor(Math.random() * (remainingReward / 10)) * 10;
        } else if (remainingReward <= 1000) {
          randomReward = Math.floor(Math.random() * (remainingReward / 100)) * 100;
        } else {
          randomReward = Math.floor(Math.random() * (remainingReward / 1000)) * 1000;
        }
      }
      console.log('randomReward', randomReward);
      remainingReward -= randomReward;
      rewards.push(randomReward);
    }


    rewards.push(remainingReward);


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
        console.log('user', user);
      }

      const game = await this.gameModelRepository.findOne({
        where: { id: id },
      });

      const maxGameplay = game.max_gameplay_per_user
      const availableRewards = {};

      for (let i = 1; i <= maxGameplay; i++) {
        const rewards = this.generateGameRewards(game.max_round_per_gameplay_per_user, game.min_reward_per_gameplay_per_user, game.max_reward_per_gameplay_per_user);
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

        console.log('result', result);
        return result.get();
      } else {
        return {
          isSuccess: false,
          id: gamePlayer.id,
          message: {
            catch: 'Player already exist in this game.',
            playerId: gamePlayer.playerId,
            gameId: gamePlayer.gameId,
          },
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'ERR_COMPANY_REQUEST',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getListPlayerByGame(
    id: string,
    params: Game_PlayersFindAllRequest,
  ): Promise<Game_PlayersFindAllResponse> {
    // get all players by game id
    try {
      const where = {
        gameId: id,
      };

      const result = await this.gamePlayersModelRepository.findAll({
        where,
        attributes: ['playerId'],
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
      const count = await this.gamePlayersModelRepository.count({ where });
      return {
        count: count,
        next: '',
        prev: '',
        ...generateResultPagination(count, params),
        results: result.map((item) => item.get()),
        // results: result.map(item => item.get()),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'ERROR IN FIND ALL',
          message: [error, error.message],
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
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
            code: 'ERR_COMPANY_NOT_FOUND',
            message: 'company tidak tersedia',
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
      throw new HttpException(
        {
          status: 'ERR_COMPANY_UPDATE',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }




  // Game Start Game Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  async startGame(
    code: string,
    params: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    try {
      // Cek apakah game dengan gameCode tersedia
      const game = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });
      if (!game) {
        throw new HttpException(
          {
            status: 'ERROR',
            message: 'Game not found.',
            payload: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Cek apakah game telah kedaluwarsa
      if (game.expired_at && new Date(game.expired_at) < new Date()) {
        throw new HttpException(
          {
            status: 'ERROR',
            message: 'Game has expired.',
            payload: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cari pengguna berdasarkan nomor telepon
      const user = await this.User.findOne({
        where: { name: params.name, phone: params.phone },
      });
      console.log('user', user.userId);
      if (!user) {
        throw new HttpException(
          {
            status: 'ERROR',
            message: 'User not registered.',
            payload: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cek apakah pengguna terdaftar dalam pemain game ini
      const isUserInGame =
        await this.gamePlayerHistoriesModelRepository.findOne({
          where: {
            gameId: game.id,
            playerId: user.userId,
            gameplay: {
              [Op.gte]: 1,
            },
          },
          order: [['gameplay', 'DESC']],
        });

      if (isUserInGame) {
        // Pengguna telah bermain sebelumnya
        // Cek apakah masih ada gameplay yang belum selesai
        if (isUserInGame.gameplay < game.max_gameplay_per_user) {
          await this.gamePlayerHistoriesModelRepository.create({
            playerId: user.userId,
            gameId: game.id,
            gameplay: isUserInGame.gameplay + 1,
            round: 1,
          });
        } else {
          throw new HttpException(
            {
              status: 'ERROR',
              message: 'User has reached maximum rounds allowed.',
              payload: null,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        // Pengguna belum pernah bermain game ini
        // Cek apakah masih boleh bermain
        const totalGameplay =
          await this.gamePlayerHistoriesModelRepository.count({
            where: {
              playerId: user.userId,
              createdAt: {
                [Op.gt]: new Date(new Date().setDate(new Date().getDate() - 1)),
              },
            },
          });

        if (totalGameplay < game.max_gameplay_per_user) {
          // Memenuhi syarat untuk bermain
          const result = await this.gamePlayerHistoriesModelRepository.create({
            playerId: user.userId,
            gameId: game.id,
            gameplay: 1,
            round: 1,
          });

          return result.get();
        } else {
          throw new HttpException(
            {
              status: 'ERROR',
              message: 'User has reached maximum gameplay allowed per day.',
              payload: null,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
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

  // Game Claim Reward Api (ref : https://www.notion.so/geene/Game-Scratch-Features-5cd6ac95518948d897456e1ccfbd2a05)

  async claimReward(
    code: string,
    params: Game_ClaimRewardRequest,
  ): Promise<Game_PlayersCreateResponse> {
    try {
      // Temukan game berdasarkan game code
      const game = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });
      if (!game) {
        throw new HttpException(
          {
            status: 'ERROR',
            message: 'Game not found.',
            payload: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.User.findOne({
        where: { userId: params.playerId },
      });
      if (!user) {
        throw new HttpException(
          {
            status: 'ERROR',
            message: 'User not registered.',
            payload: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Temukan history gameplay yang belum diklaim
      const unclaimedGameplay =
        await this.gamePlayerHistoriesModelRepository.findOne({
          where: {
            gameId: game.id,
            playerId: user.userId,
            // claimedReward: false,
            rewardClaimedAt: null,
          },
          order: [['createdAt', 'DESC']],
        });

      if (!unclaimedGameplay) {
        throw new Error(
          'Can’t claim this game reward. Please start the game before claim.',
        );
      }

      // Lakukan update untuk menandai reward telah diklaim
      await this.gamePlayerHistoriesModelRepository.update(
        {
          rewardClaimedAt: new Date(),
          rewardClaimed_AllRounds: [unclaimedGameplay.gameplay],
          totalRewardClaimed: 1,
        },
        {
          where: {
            id: unclaimedGameplay.id,
          },
        },
      );

      return unclaimedGameplay.get();
    } catch (error) {
      throw new Error(error.message);
    }
  }






  // For Web Game App
  async gameLogin(
    code: string,
    params: Game_LoginRequest,
  ): Promise<any> {
    try {
      const name = params.name;
      const phone = cleanPhoneNumber(params.phone);

      const gameCodeExtract = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });

      const gameId = gameCodeExtract.get().id;
      console.log('gameId', gameId);

      let user = await this.User.findOne({
        where: { name, phone },
      });

      console.log('user', user)

      if (!user) {
        return {
          code: 'failed',
          message: 'User not found',
          payload: null,
        };
      }

      let gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId,
          playerId: user.userId,
        },
      });

      /// session dari qbit (puyeng njir :v)
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

      // return {
      //   access_token: signInResult.access_token,
      //   refresh_token: signInResult.refresh_token,
      //   userId: authenticateLogin.userId,
      //   isVerified: authenticateLogin.isVerified,
      //   isPasswordExpired: authenticateLogin.isPasswordExpired,
      //   passwordExpiredAt: authenticateLogin.passwordExpiredAt,
      //   isBlocked: authenticateLogin.isBlocked,
      //   blockedAt: authenticateLogin.blockedAt,
      // };

      ////
      // const userId = user.get().id;
      // const sessionId = uuidv4();
      // const access_token = jwt.sign({ sessionId, userId }, process.env.SESSION_HASH_TOKEN, { expiresIn: '1h' });
      // const refresh_token = jwt.sign({ sessionId, userId }, process.env.RANDOM_SESSIONID_KEY, { expiresIn: '30d' });

      // const userId = user.get().userId;
      const gamePlayerIdSession = gamePlayer.get().id;
      // const sessionId = uuidv4();
      // const access_token = jwt.sign({ sessionId, userId }, process.env.SESSION_HASH_TOKEN, { expiresIn : '1h' });
      // const refresh_token = jwt.sign({ sessionId, userId }, process.env.RANDOM_SESSIONID_KEY, { expiresIn : '30d' });

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
      }

    } catch (error) {
      throw new HttpException(
        {
          status: 'ERR_COMPANY_REQUEST',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async gameCodeCheck(
    code: string,
  ): Promise<any> {
    try {
      console.log('code', code);
      const gameCodeExtract = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });

      if (!gameCodeExtract) {
        // throw new HttpException {
        //   code: 'failed',
        //   message: 'Game code not found',
        //   payload: null,
        // };
        // HttpStatus.BAD_REQUEST
        throw new HttpException(
          {
            status: 'failed',
            message: 'Game code not found',
            payload: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        code: 'success',
        message: 'Game code found',
        payload: gameCodeExtract.get(),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'ERR_COMPANY_REQUEST',
          message: error.message,
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async startRound(
    code: string, playerId: string
  ): Promise<any> {
    try {

      const gameCodeExtract = await this.gameModelRepository.findOne({
        where: { game_code: code },
      });

      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: gameCodeExtract.id,
          playerId,
        },
      });

      // const gamePlayer = await this.gamePlayersModelRepository.findOne({ where: { gameId, playerId } });
      // if (!gamePlayer) {
      //   throw new Error('Game player not found');
      // }

      const gameplays = Object.keys(gamePlayer.availableRewards);
      const latestGameplay = gameplays.sort((a, b) => parseInt(b.split('_')[1]) - parseInt(a.split('_')[1]))[0];

      const availableRewards = gamePlayer.availableRewards[latestGameplay];
      if (!availableRewards || availableRewards.length === 0) {
        throw new Error('No rewards left for this gameplay');
      }

      let gamePlayerHistory = await this.gamePlayerHistoriesModelRepository.findOne({
        where: {
          gameId: gameCodeExtract.id,
          playerId,
        },
        order: [['createdAt', 'DESC']], 
      });

      if (!gamePlayerHistory) {
        throw new Error('Game player history not found');
      }

      const reward = availableRewards.shift();
      gamePlayer.availableRewards[latestGameplay] = availableRewards;
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

      gamePlayerHistory.rewardClaimed_AllRounds.push(reward);

      // Save the updated gamePlayerHistory
      // await this.gamePlayerHistoryRepository.save(gamePlayerHistory);
      // await this.gamePlayerHistoriesModelRepository.save(gamePlayerHistory);
      await gamePlayerHistory.save();

      return gamePlayerHistory;


      // gamePlayerHistory.rewardClaimed_AllRounds.push(reward);
      // // gamePlayerHistory.totalRewardClaimed += reward;
      // await this.gamePlayerHistoriesModelRepository.update(
      //   {
      //     // rewardClaimedAt: new Date(),
      //     rewardClaimed_AllRounds: gamePlayerHistory.rewardClaimed_AllRounds,
      //     // totalRewardClaimed: gamePlayerHistory.totalRewardClaimed,
      //   },
      //   {
      //     where: {
      //       gameId: gameCodeExtract.id,
      //       playerId,
      //     },
      //   },
        
      // );

      return gamePlayerHistory;

    } catch (error) {
      throw new HttpException(
        {
          status: 'ERR_COMPANY_REQUEST',
          message: error.message,
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
      throw new HttpException(
        {
          status: 'ERROR IN FIND ALL',
          message: [error, error.message],
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        {
          status: 'ERROR IN FIND ALL',
          message: [error, error.message],
          payload: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


}
