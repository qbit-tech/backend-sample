import { Table, Model, PrimaryKey, Column, UpdatedAt, CreatedAt, DataType, Unique, AllowNull, BelongsToMany, BelongsTo, ForeignKey, AutoIncrement } from 'sequelize-typescript';
// import { EventModel, EventProperties } from '../event/event.entity';
// import { EventTagModel } from '../event/eventTag.entity';
import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger';
import { GameModel } from './game.entity';
import { UserModel } from '../../user/user.entity';

export class BaseGame_PlayerHistoriesProperties {

    @ApiProperty()
    id: number;

    @ApiProperty()
    gameId: string;

    @ApiProperty()
    playerId: string;

    @ApiProperty()
    gameplay: number;

    @ApiProperty()
    rewardClaimedAt: Date;

    @ApiProperty()
    rewardClaimed_AllRounds: number[];

    @ApiProperty()
    totalRewardClaimed: number;

    @ApiProperty()
    transferAt: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

}


@Table({
    tableName: 'game_player_histories',
    timestamps: true,
})
export class Game_PlayerHistoriesModel extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    // @Column
    // gameId: string;

    // @Column
    // playerId: string;

    @Column
    gameplay: number;

    @Column
    rewardClaimedAt: Date;

    @Column(DataType.ARRAY(DataType.INTEGER))
    rewardClaimed_AllRounds: number[];

    @Column
    totalRewardClaimed: number;

    @Column
    currentRound: number;

    @Column(DataType.JSON)
    roundHistories: any;

    @Column
    transferAt: Date;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @ForeignKey(() => GameModel)
    @Column
    gameId: string;

    @BelongsTo(() => GameModel, 'gameId')
    game: GameModel;

    @ForeignKey(() => UserModel)
    @Column
    playerId: string;

    @BelongsTo(() => UserModel, 'playerId')
    player: UserModel;
}




