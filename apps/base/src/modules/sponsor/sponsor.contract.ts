import { IsOptional, IsNotEmpty } from 'class-validator';
// import { AppRequest } from '@comika/appContract/app.contract';
// import { PaginationResponse, DefaultFindAllRequest, SimpleResponse } from '@comika/appContract/app.contract';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { extensions } from 'sequelize/types/utils/validator-extras';

export abstract class SponsorApiContract {
  abstract findAll(params: SponsorFindAllRequest): Promise<SponsorFindAllResponse>
  abstract findOne(sponsorId: string): Promise<SponsorFindOneResponse>
  // abstract create(req: AppRequest, params: TagCreateRequest): Promise<TagFindOneResponse>
  abstract create(
    req: any, 
    params: SponsorCreateRequest,
    file: Express.Multer.File,
  ): Promise<SponsorFindOneResponse>
  abstract uploadSponsorImage(
    sponsorId: string, 
    file: Express.Multer.File
  ): Promise<SponsorFindOneResponse>
  abstract update(
    // req: AppRequest, 
    sponsorId: string,
    params: SponsorUpdateRequest,
    file: Express.Multer.File,
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
  readonly sponsorUrl: string;

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
  
  @ApiPropertyOptional()
  readonly sponsorUrl: string;
}

export class SponsorUpdateImageRequest {
  readonly sponsorId: string;
  readonly sponsorImageUrl?: string;
}

export class CreateResponseBulk {
  @ApiProperty()
  readonly results: string[]
}

export class SponsorUpdateRequest extends SponsorCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly sponsorId: string;
  readonly sponsorImageUrl: string;
}

export class SponsorUpdateResponse extends SponsorFindOneResponse {}

export class UpdateImageResponse {
  readonly isSuccess: boolean;
  readonly payload: {
    tableName: string;
    tableId: string;
    filePath: string;
    metadata?: object;
    fileLinkCache?: string;
  };
}

export class UpdateImageRequest {
  readonly sponsorId: string;
  readonly file: Express.Multer.File;
}
