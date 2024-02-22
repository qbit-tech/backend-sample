import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  AppRequest,
  DefaultFindAllRequest,
  PaginationResponse,
} from '@qbit-tech/libs-utils';

export abstract class MasterArticleTagsApiContract {
  abstract findAll(
    query: FindAllMasterArticleTagsRequest,
  ): Promise<FindAllMasterArticleTagsResponse>;
  abstract findOne(
    tagId: string,
  ): Promise<FindOneMasterArticleTagsResponse | SimpleResponse>;
  abstract create(
    body: CreateMasterArticleTagsRequest,
  ): Promise<FindOneMasterArticleTagsResponse>;
  abstract update(
    tagId: string,
    body: CreateMasterArticleTagsRequest,
  ): Promise<FindOneMasterArticleTagsResponse | SimpleResponse>;
  abstract remove(
    tagId: string,
  ): Promise<DeleteMasterArticleTagsResponse | SimpleResponse>;
}

export class FindAllMasterArticleTagsRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  startAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  endAt?: string;
}

export class FindAllMasterArticleTagsResponse extends PaginationResponse {
  @ApiProperty()
  results: FindOneMasterArticleTagsResponse[];
}

export class FindOneMasterArticleTagsResponse {
  readonly tagId: string;
  readonly name: string;
  readonly status: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class CreateMasterArticleTagsRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  status: string;
}

export class UpdateMasterArticleTagsRequest {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: string;
}

export class UpdateMasterArticleTagsResponse extends FindOneMasterArticleTagsResponse {}

export class DeleteMasterArticleTagsResponse {
  isSuccess: boolean;
}

export class SimpleResponse {
  code: number;
  message: string;
}
