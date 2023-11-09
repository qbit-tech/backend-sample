import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { generateFullName } from '@qbit-tech/libs-utils';
import {
  Table,
  Column,
  PrimaryKey,
  UpdatedAt,
  CreatedAt,
  Model,
  DataType,
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
} from 'sequelize-typescript';
import { RoleProperties } from '@qbit-tech/libs-role';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class UserProperties {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  roleId?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  birthdate?: Date;

  @ApiPropertyOptional()
  gender?: Gender;

  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  address?: string;

  // @ApiPropertyOptional()
  // profilePic?: string;

  @ApiPropertyOptional()
  status?: string;

  @ApiPropertyOptional()
  updatedAt?: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  nickName?: string;

  @ApiPropertyOptional()
  role?: RoleProperties;
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserModel extends Model {
  @PrimaryKey
  @Column
  userId: string;

  @Column
  roleId?: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  phone: string;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  birthdate?: string;

  @AllowNull
  @Column({
    type: DataType.STRING,
  })
  gender?: Gender;

  @AllowNull
  @Column
  province?: string;

  @AllowNull
  @Column
  city?: string;

  @AllowNull
  @Column
  address?: string;

  // @AllowNull
  // @Column
  // profilePic?: string;

  @AllowNull
  @Column
  status?: string;

  @UpdatedAt
  updatedAt?: Date;

  @CreatedAt
  createdAt?: Date;

  @AllowNull
  @Column
  firstName?: string;

  @AllowNull
  @Column
  middleName?: string;

  @AllowNull
  @Column
  lastName?: string;

  @AllowNull
  @Column
  nickName?: string;

  @BeforeUpdate
  @BeforeCreate
  static makeUpperCase(instance: UserModel) {
    // this will be called when an instance is created or updated
    if (instance.firstName || instance.middleName || instance.lastName) {
      instance.name = generateFullName({
        firstName: instance.firstName,
        middleName: instance.middleName,
        lastName: instance.lastName,
      });
    }
  }
}
