import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { generateResultPagination } from 'libs/utils/generateResultPagination';
// import { v4 as uuidv4 } from 'uuid';
// import uuid from 'uuid';
import * as uuid from 'uuid';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { RoleCreateRequest } from './role.contract';
import { RoleModel, RoleProperties } from './role.entity';
import { UserModel } from 'apps/base/src/modules/user/user.entity';
import { UserRoleService } from 'apps/base/src/modules/user/userRole.service';
// import { UserRoleService } from '../user/userRole.service';
// import { UserModel } from '../user/user.entity';
// import { AppRequest } from '@comika/appContract/app.contract';

@Injectable()
export class RoleService {
  constructor(
    private readonly userRoleService: UserRoleService,
    @InjectModel(RoleModel)
    private readonly roleRepositories: typeof RoleModel,
  ) {}

  async findAll(params: { offset?: number; limit?: number }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: RoleProperties[];
  }> {
    try {
      Logger.log('--ENTER FIND ALL, ROLE SERVICE--');
      console.info('params', params);

      const options: any = {
        include: [
          {
            model: UserModel,
            as: 'users',
          },
        ],
        distinct: true,
        col: 'roleId',
      };

      const count = await this.roleRepositories.count({ ...options });
      const results = await this.roleRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'DESC']],
      });

      Logger.log('file found: ' + JSON.stringify(results), 'role.service');

      return {
        ...generateResultPagination(count, params),
        results: results.map((row) => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll role::: error: ' + JSON.stringify(error),
        'role.service',
        'role.service',
      );
      return Promise.reject(error);
    }
  }

  async findOne(roleId: string): Promise<RoleProperties> {
    try {
      Logger.log('--ENTER FIND ONE, ROLE SERVICE--');
      const result = await this.roleRepositories.findOne({
        where: { roleId },
        include: [
          {
            model: UserModel,
            as: 'users',
          },
        ],
      });

      Logger.log('file found: ' + JSON.stringify(result), 'role.service');

      return result.get();
    } catch (error) {
      Logger.error(
        'findOne role::: error: ' + JSON.stringify(error),
        'role.service',
        'role.service',
      );
      return Promise.reject(error);
    }
  }

  async create(params: RoleCreateRequest): Promise<RoleProperties> {
    try {
      Logger.log('--ENTER CREATE, ROLE SERVICE--');

      const result = await this.roleRepositories.create({
        // roleId: uuidv4(),
        roleId: uuid.v4(),
        roleName: params.roleName,
        roleDescription: params.roleDescription,
        status: params.status,
        permissions: params.permissions,
      });

      Logger.log('file created: ' + JSON.stringify(result), 'role.service');

      return this.findOne(result.roleId);
    } catch (error) {
      Logger.error(
        'create role::: error: ' + JSON.stringify(error),
        'role.service',
        'role.service',
      );
      return Promise.reject(error);
    }
  }

  async update(
    params: Omit<RoleProperties, 'createdAt' | 'updatedAt'>,
  ): Promise<RoleProperties> {
    try {
      Logger.log('--ENTER UPDATE, ROLE SERVICE--');
      const data: any = {
        roleName: params.roleName,
        roleDescription: params.roleDescription,
        status: params.status,
        permissions: params.permissions,
      };
      const result = await this.roleRepositories.update(data, {
        where: {
          roleId: params.roleId,
        },
        returning: true,
      });

      Logger.log(
        'file updated: ' + JSON.stringify(result),
        'contentArticle.service',
      );

      const roleResult = await this.findOne(params.roleId);

      return await this.findOne(roleResult.roleId);
    } catch (error) {
      Logger.error(
        'update role::: error: ' + JSON.stringify(error),
        'role.service',
        'role.service',
      );
      return Promise.reject(error);
    }
  }

  async delete(roleId: string): Promise<{ isSuccess: true }> {
    try {
      Logger.log('--ENTER DELETE, ROLE SERVICE--');
      const roleResult = await this.findOne(roleId);

      if (roleResult.users?.length > 0) {
        await this.userRoleService.deleteByRoleId(roleId);
      }

      const result = await this.roleRepositories.destroy({
        where: { roleId },
      });

      Logger.log('file deleted: ' + JSON.stringify(result), 'role.service');

      return { isSuccess: true };
    } catch (error) {
      Logger.error(
        'delete role::: error: ' + JSON.stringify(error),
        'role.service',
        'role.service',
      );
      return Promise.reject(error);
    }
  }
}
