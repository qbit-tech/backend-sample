import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { RoleModel } from 'libs/role/src/role.entity';
import { UserModel } from './user.entity';

export class UserRoleProperties{
    @ApiProperty()
    userId: string;

    @ApiProperty()
    roleId: string;

    @ApiPropertyOptional()
    createdAt: Date;
    
    @ApiPropertyOptional()
    updatedAt: Date;
}

@Table({
    tableName: 'user_roles'
})
export class UserRoleModel extends Model{
    @ForeignKey(() => UserModel)
    @Column
    userId: string;

    @ForeignKey(() => RoleModel)
    @Column
    roleId: string;

    @Column
    createdAt: Date;

    @Column
    updatedAt: Date;
}