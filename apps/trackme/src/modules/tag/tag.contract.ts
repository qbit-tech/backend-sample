import { IsOptional, IsNotEmpty } from 'class-validator';
// import { AppRequest } from '@comika/appContract/app.contract';
// import { PaginationResponse, DefaultFindAllRequest, SimpleResponse } from '@comika/appContract/app.contract';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class TagApiContract {
  abstract findAll(params: TagFindAllRequest): Promise<TagFindAllResponse>
  abstract findOne(tagId: string): Promise<TagFindOneResponse>
  // abstract create(req: AppRequest, params: TagCreateRequest): Promise<TagFindOneResponse>
  abstract create(req: any, params: TagCreateRequest): Promise<TagFindOneResponse>
  abstract update(
    // req: AppRequest, 
    tagId: string,
    params: TagUpdateRequest
  ): Promise<TagFindOneResponse>
  // abstract delete(req: AppRequest, tagId: string): Promise<SimpleResponse>
  abstract delete(tagId: string): Promise<any>
}

export class DefaultFindAllRequest {
  @ApiPropertyOptional()
  search?: string;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  offset?: number;
}

export class PaginationResponse {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  prev: string | null;

  @ApiProperty()
  next: string | null;

  @ApiProperty({example: []})
  results: any[];
}

export class TagFindAllRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional()
    @IsOptional()
    readonly search?: string;
}


export class TagFindOneResponse {
  @ApiProperty()
  readonly tagId?: string;

  @ApiProperty()
  readonly tagName: string;

  @ApiProperty()
  readonly description?: string;

  @ApiProperty()
  readonly updatedAt?: Date;

  @ApiProperty()
  readonly createdAt?: Date;
}

export class TagFindAllResponse extends PaginationResponse {
  @ApiProperty({type: [TagFindOneResponse]})
  readonly results: TagFindOneResponse[]
}

export class TagCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly tagName: string;
  
  @ApiProperty()
  readonly status: string;
  
  @ApiPropertyOptional()
  readonly description?: string;
}

export class CreateResponseBulk {
  @ApiProperty()
  readonly results: string[]
}

export class TagUpdateRequest extends TagCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly tagId: string;
}
