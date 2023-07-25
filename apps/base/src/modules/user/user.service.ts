import { Injectable, Logger } from '@nestjs/common';
import { UserModel, UserProperties } from './user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ulid } from 'ulid';
import { UserRoleService } from './userRole.service';
import { RoleModel, RoleProperties } from 'libs/role/src/role.entity';
import { 
  generateResultPagination, 
  cleanPhoneNumber, 
  generateFullName } from 'libs/libs-utils/src/utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRoleService: UserRoleService,
    @InjectModel(UserModel)
    private readonly userRepositories: typeof UserModel,
  ) {}

  async findAll(params: {
    offset?: number;
    limit?: number;
    search?: string;
    filterStatus?: string;
    filterGender?: string;
    filterCustomerCode?: string
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: any[];
  }> {
    try {
      this.logger.log('Find all user...');
      this.logger.log('Params: ' + JSON.stringify(params));

      let where = {};

      if (params.startDate && params.endDate) {
        where = {
          ...where,
            createdAt: {
              [Op.and]: {
                [Op.gte]: params.startDate,
                [Op.lte]: params.endDate,
              },
            },
        };
      }

      params.search &&
        (where = {
          ...where,
          [Op.or]: [
            { name: { [Op.iLike]: `%${params.search}%` } },
            { email: { [Op.iLike]: `%${params.search}%` } },
            { phone: { [Op.iLike]: `%${params.search}%` } },
            { username: params.search},
          ],
        });

      // if (
      //   params.hasOwnProperty('filterStatus') &&
      //   typeof params.filterStatus === 'boolean'
      // ) {
      //   where = {
      //     ...where,
      //     status: params.filterStatus ? 'active' : 'inactive',
      //   };
      // }

      if (
        params.hasOwnProperty('filterStatus') &&
        typeof params.filterStatus === 'string'
      ) {
        where = {
          ...where,
          // status: {
          //   [Op.iLike]: `%${params.filterStatus}%`,
          // },
          status: params.filterStatus
        };
      }

      if (
        params.hasOwnProperty('filterGender') &&
        typeof params.filterGender === 'string'
      ) {
        where = {
          ...where,
          gender: params.filterGender === 'male' ? 'male' : 'female',
        };
      }

      if (
        params.hasOwnProperty('filterCustomerCode') &&
        typeof params.filterCustomerCode === 'string'
      ) {
        where = {
          ...where,
          userCode: {
            [Op.iLike]: `%${params.filterCustomerCode}%`,
          },
        };
      }

      const options: any = {
        where,
        include: [
          {
            model: RoleModel,
            as: 'roles',
          },
        //   {
        //     model: EventModel,
        //     as: 'events',
        //   },
        //   {
        //     model: UserRelativeModel,
        //     as: 'relatives',
        //   },
        //   {
        //     model: EventReviewModel,
        //     as: 'reviews',
        //   },
        //   {
        //     model: VoucherModel,
        //     as: 'vouchers',
        //   },
        //   {
        //     model: TicketModel,
        //     as: 'tickets',
        //   },
        //   {
        //     model: EventFavouriteModel,
        //     as: 'favourites',
        //   },
        ],
        distinct: true,
        col: 'userId',
      };

      const count = await this.userRepositories.count({ ...options });

      const results = await this.userRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'desc']],
      });

      return {
        ...generateResultPagination(count, params),
        results: results.map(row => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll user::: error: ' + JSON.stringify(error),
        'user.service',
        'user.service',
      );
      return Promise.reject(error);
    }
  }

  async findAllToExport(params: {
    offset?: number;
    limit?: number;
    search?: string;
    filterStatus?: string;
    filterGender?: string;
    filterCustomerCode?: string
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: any[];
  }> {
    try {
      this.logger.log('Find all user...');
      this.logger.log('Params: ' + JSON.stringify(params));

      let where = {};

      if (params.startDate && params.endDate) {
        where = {
          ...where,
            createdAt: {
              [Op.and]: {
                [Op.gte]: params.startDate,
                [Op.lte]: params.endDate,
              },
            },
        };
      }

      params.search &&
        (where = {
          ...where,
          [Op.or]: [
            { name: { [Op.iLike]: `%${params.search}%` } },
            { email: { [Op.iLike]: `%${params.search}%` } },
            { phone: { [Op.iLike]: `%${params.search}%` } },
          ],
        });

      // if (
      //   params.hasOwnProperty('filterStatus') &&
      //   typeof params.filterStatus === 'boolean'
      // ) {
      //   where = {
      //     ...where,
      //     status: params.filterStatus ? 'active' : 'inactive',
      //   };
      // }

      if (
        params.hasOwnProperty('filterStatus') &&
        typeof params.filterStatus === 'string'
      ) {
        where = {
          ...where,
          status: {
            [Op.iLike]: `%${params.filterStatus}%`,
          },
        };
      }

      if (
        params.hasOwnProperty('filterGender') &&
        typeof params.filterGender === 'string'
      ) {
        where = {
          ...where,
          gender: params.filterGender === 'male' ? 'male' : 'female',
        };
      }

      if (
        params.hasOwnProperty('filterCustomerCode') &&
        typeof params.filterCustomerCode === 'string'
      ) {
        where = {
          ...where,
          userCode: {
            [Op.iLike]: `%${params.filterCustomerCode}%`,
          },
        };
      }

      const options: any = {
        where,
        include: [
          {
            model: RoleModel,
            as: 'roles',
          },
        ],
        distinct: true,
        col: 'userId',
      };

      const count = await this.userRepositories.count({ ...options });

      const results = await this.userRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'desc']],
      });

      return {
        ...generateResultPagination(count, params),
        results: results.map(row => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll user::: error: ' + JSON.stringify(error),
        'user.service',
        'user.service',
      );
      return Promise.reject(error);
    }
  }

  async create(user: {
    userId?: string;
    name?: string;
    email?: string;
    gender?: string;
    address?: string;
    status?: 'active' | 'inactive';
    phone?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    nickName?: string;
    roles?: Omit<RoleProperties, 'createdAt' | 'updatedAt'>[];
  }): Promise<UserProperties> {
    if (!user.email && !user.phone) {
      return Promise.reject('Email and phone number is empty!');
    }
    // if (!user.phoneCountryCode) {
    //   user.phoneCountryCode = '62';
    // }
    if (!user.userId) {
      user.userId = ulid();
    }
    if (user.firstName || user.middleName || user.lastName) {
      user.name = generateFullName({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      });
    } else if (user.name) {
      user.firstName = user.name;
    }
    this.logger.log('Create new user: ' + user.userId);
    this.logger.verbose('Params: ' + JSON.stringify(user.roles));

    try {
      if(user.email) {
        const findUserByEmail = await this.findOneByEmail(user.email)

        if(findUserByEmail) {
          return Promise.reject({
            statusCode: 400,
            code:
              'failed_to_create',
            message: 'Email already exist',
          });
        }
      }

      if(user.phone) {
        const cleanPhone = cleanPhoneNumber(user.phone)
        const findUserByPhone = await this.findOneByPhone(cleanPhone)

        if(findUserByPhone) {
          return Promise.reject({
            statusCode: 400,
            code:
              'failed_to_create',
            message: 'Phone Number already exist',
          });
        }
      }

      const result = await this.userRepositories.create({
        ...user,
        // gender: user.gender || 'male',
        status: user.status || 'active',
      });

      const roles = user.roles ? [...user.roles] : [];

      const roleIds = roles
        .filter(item => item.roleId !== '')
        .map(spec => spec.roleId);
      this.logger.verbose('Params: ' + JSON.stringify(roleIds));

      await this.userRoleService.create(
        user.userId,
        roleIds,
      );

      return {
        ...result.get(),
      };
    } catch (error) {
      this.logger.error('Failed create new user');
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  async findOneByEmail(email: string): Promise<UserProperties> {
    this.logger.log('Find user by email: ' + email);

    try {
      const result = await this.userRepositories.findOne({
        where: {
          email,
        },
        // include: [
        //   {
        //     model: RoleModel,
        //     as: 'roles',
        //   },
        // ],
      });

      return result ? result.get() : null;
    } catch (err) {
      this.logger.error('Failed find user by email!');
      this.logger.error(err);
      return Promise.reject(err);
    }
  }

  async findOneByUsername(username: string): Promise<UserProperties> {
    this.logger.log('Find user by username: ' + username);

    try {
      const result = await this.userRepositories.findOne({
        where: {
          username,
        },
        // include: [
        //   {
        //     model: RoleModel,
        //     as: 'roles',
        //   },
        //   {
        //     model: EventModel,
        //     as: 'events',
        //   },
        //   {
        //     model: UserRelativeModel,
        //     as: 'relatives',
        //   },
        //   {
        //     model: EventReviewModel,
        //     as: 'reviews',
        //   },
        //   {
        //     model: VoucherModel,
        //     as: 'vouchers',
        //   },
        //   {
        //     model: TicketModel,
        //     as: 'tickets',
        //   },
        //   {
        //     model: EventFavouriteModel,
        //     as: 'favourites',
        //   },
        // ],
      });

      return result ? result.get() : null;
    } catch (err) {
      this.logger.error('Failed find user by email!');
      this.logger.error(err);
      return Promise.reject(err);
    }
  }

  async findOneByUserId(userId: string): Promise<UserProperties> {
    const result = await this.userRepositories.findOne({
      where: { userId },
      include: [
        {
          model: RoleModel,
          as: 'roles',
        },
        // {
        //   model: EventModel,
        //   as: 'events',
        // },
        // {
        //   model: UserRelativeModel,
        //   as: 'relatives',
        // },
        // {
        //   model: EventReviewModel,
        //   as: 'reviews',
        // },
        // {
        //   model: VoucherModel,
        //   as: 'vouchers',
        // },
        // {
        //   model: TicketModel,
        //   as: 'tickets',
        //   include: [
        //     {
        //       model: TransactionItemModel,
        //       as: 'transactionItem'
        //     }
        //   ]
        // },
        // {
        //   model: EventFavouriteModel,
        //   as: 'favourites',
        // },
      ],
    });

    return result ? result.get() : null;
  }

  async update(
    user: Partial<Omit<UserProperties, 'createdAt' | 'updatedAt'>>,
    userId: string,
  ): Promise<UserProperties> {
    this.logger.log('Update user: ' + userId);
    this.logger.verbose('New Data: ' + user);

    try {
      const findUser = await this.findOneByUserId(userId);

      if(user.email) {
        if(findUser.email && findUser.email !== user.email) {
          const findUserByEmail = await this.findOneByEmail(user.email)
  
          if(findUserByEmail) {
            return Promise.reject({
              statusCode: 400,
              code:
                'failed_to_create',
              message: 'Email already exist',
            });
          }
        } else if(!findUser.email) {
          const findUserByEmail = await this.findOneByEmail(user.email)
  
          if(findUserByEmail) {
            return Promise.reject({
              statusCode: 400,
              code:
                'failed_to_create',
              message: 'Email already exist',
            });
          }
        }
      }

      if(user.phone) {
        const cleanPhoneUser = cleanPhoneNumber(user.phone)
        if(findUser.phone) {
          const cleanPhoneFoundUser = cleanPhoneNumber(findUser.phone)

          if(cleanPhoneFoundUser !== cleanPhoneUser) {
            const findUserByPhone = await this.findOneByPhone(cleanPhoneUser)

            if(findUserByPhone) {
              return Promise.reject({
                statusCode: 400,
                code:
                  'failed_to_create',
                message: 'Phone Number already exist',
              });
            }
            
          }
        } else if(!findUser.phone) {
          const findUserByPhone = await this.findOneByPhone(cleanPhoneUser)
  
          if(findUserByPhone) {
            return Promise.reject({
              statusCode: 400,
              code:
                'failed_to_create',
              message: 'Phone Number already exist',
            });
          }
        }
      }

      const [
        numberOfAffectedRows,
        [updatedUser],
      ] = await this.userRepositories.update(
        {
          ...user,
        },
        {
          where: {
            userId,
          },
          returning: true,
        },
      );
      const roles = user.roles ? [...user.roles] : [];

      const roleIds = roles
        .filter(item => item.roleId !== '')
        .map(spec => spec.roleId);
      this.logger.verbose('Params: ' + JSON.stringify(roleIds));

      await this.userRoleService.update(user.userId, roleIds);

      return numberOfAffectedRows ? updatedUser.get() : null;
    } catch (error) {
      this.logger.error('Failed update user!');
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateEmail(userId: string, newEmail: string) {
    // check existing email
    const userData = await this.findOneByUserId(userId);
    if (!userData) {
      return Promise.reject({
        code: 'user_not_found',
        message: 'User not found',
      });
    }

    // check is email has been used by other user?
    const findNewUserPropertiesByEmail = await this.findOneByEmail(newEmail);
    if (
      findNewUserPropertiesByEmail &&
      findNewUserPropertiesByEmail.userId !== userId
    ) {
      return Promise.reject({
        code: 'email_has_been_used',
        message: 'Email has been used by other user',
      });
    }

    await this.userRepositories.update(
      {
        email: newEmail,
      },
      {
        where: {
          userId,
        },
      },
    );

    return this.findOneByUserId(userId);
  }

  async updatePhone(userId: string, newPhone: string, phoneCountryCode: string) {
    // check existing email
    const userData = await this.findOneByUserId(userId);
    if (!userData) {
      return Promise.reject({
        code: 'user_not_found',
        message: 'User not found',
      });
    }

    // check is email has been used by other user?
    const findNewUserPropertiesByPhone = await this.findOneByPhone(newPhone);
    if (
      findNewUserPropertiesByPhone &&
      findNewUserPropertiesByPhone.userId !== userId
    ) {
      return Promise.reject({
        code: 'phone_number_has_been_used',
        message: 'Phone number has been used by other user',
      });
    }

    await this.userRepositories.update(
      {
        phone: newPhone,
        phoneCountryCode: phoneCountryCode
      },
      {
        where: {
          userId,
        },
      },
    );

    return this.findOneByUserId(userId);
  }

  async findOneByPhone(phoneNumber: string): Promise<UserProperties> {
    const result = await this.userRepositories.findOne({
      where: {
        phone: phoneNumber,
      },
      // include: [
      //   {
      //     model: RoleModel,
      //     as: 'roles',
      //   },
      //   {
      //     model: EventModel,
      //     as: 'events',
      //   },
      //   {
      //     model: UserRelativeModel,
      //     as: 'relatives',
      //   },
      //   {
      //     model: EventReviewModel,
      //     as: 'reviews',
      //   },
      //   {
      //     model: VoucherModel,
      //     as: 'vouchers',
      //   },
      //   {
      //     model: TicketModel,
      //     as: 'tickets',
      //   },
      //   {
      //     model: EventFavouriteModel,
      //     as: 'favourites',
      //   },
      // ],
    });

    return result ? result.get() : null;
  }

  async updateUserImage(params: {
    userId: string;
    imageLink?: string;
  }): Promise<any> {
    Logger.log('--ENTER UPDATE ARTICLE IMAGE, USER SERVICE--');
    const result = await this.userRepositories.update(
      { profilePic: params.imageLink ? params.imageLink : '' },
      {
        where: { userId: params.userId },
      },
    );
    Logger.log(
      'file updated user image: ' + JSON.stringify(result),
      'user.service',
    );
    return this.findOneByUserId(params.userId);
  }

  async delete(userId: string): Promise<boolean> {
    this.logger.log('Delete user: ' + userId);

    try {
      const userResult = await this.findOneByUserId(userId);

      if (userResult.roles.length > 0) {
        await this.userRoleService.deleteByUserId(userId);
      }

      const result = await this.userRepositories.destroy({
        where: { userId },
      });

      Logger.log('file deleted: ' + JSON.stringify(result), 'role.service');

      return true;
    } catch (error) {
      this.logger.error('Failed delete user');
      this.logger.error(error);

      return Promise.reject(error);
    }
  }

  async getUserMetadata(
    userId: string,
  ): Promise<{
    userId: string;
    name: string;
  }> {
    const user = await this.findOneByUserId(userId);
    const metadata = {
      userId: user.userId,
      name: user.name,
    };
    return metadata;
  }
    
}
