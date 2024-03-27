import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Param,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Game_PlayersCreateRequest,
  Game_PlayersCreateResponse,
} from './contract/game_players.contract';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
import { GameCreateRequest } from './contract/game.contract';

@ApiTags('Game Player')
@Controller('games/:id/players')
export class GamePlayerController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Create Players By Game Id' })
  @Post()
  @UseGuards(AuthPermissionGuardV2(['GAME_PLAYER.ADD', 'GAME_PLAYER.CREATE']))
  async createGamePlayers(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.gameService.addPlayerToGame(id, { ...body });
  }

  @ApiOperation({ summary: 'Get all players by game id' })
  @Get()
  @UseGuards(AuthPermissionGuardV2(['GAME_PLAYER.LIST', 'GAME_PLAYER.VIEW']))
  async getGamePlayers(
    @Param('id') id: string,
    @Query() query: any,
  ): Promise<any> {
    return await this.findAllPlayers(id, query);
  }

  async findAllPlayers(id: string, params: any): Promise<any> {
    return await this.gameService.getListPlayerByGame(id, params);
  }

  @ApiOperation({ summary: 'Delete Players By Game Id and Player Id' })
  @ApiBearerAuth()
  @Delete(':playerId')
  @UseGuards(AuthPermissionGuardV2())
  async deleteGamePlayers(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
  ): Promise<any> {
    return await this.deletePlayer(id, playerId);
  }

  async deletePlayer(id: string, playerId: string): Promise<any> {
    return await this.gameService.deletePlayerFromGame(id, playerId);
  }

  @ApiOperation({ summary: 'Update Players By Game Id and Player Id' })
  @ApiBearerAuth()
  @Patch(':playerId')
  @UseGuards(AuthPermissionGuardV2())
  async updateGamePlayers(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
    @Body() body: Game_PlayersCreateRequest,
  ): Promise<any> {
    return await this.updatePlayer(id, playerId, body);
  }

  async updatePlayer(
    id: string,
    playerId: string,
    body: Game_PlayersCreateRequest,
  ): Promise<any> {
    return await this.gameService.updatePlayerFromGame(id, playerId, body);
  }
}
