import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleProperties } from '@qbit-tech/libs-role';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { EInitConfigType } from './initData';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class InitDataRequest {
  @ApiPropertyOptional({ enum: EInitConfigType, example: EInitConfigType.REPLACE_ALL_BUT_KEEP_NEW_DATA })
  type?: EInitConfigType;
}

export class InitDataSuperAdminRequest {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiPropertyOptional({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
  })
  gender: Gender;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  birthdate?: Date;

  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  address?: string;

  // @ApiPropertyOptional({
  //   enum: ERoles,
  //   example: ERoles.admin,
  // })
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  nickName?: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  password?: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  platform?: string;

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
