import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  UpdatedAt,
  CreatedAt,
  HasMany,
  BelongsToMany,
  DataType,
  AllowNull
} from 'sequelize-typescript';

export class BaseRoleProperties {
    @ApiProperty()
    roleId: string;

    @ApiProperty()
    roleName: string;

    @ApiPropertyOptional()
    roleDescription?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    permissions: any;

    @ApiPropertyOptional()
    createdAt: Date;
    
    @ApiPropertyOptional()
    updatedAt: Date;
}

export class RoleProperties extends BaseRoleProperties {
    @ApiPropertyOptional()
    users?: any[];
}

@Table({
    tableName: 'roles'
})
export class RoleModel extends Model{
    @PrimaryKey
    @Column
    roleId: string;

    @Column
    roleName: string;

    @AllowNull
    @Column
    roleDescription?: string;

    @AllowNull
    @Column({ type: DataType.JSONB})
    permissions: any;

    @Column
    isActive: boolean;

    @Column
    isDeleted: boolean;
    
    @Column
    createdAt: Date;

    @Column
    updatedAt: Date;
}