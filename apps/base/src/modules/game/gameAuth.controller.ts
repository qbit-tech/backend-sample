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
    Game_LoginRequest,
    Game_LoginResponse,
} from './contract/game_players.contract';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
import { GameRoundStartRequest } from './contract/game.contract';

@ApiTags('Game Auth')
@Controller('game/auth')
export class GameAuthController {
    constructor(private readonly gameService: GameService) { }

    // @ApiOperation({ summary: 'Login Using Name And Phone' })
    // // @UseGuards(AuthPermissionGuardV2(['GAME.LIST', 'GAME.VIEW']))
    // @Post('login/:code')
    // async gameLogin(
    //     @Param('code') code: string,
    //     @Body() body: Game_LoginRequest
    //     ): Promise<Game_LoginResponse> {
    //         console.log('code', code)
    //   return this.gameService.gameLogin(code, { ...body })
    // }

    @ApiOperation({ summary: 'Round Claim Reward' })
    @Post('round-claim-reward/:code/:playerId')
    async roundClaimReward(
        @Param('code') code: string,
        @Param('playerId') playerId: string,
        @Body() body: GameRoundStartRequest
    ): Promise<any> {
        return this.gameService.roundClaimed(code, playerId)
    }

}
