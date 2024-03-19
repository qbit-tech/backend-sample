import { Controller, Post, Body, Param, Req, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Game_ClaimRewardRequest,
  Game_PlayersCreateRequest,
  Game_PlayersCreateResponse,
  Game_PlayersStartRoundRequest,
} from './contract/game_players.contract';

@ApiTags('Play Game')
@Controller('play')
export class PlayGameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Start Game By Game Code' })
  @Post(':code/start')
  async gameStart(
    @Param('code') code: string,
    @Req() request: any,
    @Body() body: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.startGame(code, { ...body });
  }

  async startGame(
    id: string,
    params: Game_PlayersCreateRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.gameService.startGame(id, params);
  }




  @ApiOperation({ summary: 'Claim Reward By Game Id and Player Id' })
  @Post(':code/claim-reward')
  async rewardClaim(
    @Param('code') code: string,
    @Req() request: any,
    @Body() body: Game_ClaimRewardRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.claimReward(code, { ...body });
  }

  async claimReward(
    id: string,
    params: Game_ClaimRewardRequest,
  ): Promise<Game_PlayersCreateResponse> {
    return await this.gameService.claimReward(id, params);
  }





  // @ApiOperation({ summary: 'Start Round By Game Code and Player Id' })
  // @Post(':code/start-round')
  // async startRoundGame(
  //   @Param('code') code: string,
  //   @Req() request: any,
  //   @Body() body: Game_PlayersStartRoundRequest,
  // ): Promise<any> {
  //   return await this.startRound(code, { ...body });
  // }

  // async startRound(
  //   id: string,
  //   params: Game_PlayersStartRoundRequest
  // ): Promise<any> {
  //   return await this.gameService.startRound(id, params.playerId);
  // }





  @ApiOperation({ summary: 'Check Valid Game Code' })
  @Get(':code/check-valid-game-code')
  async checkValidGameCode(
    @Param('code') code: string,
  ): Promise<any> {
    console.log('code', code)
    return await this.gameService.gameCodeCheck(code);
  }

  async gameCodeCheck(code: string): Promise<any> {
    return await this.gameService.gameCodeCheck(code);
  }
}
