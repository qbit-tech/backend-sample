import { Table, Model, PrimaryKey, Column, UpdatedAt, CreatedAt, DataType, Unique, AllowNull, BelongsToMany, BelongsTo, ForeignKey, AutoIncrement } from 'sequelize-typescript';
// import { EventModel, EventProperties } from '../event/event.entity';
// import { EventTagModel } from '../event/eventTag.entity';
import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger';
import { GameModel } from './game.entity';
import { UserModel } from '../../user/user.entity';

export class BaseGame_PlayersProperties {

    @ApiProperty()
    id: number;

    @ApiProperty()
    gameId: string;

    @ApiProperty()
    playerId: string;

    @ApiProperty()
    availableRewards: string;

}


@Table({
    tableName: 'game_players',
    timestamps: true,
})
export class Game_PlayersModel extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    // @Column
    // gameId: string;

    // @Column
    // playerId: string;

    // @Column
    // availableRewards: JSON;

    @Column
    maxGameplay: number;

    @Column(DataType.JSON)
    availableRewards: any;

    @UpdatedAt
    updatedAt: Date;

    @CreatedAt
    createdAt: Date;

    @ForeignKey(() => GameModel)
    @Column
    gameId: string;

    @ForeignKey(() => UserModel)
    @Column
    playerId: string;

    @BelongsTo(() => UserModel, 'playerId')
    player: UserModel;

    // @BelongsTo(() => GameModel, () => Game_PlayersModel)
    // game: GameModel;
}