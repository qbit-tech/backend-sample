import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { UserAddressModel } from './userAddress.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectModel(UserAddressModel)
    private readonly userAddressRepositories: typeof UserAddressModel,
  ) {}

  async findAll(params: {
    offset?: number;
    limit?: number;
    search?: string;
    userId?: string;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: UserAddressModel[];
  }> {
    try {
      Logger.log('--ENTER FIND ALL USER ADDRESS, USER ADDRESS SERVICE--');
      console.info('params userAddresss', params);
      let where = {};

      if (params.search) {
        where = {
          ...where,
          label: {
            [Op.iLike]: `%${params.search}%`,
          },
        };
      }

      if (params.userId) {
        where = {
          ...where,
          userId: params.userId,
        };
      }

      const options: any = {
        where,
      };

      const count = await this.userAddressRepositories.count(options); //ngitung total data
      const results = await this.userAddressRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'DESC']],
      });

      Logger.log(
        `file exist: ` + JSON.stringify(results),
        'userAddress.service',
      );

      return {
        ...generateResultPagination(count, params),
        results: results.map(row => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll userAddress::: error: ' + JSON.stringify(error),
        'userAddress.service',
        'userAddress.service',
      );
      return Promise.reject(error);
    }
  }

  async findOne(addressId: string): Promise<UserAddressModel> {
    try {
      Logger.log('--ENTER FIND ONE USER ADDRESS, USER ADDRESS SERVICE--');
      const result = await this.userAddressRepositories.findOne({
        where: { addressId },
      });

      Logger.log(
        `file exist: ` + JSON.stringify(result),
        'userAddress.service',
      );

      if (result) {
        return result.get();
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(
        'findOne userAddress::: error: ' + JSON.stringify(error),
        'userAddress.service',
        'userAddress.service',
      );
      return Promise.reject(error);
    }
  }

  async create(params: Partial<UserAddressModel>): Promise<UserAddressModel> {
    try {
      Logger.log('--ENTER CREATE USER ADDRESS, USER ADDRESS SERVICE--');
      const userAddresssResults = await this.userAddressRepositories.create({
        ...params,
        addressId: uuidv4(),
      });

      Logger.log(
        `file created: ` + JSON.stringify(userAddresssResults),
        'userAddress.service',
      );
      return this.findOne(userAddresssResults.addressId);
    } catch (error) {
      Logger.error(
        'create userAddress::: error: ' + JSON.stringify(error),
        'userAddress.service',
        'userAddress.service',
      );
      return Promise.reject(error);
    }
  }

  async update(params: Partial<UserAddressModel>): Promise<UserAddressModel> {
    try {
      Logger.log('--ENTER UPDATE USER ADDRESS, USER ADDRESS SERVICE--');
      const result = await this.userAddressRepositories.update(
        {
          ...params,
        },
        {
          where: {
            addressId: params.addressId,
          },
          returning: true,
        },
      );

      Logger.log(
        `file updated: ` + JSON.stringify(result),
        'userAddress.service',
      );

      const userAddressRes = await this.findOne(params.addressId);

      return await this.findOne(userAddressRes.addressId);
    } catch (error) {
      Logger.error(
        'update userAddress::: error: ' + JSON.stringify(error),
        'userAddress.service',
        'userAddress.service',
      );
      return Promise.reject(error);
    }
  }

  async delete(addressId: string, userId: string): Promise<{ isSuccess: true }> {
    try {
      Logger.log('--ENTER DELETE USER ADDRESS, USER ADDRESS SERVICE--');
      const userAddress = await this.findOne(addressId);
      if (!userAddress) {
        return Promise.reject({
          code: 'not_found',
          message: 'Address not found',
        });
      }

      const result = await this.userAddressRepositories.destroy({
        where: { addressId, userId },
      });

      Logger.log(
        `file deleted: ` + JSON.stringify(result),
        'userAddress.service',
      );

      return { isSuccess: true };
    } catch (error) {
      Logger.error(
        'delete userAddress::: error: ' + JSON.stringify(error),
        'userAddress.service',
        'userAddress.service',
      );
      return Promise.reject(error);
    }
  }

  async updateUserAddressImage(params: {
    addressId: string;
    imageLink?: string;
  }): Promise<UserAddressModel> {
    Logger.log('--ENTER UPDATE USER ADDRESS IMAGE, USER ADDRESS SERVICE--');
    const result = await this.userAddressRepositories.update(params, {
      where: { addressId: params.addressId },
    });

    Logger.log(
      `file updated: ` + JSON.stringify(result),
      'userAddress.service',
    );
    return this.findOne(params.addressId);
  }
}