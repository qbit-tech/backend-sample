import { IsOptional, IsNotEmpty } from 'class-validator';
import {
    AppRequest,
    DefaultFindAllRequest,
    PaginationResponse,
} from '@qbit-tech/libs-utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleProperties, ArticleModel } from './article.entity';

export abstract class ArticleApiContract {
    abstract findAll(params: ArticleFindAllRequest): Promise<ArticleFindAllResponse>
    abstract findOne(articleId: string): Promise<ArticleFindOneResponse>
    abstract create(req: any, params: ArticleCreateRequest): Promise<ArticleFindOneResponse>
    abstract update(
        articleId: string,
        params: ArticleUpdateRequest
    ): Promise<ArticleFindOneResponse>
    abstract delete(articleId: string): Promise<any>
}

export class ArticleFindAllRequest extends DefaultFindAllRequest {
    @ApiPropertyOptional()
    @IsOptional
    readonly search?: string;
}

export class ArticleFindAllResponse extends PaginationResponse {
    @ApiProperty({ type: [ArticleProperties] })
    readonly results: ArticleModel[];
}

export class ArticleFindOneResponse {
    @ApiProperty()
    readonly articleId: string;

    @IsNotEmpty
    @ApiProperty()
    readonly title: string;

    @IsNotEmpty
    @ApiProperty()
    readonly content: string;

    @IsNotEmpty
    @ApiProperty()
    readonly author: string;

    @IsNotEmpty
    @ApiProperty()
    readonly category: string;

    @ApiPropertyOptional()
    readonly thumbnail?: string;

    @ApiPropertyOptional()
    readonly updatedAt?: Date;

    @ApiPropertyOptional()
    readonly createdAt?: Date;
}

export class UpdateThumbnailRequest {
    @IsNotEmpty()
    @ApiProperty()
    readonly articleId: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly file: Express.Multer.File;
}

export class UpdateThumbnailResponse {
    @ApiProperty()
    readonly isSuccess?: boolean;
}

export class ArticleCreateRequest {
    @IsNotEmpty
    @ApiProperty()
    readonly articleId: string;

    @IsNotEmpty
    @ApiProperty()
    readonly title: string;

    @IsNotEmpty
    @ApiProperty()
    readonly content: string;

    @IsNotEmpty
    @ApiProperty()
    readonly author: string;

    @IsNotEmpty
    @ApiProperty()
    readonly category: string;

    @ApiPropertyOptional()
    readonly thumbnail?: string;

    @ApiPropertyOptional()
    readonly updatedAt?: Date;

    @ApiPropertyOptional()
    readonly createdAt?: Date;
}

export class ArticleCreateResponse {
    @ApiProperty()
    readonly results: string[]
}

export class ArticleUpdateRequest extends ArticleCreateRequest {
    @IsNotEmpty
    @ApiProperty()
    readonly articleId: string;
}