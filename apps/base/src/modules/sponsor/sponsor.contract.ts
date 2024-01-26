import { IsOptional, IsNotEmpty } from 'class-validator';
// import { AppRequest } from '@comika/appContract/app.contract';
// import { PaginationResponse, DefaultFindAllRequest, SimpleResponse } from '@comika/appContract/app.contract';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class SponsorApiContract {
  abstract findAll(params: SponsorFindAllRequest): Promise<SponsorFindAllResponse>
  abstract findOne(sponsorId: string): Promise<SponsorFindOneResponse>
  // abstract create(req: AppRequest, params: TagCreateRequest): Promise<TagFindOneResponse>
  abstract create(req: any, params: SponsorCreateRequest): Promise<SponsorFindOneResponse>
  abstract update(
    // req: AppRequest, 
    tagId: string,
    params: SponsorUpdateRequest
  ): Promise<SponsorFindOneResponse>
  // abstract delete(req: AppRequest, tagId: string): Promise<SimpleResponse>
  abstract delete(sponsorId: string): Promise<any>
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

export class SponsorFindAllRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional()
    @IsOptional()
    readonly search?: string;
}


export class SponsorFindOneResponse {
  @ApiProperty()
  readonly sponsorId?: string;

  @ApiProperty()
  readonly sponsorName: string;

  @ApiProperty()
  readonly imgUrl: string;

  @ApiProperty()
  readonly updatedAt?: Date;

  @ApiProperty()
  readonly createdAt?: Date;
}

export class SponsorFindAllResponse extends PaginationResponse {
  @ApiProperty({type: [SponsorFindOneResponse]})
  readonly results: SponsorFindOneResponse[]
}

export class SponsorCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly sponsorName: string;
  
  @ApiProperty()
  readonly status: string;
  
  @ApiPropertyOptional()
  readonly imgUrl: string;
}

export class CreateResponseBulk {
  @ApiProperty()
  readonly results: string[]
}

export class SponsorUpdateRequest extends SponsorCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly sponsorId: string;
}
