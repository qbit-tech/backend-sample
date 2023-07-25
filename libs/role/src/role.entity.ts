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
import { UserModel, UserProperties } from 'apps/base/src/modules/user/user.entity';
import { UserRoleModel } from 'apps/base/src/modules/user/userRole.entity';
// import { FeaturePermissionType } from '../../featureAndPermission/featureAndPermission.type';

export class BaseRoleProperties {
    @ApiProperty()
    roleId: string;

    @ApiProperty()
    roleName: string;

    @ApiPropertyOptional()
    roleDescription?: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    permissions: any;

    @ApiPropertyOptional()
    createdAt: Date;
    
    @ApiPropertyOptional()
    updatedAt: Date;
}

export class RoleProperties extends BaseRoleProperties {
    @ApiPropertyOptional()
    users?: UserProperties[];
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
    status: string;
    
    @Column
    createdAt: Date;

    @Column
    updatedAt: Date;

    @BelongsToMany(() => UserModel, () => UserRoleModel)
    users: UserModel[];
}