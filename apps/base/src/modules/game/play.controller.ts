import { Controller, Post, Body, Param, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Game_ClaimRewardRequest,
  Game_PlayersCreateRequest,
  Game_PlayersCreateResponse,
} from './contract/game_players.contract';

@ApiTags('Play Game')
@Controller('play')
export class PlayGameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Start Game By Game Id' })
  @Post(':id/start')
  async gameStart(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.startGame(id, { ...body });
  }

  async startGame(
    id: string,
    params: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.gameService.startGame(id, params);
  }

  @ApiOperation({ summary: 'Claim Reward By Game Id and Player Id' })
  @Post(':id/cliam-reward')
  async rewardClaim(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: Game_ClaimRewardRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.claimReward(id, { ...body });
  }

  async claimReward(
    id: string,
    params: Game_ClaimRewardRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.gameService.claimReward(id, params);
  }
}
