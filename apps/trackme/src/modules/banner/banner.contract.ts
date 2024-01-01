import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsEnum,
    IsNumber,
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';

export abstract class BannerApiContract {
    abstract findAll(params: BannerFindAllRequest): Promise<BannerFindAllResponse>
    abstract findOne(bannerId: string): Promise<BannerFindOneResponse>
    abstract create(
        params: BannerCreateRequest,
        file: Express.Multer.File,
        req: { user: { userId: string; userType: string } },
    ): Promise<BannerCreateResponse>;
    abstract update(
        bannerId: string,
        params: BannerUpdateRequest,
        req: { user: { userId: string; userType: string } },
        file?: Express.Multer.File,
    ): Promise<BannerUpdateResponse>;
    abstract delete(bannerId: string): Promise<BannerDeleteResponse>;
}

export class BannerFindAllRequest {
    @IsOptional()
    readonly isPublished?: boolean;

    @IsOptional()
    @IsNumber()
    readonly offset?: number;

    @IsOptional()
    @IsString()
    readonly search?: string;

    @IsOptional()
    @IsNumber()
    readonly limit?: number;
}

export class BannerFindAllResponse {
    readonly count: number;
    readonly prev: string;
    readonly next: string;
    readonly results: BannerFindOneResponse[];
}



export class BannerFindOneRequest {
    @IsNotEmpty()
    @IsString()
    @IsUUID(4)
    readonly bannerId: string;
}

export class BannerFindOneResponse {
    bannerId: string;
    bannerType?: string;
    bannerImageUrl?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    createdByUserId: string;
    metaCreatedByUser: UserMetadata;
    relatedContentType?: string;
    relatedContentId?: string;
    relatedContentUrl?: string;
    isPublished: boolean;
    order: number;
    updatedAt: Date;
    createdAt: Date;
}

export class BannerCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly subtitle: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly createdByUserId: string;

  @ApiProperty()
  @IsOptional()
  readonly bannerType: string;

  @ApiProperty()
  @IsOptional()
  readonly content?: string;

  @ApiProperty()
  @IsOptional()
  readonly relatedContentId?: string;

  @ApiProperty()
  @IsOptional()
  readonly relatedContentType?: string;

  @ApiProperty()
  @IsOptional()
  readonly relatedContentUrl?: string;

  // @ApiProperty()
  // readonly bannerImageUrl?: string;
  // file?: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  file?: Express.Multer.File;


  @ApiProperty()
  metaCreatedByUser: UserMetadata;

  @IsOptional()
  readonly isPublished?: boolean;
}

export class BannerCreateResponse extends BannerFindOneResponse { }

export class BannerUpdateRequest extends BannerCreateRequest {
    readonly bannerId: string;
    readonly bannerImageUrl?: string;
}

export class BannerUpdateImageRequest {
    readonly bannerId: string;
    readonly bannerImageUrl?: string;
}

export class BannerUpdateResponse extends BannerFindOneResponse {}

export class BannerDeleteResponse {
  results: {
    bannerId: string;
    isSuccess: boolean;
  };
}

export class GetBannerRequest {
  readonly status?: string;
  readonly offset?: number;
  readonly limit?: number;
}

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
  readonly bannerId: string;
  readonly file: Express.Multer.File;
}

export type UserMetadata = {
  userId: string;
  userType: string;
  name: string;
};

export class BannersUpdateQueue {
  @ApiProperty({ example: [{ howitworksId: '', queueOrder: 1 }] })
  readonly bulk: OrderItem[];
}

export type OrderItem = {
  bannerId: string;
  order: number;
};

