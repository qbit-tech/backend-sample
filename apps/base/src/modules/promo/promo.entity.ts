import {
    AllowNull,
    Column,
    CreatedAt,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';
import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger';
import { UUID } from 'sequelize';

// export class PromoProperties {
//     @ApiProperty()
//     promoId: string;

//     @ApiProperty()
//     title: string;

//     @ApiPropertyOptional()
//     description?: string;

//     @ApiPropertyOptional()
//     image?: string;

//     @ApiProperty()
//     isPublish: Boolean;

//     @ApiProperty()
//     startedAt: Date;

//     @ApiProperty()
//     endedAt: Date;
// }

@Table({
    tableName: 'promos',
    timestamps: true,
})
export class PromoModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    promoId: string;

    @Column
    title: string;

    @Column
    description?: string;

    @Column
    image?: string;

    @Column
    isPublish: Boolean;

    @Column
    startedAt: Date;

    @Column
    endedAt: Date;

}