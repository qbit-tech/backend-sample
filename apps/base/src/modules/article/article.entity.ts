import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Table,
    Column,
    PrimaryKey,
    UpdatedAt,
    CreatedAt,
    Model,
    DataType,
    AllowNull,
    BeforeCreate,
    BeforeUpdate,
} from 'sequelize-typescript';

export class ArticleProperties {
    @ApiProperty()
    articleId?: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    author: string;

    @ApiProperty()
    category: string;

    @ApiPropertyOptional()
    thumbnail?: string;

    @ApiPropertyOptional()
    updatedAt?: Date;

    @ApiPropertyOptional()
    createdAt?: Date;
}

@Table({
    tableName: 'articles',
    timestamps: true,
})
export class ArticleModel extends Model {
    @PrimaryKey
    @Column
    articleId: string;

    @Column
    title: string;

    @Column
    content: string;

    @Column
    author: string;

    @Column
    category: string;

    @AllowNull
    @Column
    thumbnail?: string;

    @UpdatedAt
    updatedAt?: Date;

    @CreatedAt
    createdAt?: Date;
}