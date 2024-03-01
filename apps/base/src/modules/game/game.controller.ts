import {
  Controller,
  Get,
  Post,
  Query,
  Put,
  Body,
  UseGuards,
  Param,
  Patch,
  Req,
  Delete,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameModel } from './game.entity';
import { GameService } from './game.service';
import {
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @ApiOperation({ summary: 'Get all games' })
  @Get()
  // //@UseGuards(AuthPermissionGuard())
  async getGameList(
    @Query() query: GameFindAllRequest,
  ): Promise<GameFindAllResponse> {
    const params: GameFindAllRequest = {
      keyword: query.keyword ? query.keyword : "",
      limit: query.limit ? Number(query.limit) : 10,
      offset: query.offset ? Number(query.offset) : 0,
      game_code: query.game_code ? query.game_code : "",
      title: query.title ? query.title : "",
      description: query.description ? query.description : "",
      status: query.status ? query.status : "",
    };

    return this.findAll(params);
  }

  async findAll(params: GameFindAllRequest): Promise<GameFindAllResponse> {
    return await this.gameService.findAll(params);
  }





  @ApiOperation({ summary: 'Get game by id' })
  @Get(':id')
  // //@UseGuards(AuthPermissionGuard())
  async getGameById(
    @Param() param: { id: string },
  ): Promise<GameListItem> {
    return this.findOne({ id: param.id });
  }

  async findOne(params: GameFindOneRequest): Promise<GameListItem> {
    return await this.gameService.findOne(params);
  }






  @ApiOperation({ summary: 'Create game' })
  @Post()
  // //@UseGuards(AuthPermissionGuard())
  async createGame(
    @Req() request: any,
    @Body() body: GameCreateRequest,
  ): Promise<GameCreateResponse> {
    return await this.create({ ...body });
  }

  async create(params: GameCreateRequest): Promise<GameCreateResponse> {
    return await this.gameService.create(params);
  }





  @Put(':id')
  //@UseGuards(AuthPermissionGuard())
  async updateCompany(
      @Param() param: { id: string },
      @Req() request: any,
      @Body() body: GameUpdateRequest,
  ): Promise<GameUpdateResponse> {
      return await this.update({
          ...body,
      }, param.id);
  }

  async update(params: GameUpdateRequest, id: string): Promise<GameUpdateResponse> {
      return await this.gameService.update(params, id);
  }






  @ApiOperation({ summary: 'Delete game' })
  @Delete(':id')
  // //@UseGuards(AuthPermissionGuard())
  async deleteGame(
    @Param() param: { id: string },
    @Req() request: GameDeleteRequest,
    @Body() body: GameDeleteRequest,
  ): Promise<GameDeleteResponse> {
    return await this.delete(param.id);
  }

  async delete(id: string): Promise<GameDeleteResponse> {
    return await this.gameService.delete(id);
  }











}
