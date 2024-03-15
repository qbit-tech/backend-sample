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
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Game_PlayersCreateRequest,
  Game_PlayersCreateResponse,
} from './contract/game_players.contract';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';

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
    return await this.gameService.createPlayer(id, { ...body });
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
    return await this.gameService.getAllPlayersByGameId(id, params);
  }

  @ApiOperation({ summary: 'Delete Players By Game Id and Player Id' })
  @Delete(':playerId')
  @UseGuards(AuthPermissionGuardV2(['GAME_PLAYER.DELETE']))
  async deleteGamePlayers(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
  ): Promise<any> {
    return await this.deletePlayer(id, playerId);
  }

  async deletePlayer(id: string, playerId: string): Promise<any> {
    return await this.gameService.deletePlayer(id, playerId);
  }
}
