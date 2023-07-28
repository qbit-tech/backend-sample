import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { v4 as uuidv4 } from 'uuid';
import { generateResultPagination } from 'libs/libs-utils/src/utils';
import { UserRoleModel, UserRoleProperties } from './userRole.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRoleModel)
    private readonly userRoleRepositories: typeof UserRoleModel,
  ) {}

  async findAll(params: {
    offset?: number;
    limit?: number;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: UserRoleProperties[];
  }> {
    try {
      Logger.log('--ENTER FIND ALL, USER ROLE SERVICE--');
      console.info('params userRole', params);

      const count = await this.userRoleRepositories.count();
      const results = await this.userRoleRepositories.findAll({
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'DESC']],
      });

      Logger.log('file found: ' + JSON.stringify(results), 'userRole.service');

      return {
        ...generateResultPagination(count, params),
        results: results.map(row => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }

  async findOne(userRoleId: string): Promise<UserRoleProperties> {
    try {
      Logger.log('--ENTER FIND ONE, UserROLE SERVICE--');
      const result = await this.userRoleRepositories.findOne({
        where: { userRoleId },
      });

      Logger.log('file found: ' + JSON.stringify(result), 'userRole.service');

      return result.get();
    } catch (error) {
      Logger.error(
        'findOne userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }

  async create(
    userId: string,
    roleIds: string[],
    isSuperAdmin?: boolean,
  ): Promise<UserRoleProperties[]> {
    try {
      Logger.log('--ENTER CREATE, USER ROLE SERVICE--');
      let data = [
        {
          userId: '',
          roleId: '',
        },
      ];
      
      if (roleIds.length > 0) {
        data = roleIds.map(role => ({
          userId,
          roleId: role,
        }));
      }

      const result = await this.userRoleRepositories.bulkCreate(data);

      Logger.log('file created: ' + JSON.stringify(result), 'userRole.service');

      return result.map(row => row.get());
    } catch (error) {
      Logger.error(
        'create userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }

  async update(
    userId: string,
    roleIds: string[],
  ): Promise<UserRoleProperties[]> {
    try {
      Logger.log('--ENTER UPDATE, USER ROLE SERVICE--');
      await this.deleteByUserId(userId);

      const result = await this.create(userId, roleIds);

      Logger.log('file updated: ' + JSON.stringify(result), 'userRole.service');

      return result;
    } catch (error) {
      Logger.error(
        'update userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }

  async delete(userRoleId: string): Promise<{ isSuccess: true }> {
    try {
      Logger.log('--ENTER DELETE, USER ROLE SERVICE--');

      const result = await this.userRoleRepositories.destroy({
        where: { userRoleId },
      });

      Logger.log('file deleted: ' + JSON.stringify(result), 'userRole.service');

      return { isSuccess: true };
    } catch (error) {
      Logger.error(
        'delete userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }

  async deleteByRoleId(
    roleId: string,
  ): Promise<{
    isSuccess: true;
  }> {
    try {
      Logger.log('--ENTER DELETE BY ROLE ID, USER ROLE SERVICE--');
      const result = await this.userRoleRepositories.destroy({
        where: { roleId },
      });

      Logger.log('file deleted: ' + JSON.stringify(result), 'userRole.service');
      return {
        isSuccess: true,
      };
    } catch (error) {
      Logger.error(
        'deleteByRoleId userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }

  async deleteByUserId(
    userId: string,
  ): Promise<{
    isSuccess: true;
  }> {
    try {
      Logger.log('--ENTER DELETE BY USER ID, USER ROLE SERVICE--');
      const result = await this.userRoleRepositories.destroy({
        where: { userId },
      });

      Logger.log('file deleted: ' + JSON.stringify(result), 'userRole.service');
      return {
        isSuccess: true,
      };
    } catch (error) {
      Logger.error(
        'deleteByUserId userRole::: error: ' + JSON.stringify(error),
        'userRole.service',
        'userRole.service',
      );
      return Promise.reject(error);
    }
  }
}
