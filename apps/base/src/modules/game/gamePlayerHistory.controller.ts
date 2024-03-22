import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Game_PlayersHistoriesFindAllRequest,
  Game_PlayersHistoriesFindAllResponse,
} from './contract/game_player_history.contract';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';

@ApiTags('game')
@Controller('game-player-history')
export class GamePlayerHistoryController {
  constructor(private readonly gameService: GameService) {}

  // @ApiOperation({ summary: 'Get all game player history' })
  // @Get()
  // // @UseGuards(AuthPermissionGuardV2(['GAME.LIST', 'GAME.VIEW']))
  // async getGamePlayerHistory(
  //   @Query() query: Game_PlayersHistoriesFindAllRequest,
  // ): Promise<Game_PlayersHistoriesFindAllResponse> {
  //   return await this.findAllPlayerHistory(query);
  // }

  // async findAllPlayerHistory(
  //   params: Game_PlayersHistoriesFindAllRequest,
  // ): Promise<Game_PlayersHistoriesFindAllResponse> {
  //   return await this.gameService.getAllPlayers(params);
  // }

  @ApiOperation({ summary: 'Get all game player history' })
  @Get()
  // @UseGuards(AuthPermissionGuardV2(['GAME.LIST', 'GAME.VIEW']))
  async getGamePlayerHistory(
    @Query() query: Game_PlayersHistoriesFindAllRequest,
  ): Promise<Game_PlayersHistoriesFindAllResponse> {
    return await this.findAllPlayerHistory(query);
  }

  async findAllPlayerHistory(
    params: Game_PlayersHistoriesFindAllRequest,
  ): Promise<Game_PlayersHistoriesFindAllResponse> {
    return await this.gameService.getAllPlayerHistory(params);
  }

  
  @ApiOperation({ summary: 'Get game player history by id' })
  @Get(':id')
  // @UseGuards(AuthPermissionGuardV2(['GAME.DETAIL', 'GAME.VIEW']))
  async getGamePlayerHistoryById(
    @Param('id') id: string,
  ): Promise<any> {
    return await this.findOnePlayerHistory(id);
  }

  async findOnePlayerHistory(params: any): Promise<any> {
    return await this.gameService.getAllPlayerHistoryByPlayerId(params);
  }
  
}
