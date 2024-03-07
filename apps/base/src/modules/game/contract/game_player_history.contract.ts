import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class Game_PlayersHistoriesApiContract {
    abstract findAll(params: Game_PlayersHistoriesFindAllRequest): Promise<Game_PlayersHistoriesFindAllResponse>;
    abstract findOne(params: Game_PlayersHistoriesFindOneRequest): Promise<Game_PlayersHistoriesListItem>;
}

export interface Game_PlayersHistoriesListItem {
    id: string;
    gameId: string;
    playerId: string;
    gameplay: number;
    rewardClaimedAt: Date;
    rewardClaimed_AllRounds: number[];
    totalRewardClaimed: number;
    createdAt: Date;
    updatedAt: Date;
  }


  
export class Game_PlayersHistoriesFindAllRequest {

    @ApiPropertyOptional()
    search?: string;
  
    @ApiPropertyOptional()
    limit?: number;
  
    @ApiPropertyOptional()
    offset?: number;

    @ApiPropertyOptional()
    order?: string;

    @ApiPropertyOptional()
    id: number;

    @ApiPropertyOptional()
    gameId: string;

    @ApiPropertyOptional()
    playerId: string;

    @ApiPropertyOptional()
    gameplay: number;

    @ApiPropertyOptional()
    rewardClaimedAt: Date;

    @ApiPropertyOptional()
    rewardClaimed_AllRounds: number[];

    @ApiPropertyOptional()
    totalRewardClaimed: number;

    @ApiPropertyOptional()
    createdAt: Date;

    @ApiPropertyOptional()
    updatedAt: Date;
}

export class Game_PlayersHistoriesFindAllResponse {
    
    @ApiProperty()
    count: number;
    
    @ApiProperty()
    prev: string | null;
  
    @ApiProperty()
    next: string | null;
  
    @ApiProperty({example: []})
    results: Game_PlayersHistoriesListItem[];

}

export class Game_PlayersHistoriesFindOneRequest {
    @IsNotEmpty()
    @ApiProperty()
    readonly id: string;
}
