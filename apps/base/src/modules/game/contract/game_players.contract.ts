import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class Game_PlayersApiContract {
    abstract findAll(params: Game_PlayersFindAllRequest): Promise<Game_PlayersFindAllResponse>;
    abstract findOne(params: Game_PlayersFindOneRequest): Promise<Game_PlayersListItem>;
    abstract create(params: Game_PlayersCreateRequest): Promise<Game_PlayersCreateResponse>;
    abstract update(params: Game_PlayersUpdateRequest, id: string): Promise<Game_PlayersUpdateResponse>;
    abstract delete(id: string): Promise<Game_PlayersDeleteResponse>;
}

export interface Game_PlayersListItem {
    id: string;
    gameId: string;
    playerId: string;
    availableRewards: string;
}

export class Game_PlayersFindAllRequest {

    @ApiPropertyOptional()
    search?: string;

    @ApiPropertyOptional()
    limit?: number;

    @ApiPropertyOptional()
    offset?: number;

    @ApiPropertyOptional()
    order?: string;

    @ApiPropertyOptional()
    gameId?: string;

    @ApiPropertyOptional()
    playerId?: string;

    @ApiPropertyOptional()
    availableRewards?: string;

}

export class Game_PlayersFindAllResponse {

    @ApiProperty()
    count: number;

    @ApiProperty()
    prev: string | null;

    @ApiProperty()
    next: string | null;

    @ApiProperty({ example: [] })
    results: Game_PlayersListItem[];

}

export class Game_PlayersFindOneRequest {
    @IsNotEmpty()
    @ApiProperty()
    readonly id: string;
}

export class Game_PlayersCreateRequest {

    // @IsNotEmpty()
    // @ApiProperty()
    // readonly id: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly phone: string;


}

export class Game_ClaimRewardRequest {

    @IsNotEmpty()
    @ApiProperty()
    readonly playerId: string;

    @IsNotEmpty()
    @ApiProperty()
    // json
    readonly gameplay: object;

    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly phone: string;
}


export class Game_PlayersStartRoundRequest {

    @IsNotEmpty()
    @ApiProperty()
    readonly playerId: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly gameplay: number;

}

export class Game_PlayersCreateResponse {

    @ApiProperty()
    readonly isSuccess: boolean;

    @ApiProperty()
    readonly id: any;

    @ApiProperty()
    readonly message: any;

}

export class Game_PlayersUpdateRequest {
    @IsOptional()
    @ApiProperty()
    readonly id: string;

    @IsOptional()
    @ApiProperty()
    readonly gameId: string;

    @IsOptional()
    @ApiProperty()
    readonly playerId: string;

    @IsOptional()
    @ApiProperty()
    readonly availableRewards: object;

}

export class Game_PlayersUpdateResponse {

    @ApiProperty()
    readonly isSuccess: boolean;

    @ApiProperty()
    readonly id: string;

}

export class Game_PlayersDeleteRequest {
    @IsNotEmpty()
    @ApiProperty()
    readonly id: string;
}

export class Game_PlayersDeleteResponse {

    @ApiProperty()
    readonly isSuccess: boolean;

    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly gameId: string;

    @ApiProperty()
    readonly playerId: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly phone: string;
}


export class Game_LoginRequest {

    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly phone: string;

}

export class Game_LoginResponse {

    @ApiProperty()
    readonly code: string;

    @ApiProperty()
    readonly payload: object;

    @ApiProperty()
    readonly message: string;

}

