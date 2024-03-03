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
    rewardClaimedAt: Date;

    // rewardClaimedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: true,
    //   },
    //   rewardClaimed_AllRounds: {
    //     type: Sequelize.ARRAY(Sequelize.INTEGER),
    //     allowNull: true,
    //   },
    //   totalRewardClaimed: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // });

    @ApiProperty()
    rewardClaimed_AllRounds: number[];

    @ApiProperty()
    totalRewardClaimed: number;

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

    @Column
    gameId: string;

    @Column
    playerId: string;

    @Column
    rewardClaimedAt: Date;

    @Column(DataType.ARRAY(DataType.INTEGER))
    rewardClaimed_AllRounds: number[];

    @Column
    totalRewardClaimed: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}




