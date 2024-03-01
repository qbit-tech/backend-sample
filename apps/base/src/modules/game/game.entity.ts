import { Table, Model, PrimaryKey, Column, UpdatedAt, CreatedAt, DataType, Unique, AllowNull, BelongsToMany } from 'sequelize-typescript';
// import { EventModel, EventProperties } from '../event/event.entity';
// import { EventTagModel } from '../event/eventTag.entity';
import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger';

// id: {
//     type: Sequelize.UUID,
//     defaultValue: Sequelize.UUIDV4,
//     allowNull: false,
//     primaryKey: true,
//   },

//   game_code: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },

//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   description: {
//     type: Sequelize.TEXT,
//     allowNull: true,
//   },

//   max_gameplay_per_user: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },

//   min_reward_per_gameplay_per_user: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },

//   max_reward_per_gameplay_per_user: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },

//   max_round_per_gameplay_per_user: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },

//   expired_at: {
//     type: Sequelize.DATE,
//     allowNull: true,
//   },

//   status: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   updatedAt: {
//     type: Sequelize.DATE
//   },

//   createdAt: {
//     type: Sequelize.DATE
//   }

export class BaseGameProperties {
    @ApiProperty()
    id: string;

    @ApiProperty()
    game_code: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    max_gameplay_per_user: number;

    @ApiProperty()
    min_reward_per_gameplay_per_user: number;

    @ApiProperty()
    max_reward_per_gameplay_per_user: number;

    @ApiProperty()
    max_round_per_gameplay_per_user: number;

    @ApiProperty()
    expired_at: Date;

    @ApiProperty()
    status: string;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    createdAt: Date;
}

export class GameProperties extends BaseGameProperties {
}


@Table({
    tableName: 'games',
    timestamps: true,
})
export class GameModel extends Model {
    @PrimaryKey
    @Column
    id: string;

    @Unique
    @Column
    game_code: string;

    @Column
    title: string;

    @Column({
        type: DataType.TEXT
    })
    description: string;

    @Column
    max_gameplay_per_user: number;

    @Column
    min_reward_per_gameplay_per_user: number;

    @Column
    max_reward_per_gameplay_per_user: number;

    @Column
    max_round_per_gameplay_per_user: number;

    @Column
    expired_at: Date;

    @Column
    status: string;

    @UpdatedAt
    updatedAt: Date;

    @CreatedAt
    createdAt: Date;
}