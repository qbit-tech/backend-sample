import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Get all game player history' })
  @Get()
  @UseGuards(AuthPermissionGuardV2(['GAME.LIST', 'GAME.VIEW']))
  async getGamePlayerHistory(
    @Query() query: Game_PlayersHistoriesFindAllRequest,
  ): Promise<Game_PlayersHistoriesFindAllResponse> {
    return await this.findAllPlayerHistory(query);
  }

  async findAllPlayerHistory(
    params: Game_PlayersHistoriesFindAllRequest,
  ): Promise<Game_PlayersHistoriesFindAllResponse> {
    return await this.gameService.getAllPlayers(params);
  }
}
