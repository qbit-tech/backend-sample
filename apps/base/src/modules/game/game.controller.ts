import {
  Controller,
  Get,
  Post,
  Query,
  Put,
  Body,
  UseGuards,
  Param,
  Req,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  GameCreateRequest,
  GameCreateResponse,
  GameDeleteResponse,
  GameFindAllRequest,
  GameFindAllResponse,
  GameListItem,
  GameUpdateRequest,
  GameUpdateResponse,
  GameFindOneRequest,
} from './contract/game.contract';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';

@ApiTags('Game')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Get all games' })
  @Get()
  @UseGuards(AuthPermissionGuardV2(['GAME.LIST', 'GAME.VIEW']))
  async getGameList(
    @Query() query: GameFindAllRequest,
  ): Promise<GameFindAllResponse> {
    return this.findAll({ ...query });
  }

  async findAll(params: GameFindAllRequest): Promise<GameFindAllResponse> {
    return await this.gameService.findAll(params);
  }

  @ApiOperation({ summary: 'Get game by id' })
  @Get(':id')
  @UseGuards(AuthPermissionGuardV2(['GAME.DETAIL', 'GAME.VIEW']))
  async getGameById(@Param('id') id: string): Promise<GameListItem> {
    return this.findOne({ id });
  }

  async findOne(params: GameFindOneRequest): Promise<GameListItem> {
    return await this.gameService.findOne(params);
  }

  @ApiOperation({ summary: 'Create game' })
  @Post()
  @UseGuards(AuthPermissionGuardV2(['GAME.CREATE', 'GAME.VIEW']))
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
  @UseGuards(AuthPermissionGuardV2(['GAME.UPDATE']))
  async updateGame(
    @Param() param: { id: string },
    @Req() request: any,
    @Body() body: GameUpdateRequest,
  ): Promise<GameUpdateResponse> {
    return await this.update(
      {
        ...body,
      },
      param.id,
    );
  }

  async update(
    params: GameUpdateRequest,
    id: string,
  ): Promise<GameUpdateResponse> {
    return await this.gameService.update(params, id);
  }

  @ApiOperation({ summary: 'Delete game' })
  @Delete(':id')
  @UseGuards(AuthPermissionGuardV2(['GAME.DELETE']))
  async deleteGame(
    @Param() param: { id: string },
  ): Promise<GameDeleteResponse> {
    return await this.delete(param.id);
  }

  async delete(id: string): Promise<GameDeleteResponse> {
    return await this.gameService.delete(id);
  }
}
