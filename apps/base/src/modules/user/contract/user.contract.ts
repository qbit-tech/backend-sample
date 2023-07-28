import { IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import {
  AppRequest,
  DefaultFindAllRequest,
  PaginationResponse,
} from '@qbit-tech/libs-utils';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ERoles } from '../../../core/roles';
import { UserProperties, Gender, UserModel } from '../user.entity';
import { RoleProperties } from '@qbit-tech/libs-role';

export abstract class UserApiContract {
  abstract createUser(
    req: AppRequest,
    body: CreateUserRequest,
    file: any,
  ): Promise<UserProperties>;

  abstract findAll(params: UserFindAllRequest): Promise<UserFindAllResponse>;

  abstract update(request: UpdateRequest): Promise<UserProperties>;

  abstract checkUser(body: CheckUserRequest): Promise<{
    isEmailExist: boolean;
    isPhoneExist: boolean;
  }>;

  abstract getProfile(userId: string): Promise<UserProperties>;

  abstract delete(
    req: AppRequest,
    userId: string,
  ): Promise<{ isSuccess: boolean }>;
}

export class UserFindAllRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional({ example: 'active' })
  filterStatus?: string;

  @ApiPropertyOptional()
  filterCustomerCode?: string;
}

export class UserFindAllResponse extends PaginationResponse {
  @ApiProperty({ type: [UserProperties] })
  results: UserModel[];
}

export class UpdatePhotoRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly file: Express.Multer.File;
}

export class UpdatePhotoResponse {
  @ApiProperty()
  readonly isSuccess?: boolean;
}

export class CheckUserRequest {
  @ApiPropertyOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  readonly phone?: string;

  @ApiPropertyOptional({ example: '62' })
  phoneCountryCode?: string;
}
export class CreateUserRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @ApiPropertyOptional({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
  })
  readonly gender: Gender;

  @ApiPropertyOptional()
  readonly isSubscribed?: boolean;

  @ApiPropertyOptional()
  readonly phone?: string;

  @ApiPropertyOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  readonly birthdate?: Date;

  @ApiPropertyOptional()
  readonly province?: string;

  @ApiPropertyOptional()
  readonly city?: string;

  @ApiPropertyOptional()
  readonly address?: string;

  @ApiPropertyOptional({
    enum: ERoles,
    example: ERoles.admin,
  })
  @ApiPropertyOptional()
  readonly firstName?: string;

  @ApiPropertyOptional()
  readonly middleName?: string;

  @ApiPropertyOptional()
  readonly lastName?: string;

  @ApiPropertyOptional()
  readonly nickName?: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  readonly password?: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  readonly platform?: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  @IsArray()
  roles: Omit<RoleProperties, 'createdAt' | 'updatedAt'>[];

  // additional
  @ApiPropertyOptional()
  isEmailVerified?: boolean;

  @ApiPropertyOptional()
  isPhoneVerified?: boolean;
}

export class UpdateRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
  })
  readonly gender: Gender;
  @ApiPropertyOptional()
  readonly phone?: string;
  @ApiPropertyOptional()
  readonly username?: string;
  @ApiPropertyOptional()
  readonly isSubscribed?: boolean;
  @ApiPropertyOptional()
  readonly birthdate?: Date;
  @ApiPropertyOptional()
  readonly province?: string;
  @ApiPropertyOptional()
  readonly city?: string;
  @ApiPropertyOptional()
  readonly address?: string;
  @ApiPropertyOptional()
  readonly profilePic?: string;

  @ApiPropertyOptional({
    enum: ERoles,
    example: ERoles.admin,
  })
  @ApiPropertyOptional()
  readonly status?: 'active' | 'inactive';
}

export class UpdateUserRequest {
  @ApiPropertyOptional()
  readonly name: string;

  @ApiPropertyOptional({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
  })
  readonly gender: Gender;

  @ApiPropertyOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  readonly birthdate?: Date;
  @ApiPropertyOptional()
  readonly province?: string;
  @ApiPropertyOptional()
  readonly city?: string;
  @ApiPropertyOptional()
  readonly address?: string;

  @ApiPropertyOptional()
  readonly status?: 'active' | 'inactive';

  @ApiPropertyOptional()
  readonly firstName?: string;
  @ApiPropertyOptional()
  readonly middleName?: string;
  @ApiPropertyOptional()
  readonly lastName?: string;
  @ApiPropertyOptional()
  readonly nickName?: string;

  @ApiPropertyOptional()
  readonly roles: RoleProperties[];

  // additional
  @ApiPropertyOptional()
  isEmailVerified?: boolean;

  @ApiPropertyOptional()
  isPhoneVerified?: boolean;
}
