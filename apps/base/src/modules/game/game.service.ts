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
} from './game.contract';
import { v4 as uuidv4 } from 'uuid';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { Op } from 'sequelize';
import { GameModel } from './game.entity';
import { RoleModel } from '@qbit-tech/libs-role';
import cryptoRandomString = require('crypto-random-string');

@Injectable()
export class GameService {

  constructor(
    @InjectModel(GameModel)
    private readonly gameModelRepository: typeof GameModel,
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

}
