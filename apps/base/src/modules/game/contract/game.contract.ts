import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class GameApiContract {
    abstract findAll(params: GameFindAllRequest): Promise<GameFindAllResponse>;
    abstract findOne(params: GameFindOneRequest): Promise<GameListItem>;
    abstract create(params: GameCreateRequest): Promise<GameCreateResponse>;
    abstract update(params: GameUpdateRequest, id: string): Promise<GameUpdateResponse>;
    abstract delete(id: string): Promise<GameDeleteResponse>;
}

export interface GameListItem {
    id: string;
    game_code: string;
    title: string;
    description: string;
    status: string;
  }

export class GameFindAllRequest {

    @ApiPropertyOptional()
    keyword?: string;
  
    @ApiPropertyOptional()
    limit?: number;
  
    @ApiPropertyOptional()
    offset?: number;

    @ApiPropertyOptional()
    order?: string;

    @ApiPropertyOptional()
    game_code?: string;

    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()
    status?: string;

}

export class GameFindAllResponse {
    
    @ApiProperty()
    count: number;
    
    @ApiProperty()
    prev: string | null;
  
    @ApiProperty()
    next: string | null;
  
    @ApiProperty({example: []})
    results: GameListItem[];

}

export class GameFindOneRequest {
    @IsNotEmpty()
    @ApiProperty()
    readonly id: string;
}

export class GameCreateRequest {
  
    @IsNotEmpty()
    @ApiProperty()
    readonly title: string;
  
    @IsOptional()
    @ApiProperty()
    readonly description: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly max_gameplay_per_user: number;

    @IsNotEmpty()
    @ApiProperty()
    readonly min_reward_per_gameplay_per_user: number;

    @IsNotEmpty()
    @ApiProperty()
    readonly max_reward_per_gameplay_per_user: number;

    @IsNotEmpty()
    @ApiProperty()
    readonly max_round_per_gameplay_per_user: number;

    @IsOptional()
    @ApiProperty()
    readonly expired_at: Date;

    @IsNotEmpty()
    @ApiProperty()
    readonly status: string;
}

export class GameCreateResponse {

    @ApiProperty()
    readonly isSuccess: boolean;

    @ApiProperty()
    readonly id: string;
  
    @ApiProperty()
    readonly game_code: string;
  
    @ApiProperty()
    readonly title: string;
  
    @ApiProperty()
    readonly description: string;
  
    @ApiProperty()
    readonly status: string;
}

export class GameUpdateRequest {
    @IsOptional()
    @ApiProperty()
    readonly id: string;

    @IsOptional()
    @ApiProperty()
    readonly game_code: string;
  
    @IsOptional()
    @ApiProperty()
    readonly title: string;
  
    @IsOptional()
    @ApiProperty()
    readonly description: string;

    @IsOptional()
    @ApiProperty()
    readonly max_gameplay_per_user: number;

    @IsOptional()
    @ApiProperty()
    readonly min_reward_per_gameplay_per_user: number;

    @IsOptional()
    @ApiProperty()
    readonly max_reward_per_gameplay_per_user: number;

    @IsOptional()
    @ApiProperty()
    readonly max_round_per_gameplay_per_user: number;

    @IsOptional()
    @ApiProperty()
    readonly expired_at: Date;

    @IsOptional()
    @ApiProperty()
    readonly status: string;
}

export class GameUpdateResponse {

    @ApiProperty()
    readonly isSuccess: boolean;

    @ApiProperty()
    readonly id: string;

}

export class GameDeleteRequest {
    @IsNotEmpty()
    @ApiProperty()
    readonly id: string;
}

export class GameDeleteResponse {

    @ApiProperty()
    readonly isSuccess: boolean;

    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly game_code: string;

    @ApiProperty()
    readonly title: string;
}

