import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  AppRequest,
  DefaultFindAllRequest,
  PaginationResponse,
} from '@qbit-tech/libs-utils';

export abstract class ArticlesApiContract {
  abstract findAll(
    query: FindAllArticlesRequest,
  ): Promise<FindAllArticlesResponse>;
  abstract findOne(
    articleId: string,
  ): Promise<FindOneArticlesResponse | SimpleResponse>;
  abstract create(
    body: CreateArticlesRequest,
    req: AppRequest,
  ): Promise<FindOneArticlesResponse>;
  abstract update(
    articleId: string,
    body: CreateArticlesRequest,
  ): Promise<FindOneArticlesResponse | SimpleResponse>;
  abstract remove(
    articleId: string,
  ): Promise<DeleteArticlesResponse | SimpleResponse>;
}

export class FindAllArticlesRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  startAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  multipleCategory?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  endAt?: string;
}

export class FindAllArticlesResponse extends PaginationResponse {
  @ApiProperty()
  results: FindOneArticlesResponse[];
}

export class FindOneArticlesResponse {
  readonly articleId: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly slug: string;
  readonly titleEn?: string;
  readonly subtitleEn?: string;
  readonly slugEn?: string;
  readonly categoryId: string;
  readonly body: string;
  readonly bodyEn?: string;
  readonly status: string;
  readonly createdByUserId: string;
  readonly isHighlight: boolean;
  readonly metaCreatedByUser: string;
  readonly publicationAt: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class CreateArticlesRequest {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  subtitleEn?: string;

  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  tagIds?: string[];

  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  bodyEn?: string;

  @ApiProperty()
  @IsNotEmpty()
  createdByUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  isHighlight: boolean;

  @ApiProperty()
  @IsNotEmpty()
  metaCreatedByUser: string;
}

export class UpdateArticlesRequest {
  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  subtitleEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  tagIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  bodyEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isHighlight?: boolean;
}

export class UpdateArticlesResponse extends FindOneArticlesResponse {}

export class DeleteArticlesResponse {
  isSuccess: boolean;
}

export class SimpleResponse {
  code: number;
  message: string;
}