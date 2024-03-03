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
import { Game_PlayersCreateRequest, Game_PlayersCreateResponse, Game_PlayersDeleteResponse, Game_PlayersFindAllRequest, Game_PlayersFindAllResponse } from './contract/game_players.contract';
import { Game_PlayersModel } from './entity/game_players.entity';

@Injectable()
export class GameService {

  constructor(
    @InjectModel(GameModel)
    private readonly gameModelRepository: typeof GameModel,

    @InjectModel(UserModel)
    private readonly User: typeof UserModel,

    @InjectModel(Game_PlayersModel)
    private readonly gamePlayersModelRepository: typeof Game_PlayersModel,
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

  async createPlayer(id: string,params: Game_PlayersCreateRequest): Promise<Game_PlayersCreateResponse> {
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
        playerId: user.userId
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
