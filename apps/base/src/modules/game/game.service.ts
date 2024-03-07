import { Injectable, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../user/user.entity';
import {
  GameApiContract,
  GameCreateRequest,
  GameCreateResponse,
  GameDeleteRequest,
  GameDeleteResponse,
  GameFindAllRequest,
  GameFindAllResponse,
  GameListItem,
  GameUpdateRequest,
  GameUpdateResponse,
  GameFindOneRequest
} from './contract/game.contract';
import { v4 as uuidv4 } from 'uuid';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { Op, Sequelize } from 'sequelize';
import { GameModel } from './entity/game.entity';
import { RoleModel } from '@qbit-tech/libs-role';
import cryptoRandomString = require('crypto-random-string');
import { Game_ClaimRewardRequest, Game_PlayersCreateRequest, Game_PlayersCreateResponse, Game_PlayersDeleteResponse, Game_PlayersFindAllRequest, Game_PlayersFindAllResponse } from './contract/game_players.contract';
import { Game_PlayersModel } from './entity/game_players.entity';
import { Game_PlayerHistoriesModel } from './entity/game_player_histories.entity';
import { Game_PlayersHistoriesFindAllRequest, Game_PlayersHistoriesFindAllResponse } from './contract/game_player_history.contract';

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
  ) { }

  async findAll(params: GameFindAllRequest): Promise<GameFindAllResponse> {
    try {
      const where = {};

      const result = await this.gameModelRepository.findAll({
        where,
        attributes: [
          'id',
          'game_code',
          'title',
          'description',
          'status',
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
        results: result.map(item => item.get()),
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
          'status',
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

      const randomstring = cryptoRandomString({ length: 8, type: 'distinguishable' });

      const result = await this.gameModelRepository.create({
        id: uuidv4(),
        game_code: randomstring,
        title: params.title,
        description: params.description,
        min_reward_per_gameplay_per_user: params.min_reward_per_gameplay_per_user,
        max_gameplay_per_user: params.max_gameplay_per_user,
        max_reward_per_gameplay_per_user: params.max_reward_per_gameplay_per_user,
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

  async update(params: GameUpdateRequest, id: string): Promise<GameUpdateResponse> {
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
      game.max_reward_per_gameplay_per_user = params.max_reward_per_gameplay_per_user;
      game.max_round_per_gameplay_per_user = params.max_round_per_gameplay_per_user;
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

  async createPlayer(id: string, params: Game_PlayersCreateRequest): Promise<Game_PlayersCreateResponse> {
    try {

      let user = await this.User.findOne({ where: { phone: params.phone } });
      console.log('user', user);
      // const result = await this.gameModelRepository.create({
      //   id: uuidv4(),
      //   gameId: id
      //   playerId: params.playerId,
      //   availableReward: params.availableReward,
      // });

      if (!user) {
        user = await this.User.create({
          id: uuidv4(),
          name: params.name,
          phone: params.phone,
        });
        console.log('user', user);
      }

      const result = await this.gamePlayersModelRepository.create({
        gameId: id,
        playerId: user.userId,
      });

      const copy = await this.gamePlayerHistoriesModelRepository.create({
        gameId: id,
        playerId: user.userId,
        gameplay: 1,
        round: 1,
      });

      console.log('result', result);
      return result.get();
      return copy.get();
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

  async startGame(id: string, params: Game_PlayersCreateRequest): Promise<Game_PlayersCreateResponse> {
    try {
      // Cek apakah game dengan gameCode tersedia
      const game = await this.gameModelRepository.findOne({ where: { id: id } });
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
      const user = await this.User.findOne({ where: { phone: params.phone } });
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
      const isUserInGame = await this.gamePlayerHistoriesModelRepository.findOne({
        where: {
          gameId: game.id,
          playerId: user.userId,
          gameplay: {
            [Op.gte]: 1,
          },
        },
        order: [['gameplay', 'DESC']]
      });

      if (isUserInGame) {
        // Pengguna telah bermain sebelumnya
        // Cek apakah masih ada gameplay yang belum selesai
        if (isUserInGame.gameplay < game.max_gameplay_per_user) {
          // // Resume gameplay
          // isUserInGame.gameplay++;
          // await isUserInGame.save();
          // return isUserInGame.get();
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
        const totalGameplay = await this.gamePlayerHistoriesModelRepository.count({
          where: {
            playerId: user.userId,
            createdAt: {
              [Op.gt]: new Date(new Date().setDate(new Date().getDate() - 1)), // Mencari data dalam 24 jam terakhir
            },
          },
        });

        if (totalGameplay < game.max_gameplay_per_user) {
          // Memenuhi syarat untuk bermain
          const result = await this.gamePlayerHistoriesModelRepository.create({
            userId: user.id,
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

  async claimReward(id: string, params: Game_ClaimRewardRequest): Promise<Game_PlayersCreateResponse> {
    try {
      // Temukan game berdasarkan game code
      const game = await this.gameModelRepository.findOne({ where: { id: id } });
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

      const user = await this.User.findOne({ where: { userId: params.playerId } });
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
      const unclaimedGameplay = await this.gamePlayerHistoriesModelRepository.findOne({
        where: {
          gameId: game.id,
          playerId: user.userId,
          // claimedReward: false,
          rewardClaimedAt: null,
        },
        order: [['createdAt', 'DESC']],
      });

      if (!unclaimedGameplay) {
        throw new Error('Can’t claim this game reward. Please start the game before claim.');
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

  async findAllPlayers(id: string, params: Game_PlayersFindAllRequest): Promise<Game_PlayersFindAllResponse> {
    // get all players by game id
    try {
      const where = {
        gameId: id
      };

      const result = await this.gamePlayersModelRepository.findAll({
        where,
        attributes: ['playerId'],
        include: [{
          model: UserModel,
          attributes: ['name', 'phone'],
          as: 'player',
        }],
        offset: params.offset,
        limit: params.limit || 10,
      });
      const count = await this.gamePlayersModelRepository.count({ where });
      return {
        count: count,
        next: '',
        prev: '',
        ...generateResultPagination(count, params),
        results: result.map(item => item.get()),
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

  async getAllPlayers(params: Game_PlayersHistoriesFindAllRequest): Promise<Game_PlayersHistoriesFindAllResponse> {
    try {
      const where = {};

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
        include: [{
          model: UserModel,
          attributes: ['name', 'phone'],
          as: 'player',
        }],
        offset: params.offset,
        limit: params.limit || 10,
      });
      const count = await this.gamePlayerHistoriesModelRepository.count({ where });
      return {
        count: count,
        next: '',
        prev: '',
        ...generateResultPagination(count, params),
        results: result.map(item => item.get()),
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

  async deletePlayer(id: string, playerId: string): Promise<Game_PlayersDeleteResponse> {
    // delete player by game id and player id
    try {
      const gamePlayer = await this.gamePlayersModelRepository.findOne({
        where: {
          gameId: id,
          playerId: playerId
        },
        include: [{
          model: UserModel,
          attributes: ['name', 'phone'],
          as: 'player',
        }],
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

}
