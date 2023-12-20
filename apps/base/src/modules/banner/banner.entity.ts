import { Table, Model, PrimaryKey, Column, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger';
import { UserMetadata } from './banner.contract';

// @Table({
//   tableName: 'banners',
//   timestamps: true
// })

export class BaseBannerProperties {
    @ApiProperty()
    bannerId?: string;

    @ApiProperty()
    bannerType: string;

    @ApiProperty()
    bannerImageUrl: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    subtitle: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class BannerProperties extends BaseBannerProperties {
}

export class BannerModel extends Model {
    @PrimaryKey
    @Column
    bannerId: string;

    @Column
    bannerType: string;

    @Column
    bannerImageUrl?: string;

    @Column
    title?: string;

    @Column
    subtitle?: string;

    @Column({
        type: DataType.TEXT
    })
    content?: string;

    @Column
    createdByUserId: string;

    @Column({
        type: DataType.JSONB
    })
    metaCreatedByUser: UserMetadata;

    @Column
    relatedContentType?: string;

    @Column
    relatedContentId?: string;

    @Column
    relatedContentUrl?: string;

    @Column
    isPublished: boolean;

    @Column({
        type: DataType.INTEGER
    })
    order: number;

    @UpdatedAt
    updatedAt: Date

    @CreatedAt
    createdAt: Date
}