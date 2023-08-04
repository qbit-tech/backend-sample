import {
  Body,
  Controller,
  Put,
  UseInterceptors,
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
import { UserService } from './user.service';
import {
  UpdateRequest,
  UserApiContract,
  UpdatePhotoResponse,
  CheckUserRequest,
  UserFindAllRequest,
  UserFindAllResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from './contract/user.contract';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import { AppRequest, SimpleResponse } from '@qbit-tech/libs-utils';
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
import { AuthService } from '@qbit-tech/libs-authv3';
import { cleanPhoneNumber, getErrorStatusCode } from '@qbit-tech/libs-utils';
import { FEATURE_PERMISSIONS } from '../../featureAndPermission/featureAndPermission.constant';
import { NotificationService } from '@qbit-tech/libs-notification';
import { EAuthMethod } from '@qbit-tech/libs-authv3/dist/authentication.entity';
// import { UploaderService } from '@qbit-tech/libs-uploader';

@ApiTags('Users')
@Controller('users')
export class UserController implements UserApiContract {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private emailAuthenticatorService: AuthService,
    private notificationService: NotificationService,
    // private uploaderService: UploaderService,
  ) {}

  @ApiOperation({ summary: 'New admin using email authenticator' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthPermissionGuard())
  @UseInterceptors(FileInterceptor('image'))
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
        const res = await this.emailAuthenticatorService.register( EAuthMethod.emailPassword,
          {
          userId: userData.userId,
          username: body.email,
          password: body.password ? body.password : randomPassword,
        });
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

  @ApiOperation({
    summary:
      'Change user photo by userId, set userId to "me" to change current login user data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @Put(':userId/photo')
  // @UseGuards(AuthPermissionGuard())
  @UseInterceptors(FileInterceptor('image'))
  @ApiOkResponse({ type: UpdatePhotoResponse })
  async updateMyProfilePic(
    @Param('userId') userId: string,
    @UploadedFile() file,
    @Req() req: AppRequest,
  ): Promise<UpdatePhotoResponse> {
    try {
      this.logger.log('Update user: ' + userId);
      let uid = userId;
      if (userId === 'me') {
        uid = req.user.userId;
      }
      // const updateUserImage = await this.uploaderService.updateImage(
      //   'users',
      //   uid,
      //   file,
      // );

      // const res = await this.userService.updateUserImage({
      //   userId: uid,
      //   imageLink: updateUserImage.payload.fileLinkCache,
      // });

      return file.path

      // const updateImage = await this.uploaderService.updateImage(
      //   'users',
      //   uid,
      //   file,
      //   null,
      //   true,
      //   // false
      // );

      // console.log(file)

      // if(updateImage) {
      //   return {
      //     isSuccess: true
      //   }
      // } else {
      //   return {
      //     isSuccess: false
      //   }
      // }
    } catch (err) {
      console.info('error: ', err);
    }
  }

  // async updatePhoto(request: UpdatePhotoRequest): Promise<any> {
  //   try {
  //     const fileSearchResult = await this.uploaderService.fileSearchByTable(
  //       'users',
  //       [request.userId],
  //     );

  //     const uploadResult = await this.uploaderService.fileUploaded({
  //       tableName: 'users',
  //       tableId: request.userId,
  //       filePath: request.file['key'],
  //       metadata: {},
  //     });

  //     if (fileSearchResult.has(request.userId)) {
  //       await this.uploaderService.deleteFileById(
  //         fileSearchResult.get(request.userId)[0].fileId,
  //       );
  //     }

  //     await this.userService.update(
  //       {
  //         profilePic: uploadResult.fileLinkCache,
  //       },
  //       request.userId,
  //     );

  //     return { isSuccess: true };
  //   } catch (err) {
  //     console.info('gagal update: controller ');
  //     return err;
  //   }
  // }

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
