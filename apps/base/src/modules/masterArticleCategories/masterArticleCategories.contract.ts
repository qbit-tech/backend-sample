import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  AppRequest,
  DefaultFindAllRequest,
  PaginationResponse,
} from '@qbit-tech/libs-utils';

export abstract class MasterArticleCategoriesApiContract {
  abstract findAll(
    query: FindAllMasterArticleCategoriesRequest,
  ): Promise<FindAllMasterArticleCategoriesResponse>;
  abstract findOne(
    categoryId: string,
  ): Promise<FindOneMasterArticleCategoriesResponse | SimpleResponse>;
  abstract create(
    body: CreateMasterArticleCategoriesRequest,
  ): Promise<FindOneMasterArticleCategoriesResponse>;
  abstract update(
    categoryId: string,
    body: CreateMasterArticleCategoriesRequest,
  ): Promise<FindOneMasterArticleCategoriesResponse | SimpleResponse>;
  abstract remove(
    categoryId: string,
  ): Promise<DeleteMasterArticleCategoriesResponse | SimpleResponse>;
}

export class FindAllMasterArticleCategoriesRequest extends DefaultFindAllRequest {
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

export class FindAllMasterArticleCategoriesResponse extends PaginationResponse {
  @ApiProperty()
  results: FindOneMasterArticleCategoriesResponse[];
}

export class FindOneMasterArticleCategoriesResponse {
  readonly categoryId: string;
  readonly name: string;
  readonly status: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class CreateMasterArticleCategoriesRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  status: string;
}

export class UpdateMasterArticleCategoriesRequest {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: string;
}

export class UpdateMasterArticleCategoriesResponse extends FindOneMasterArticleCategoriesResponse {}

export class DeleteMasterArticleCategoriesResponse {
  isSuccess: boolean;
}

export class SimpleResponse {
  code: number;
  message: string;
}
