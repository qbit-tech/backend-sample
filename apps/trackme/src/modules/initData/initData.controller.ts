import { Body, Controller, Get, HttpException, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitDataService } from './initData.service';
import { SessionService, SignInRequest, AuthService } from '@qbit-tech/libs-authv3';
import { EAuthMethod } from '@qbit-tech/libs-authv3/dist/authentication.entity';
import { SimpleResponse, getErrorStatusCode } from '@qbit-tech/libs-utils';
import { InitDataRequest } from './initData.contract';
import { UserService } from '../user/user.service';
import { ROLE_SUPERADMIN_ID } from '../../data/role';

@ApiTags('Init Data')
@Controller('init')
export class InitDataController {
  private readonly logger = new Logger(InitDataController.name);
  constructor(
    private readonly initRoleService: InitDataService,
    private userService: UserService,
    private emailAuthenticatorService: AuthService,
  ) {}

  @Post('/roles')
  async initDataRoles(@Body() body: InitDataRequest): Promise<SimpleResponse> {
    try {
      const res = await this.initRoleService.init(body);

      return { isSuccess: res };
    } catch (err) {
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  @Post('/superadmin')
  async initDataSuperAdmin(): Promise<any> {
    try {
      // await this.initRoleService.init({});

      const isAdminExist = await this.userService.findOneByEmail(
        process.env.FIRST_SUPERADMIN_EMAIL,
      );
      if (!isAdminExist) {
        const userData = await this.userService.create({
          // ...body,
          email: process.env.FIRST_SUPERADMIN_EMAIL,
          firstName: process.env.FIRST_SUPERADMIN_FIRSTNAME,
          roleId: ROLE_SUPERADMIN_ID
        });

        if (userData) {
          const res = await this.emailAuthenticatorService.register(
            EAuthMethod.emailPassword,{
            userId: userData.userId,
            username: process.env.FIRST_SUPERADMIN_EMAIL,
            password: process.env.FIRST_SUPERADMIN_PASSWORD,
          });
        }
        return { isSuccess: true };
      } else {
        throw new HttpException(
          {
            code: 'superadmin_exist',
            message: 'account already exist!',
          },
          400,
        );
      }
    } catch (err) {
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }
}
