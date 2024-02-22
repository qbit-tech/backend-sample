import { IsOptional, IsNumber, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AppRequest } from "@qbit-tech/libs-utils";

export class DefaultFindAllRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly offset: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly limit: number;
}

export class DefaultFindAllResponse {
  @ApiProperty()
  readonly count: number;

  @ApiProperty()
  readonly prev: string;

  @ApiProperty()
  readonly next: string;
}

export abstract class RoleApiContract {
  abstract findAll(params: RoleFindAllRequest): Promise<RoleFindAllResponse>;
  abstract findOne(roleId: string): Promise<RoleFindOneResponse>;
  abstract create(req: AppRequest, data: RoleCreateRequest, files: any[]): Promise<RoleCreateResponse>;
  abstract update(req: AppRequest, RoleId: string, data: RoleUpdateRequest, files: any[]): Promise<RoleUpdateResponse>;
  abstract delete(req: AppRequest, roleId: string): Promise<RoleDeleteResponse>;
}

export class RoleFindAllRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: string;
}

export class RoleFindOneResponse {
  @ApiProperty()
  readonly roleId: string;

  @ApiProperty()
  readonly roleName: string;

  @ApiPropertyOptional()
  readonly roleDescription?: string;

  //   @ApiProperty({ example: DEFAULT_PERMISSION_FULL_ACCESS })
  @ApiProperty()
  readonly permissions: any;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}

export class RoleFindAllResponse extends DefaultFindAllResponse {
  @ApiProperty({ type: () => [RoleFindOneResponse] })
  results: RoleFindOneResponse[];
}

export class RoleFindOneRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  readonly roleId: string;
}

export class RoleCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional()
  roleDescription?: string;

  @ApiProperty()
  @IsNotEmpty()
  permissions: string;

  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  isDeleted: boolean;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;
}

export class RoleCreateResponse extends RoleFindOneResponse {}

export class RoleUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional()
  roleDescription?: string;

  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  isDeleted: boolean;

  @ApiPropertyOptional()
  @IsNotEmpty()
  permissions: { [key: string]: any };
}

export class RoleUpdateResponse extends RoleFindOneResponse {}

export class RoleDeleteResponse {
  isSuccess: true;
}
