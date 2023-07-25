import {
  Body,
  Controller,
  Put,
  UseInterceptors,
  Header,
  Res,
  UploadedFile,
  Req,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
  Patch,
  Logger,
  Post,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express'
import { UserService } from './user.service';
import {
  UpdateRequest,
  UserApiContract,
  UpdatePhotoRequest,
  UpdatePhotoResponse,
  CheckUserRequest,
  UserFindAllRequest,
  UserFindAllResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from './contract/user.contract';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import { AppRequest, SimpleResponse } from 'libs/libs-utils/src/appContract/app.contract';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserProperties } from './user.entity';
// import { AuthService } from '../auth/auth.service';
import { async as crypt } from 'crypto-random-string';
import { EPlatform } from '../../core/constants';
import { cleanPhoneNumber, getErrorStatusCode } from 'libs/libs-utils/src/utils';
import { FEATURE_PERMISSIONS } from '../../featureAndPermission/featureAndPermission.constant';

@ApiTags('Users')
@Controller('users')
export class UserController implements UserApiContract {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    // private authService: AuthService,
    // private emailAuthenticatorService: EmailAuthenticatorService,
    // private phoneAuthenticatorService: PhoneAuthenticatorService,
    // private sibService: SendInBlueEmailService,
  ) {}

  @ApiOperation({ summary: 'New admin using email authenticator' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthPermissionGuard())
  // @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @Req() req: AppRequest,
    @Body() body: CreateUserRequest,
    @UploadedFile() file,
  ): Promise<UserProperties> {
    this.logger.log('Create new user');
    this.logger.verbose('Body: ' + JSON.stringify(body));

    try {
      const fullName = `${body.firstName} ${
        body.middleName ? body.middleName : '.'
      } ${body.lastName ? body.lastName : '.'}`;
      const name = fullName.replace(/[^a-zA-Z ]/g, '');
      const randomPassword = await crypt({ length: 10 });

      const userData = await this.userService.create({
        ...body,
      });

      if (body.email) {
        console.info('email registered');
        // const res = await this.emailAuthenticatorService.register({
        //   userId: userData.userId,
        //   email: body.email,
        //   password: body.password ? body.password : randomPassword,
        //   isConfirmed: false,
        // });
        // if (res) {
        //   await this.sibService.sendTemplate({
        //     to: [
        //       {
        //         email: body.email,
        //       },
        //     ],
        //     templateId: parseInt(
        //       process.env.SENDINBLUE_TEMPLATE_ID_SEND_PASSWORD_TO_NEW_USER,
        //     ),
        //     params: {
        //       name: name,
        //       email: body.email,
        //       password: body.password ? body.password : randomPassword,
        //     },
        //   });
        // }
      }
      // await this.authService.generateSessionForVerifyEmail({
      //   email: body.email,
      //   platform:
      //     body.platform === 'cms' ? EPlatform.CMS : EPlatform.MOBILE_APP,
      // });

      return userData;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, getErrorStatusCode(error));
      // return Promise.reject(error.message);
    }
  }
  
  @Post('/check')
  // @ApiBearerAuth()
  async checkUser(@Body() body: CheckUserRequest): Promise<{
    isEmailExist: boolean,
    isUsernameExist: boolean,
    isPhoneExist: boolean}> {
    try {
      let res
      if(body.email){
        const findUser = await this.userService.findOneByEmail(body.email);
        if(findUser) {
          res = {
            ...res,
            isEmailExist: true
          }
        } else {
          res = {
            ...res,
            isEmailExist: false
          }
        }
      }

      if(body.phone){
        const phone = cleanPhoneNumber(body.phone)
        const findUser = await this.userService.findOneByPhone(phone);
        if(findUser) {
          res = {
            ...res,
            isPhoneExist: true
          }
        } else {
          res = {
            ...res,
            isPhoneExist: false
          }
        }
      }

      return res
    } catch (err) {
      throw new HttpException(
        {
          code: 'failed_find_user',
          message: err.errors[0].message,
        },
        422,
      );
      // return Promise.reject(error.message);
    }
  }

  @ApiOperation({ summary: 'List all user' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.USER.__type,
      FEATURE_PERMISSIONS.USER.LIST.__type,
    ),
  )
  @ApiOkResponse({ type: UserFindAllResponse })
  async findAll(
    @Query() params: UserFindAllRequest,
  ): Promise<UserFindAllResponse> {
    const res = await this.userService.findAll({
      ...params,
      // filterStatus: convertStringToBoolean(params.filterStatus),
    });

    for (const result of res.results) {
      const verifiedStatus = await this.getVerifiedStatus({
        email: result.email,
        phone: result.phone,
      });
      res.results = res.results.map(item => {
        if (result.userId === item.userId) {
          item = {
            ...item,
            ...verifiedStatus,
          };
        }
        return item;
      });
    }

    return res;
  }

  @ApiOperation({
    summary:
      'Update user profile by userId, set userid to "me" to change current login user profile',
  })
  @ApiBearerAuth()
  @Patch(':userId')
  @UseGuards(AuthPermissionGuard())
  @ApiOkResponse({ type: UserProperties })
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() body: UpdateUserRequest,
    @Req() req: AppRequest,
  ): Promise<UserProperties> {
    try {

      let uid = userId;
      if (userId === 'me') {
        uid = req.user.userId;
      }
  
      if (userId !== 'me') {
        // only for admin
  
        if (body.email && body.isEmailVerified !== undefined) {
          // await this.emailAuthenticatorService.updateDataByUserId(uid, {
          //   email: body.email,
          //   isConfirmed: body.isEmailVerified,
          // });
        }
      }
  
      const findDataBefore = await this.userService.findOneByUserId(uid)
  
      const res = await this.update({
        ...body,
        userId: uid,
      });
  
      return res
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }

  async update(
    request: UpdateRequest): Promise<any> {
    try {
      await this.userService.update(request, request.userId);
      return this.getProfile(request.userId);
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
      // return Promise.reject(error.message);
    }
  }

  @ApiOperation({
    summary:
      'Get user data by userId, set userId to "me" to get current login user data',
  })
  @ApiBearerAuth()
  @Get(':userId')
  @UseGuards(AuthPermissionGuard())
  @ApiOkResponse({ type: UserProperties })
  async getMyProfile(
    @Param('userId') userId: string,
    @Req() req: AppRequest,
  ): Promise<UserProperties> {
    let uid = userId;
    if (userId === 'me') {
      Logger.log('get my profile');
      uid = req.user.userId;
    }
    Logger.log('req.user', req.user);
    Logger.log('userId', userId);
    Logger.log('uid', uid);
    return this.getProfile(uid);
  }

  async getProfile(userId: string): Promise<UserProperties> {
    const userData = await this.userService.findOneByUserId(userId);
    const verifiedStatus = await this.getVerifiedStatus({
      email: userData.email,
    });

    const res: UserProperties = {
      ...userData,
      ...verifiedStatus,
    };

    return res;
  }

  async getVerifiedStatus(data: { email: string; phone?: string }) {
    let res = {
      isEmailVerified: false,
      isPhoneVerified: false,
    };
    if (data.email) {
      // const emailAuthData = await this.emailAuthenticatorService.findOneByEmail(
      //   data.email,
      // );

      // if (emailAuthData) {
      //   res = {
      //     ...res,
      //     isEmailVerified: emailAuthData.isConfirmed,
      //   };
      // }
    }
    if (data.phone) {
      // const phoneAuthData = await this.authService.findOneByPhoneNumberAuthDataByPhone(
      //   data.phone,
      // );
      // if (phoneAuthData) {
      //   res = {
      //     ...res,
      //     isPhoneVerified: true,
      //   };
      // }
    }

    return res;
  }

  @ApiOperation({ summary: 'Delete user by userId' })
  @ApiBearerAuth()
  @Delete(':userId')
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.USER.__type,
      FEATURE_PERMISSIONS.USER.FORCE_DELETE_OTHER_USER.__type,
    ),
  )
  @ApiOkResponse({ type: SimpleResponse })
  async delete(
    @Req() req: AppRequest,
    @Param('userId') userId: string,
  ): Promise<{ isSuccess: boolean }> {

    const isSuccess = await this.userService.delete(userId);
    if (isSuccess) {
      // await Promise.all([
      //   this.emailAuthenticatorService.deleteByUserId(userId),
      //   this.phoneAuthenticatorService.deleteByUserId(userId),
      // ]);
    }

    return {
      isSuccess,
    };
  }
}
