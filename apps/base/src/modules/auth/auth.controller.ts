import {
  Body,
  Controller,
  HttpException,
  Res,
  Query,
  Param,
  Post,
  Get,
  Logger,
  HttpStatus,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInRequest, AuthService } from '@qbit-tech/libs-authv3';
import { SessionService } from '@qbit-tech/libs-session';
import { AppRequest, getErrorStatusCode } from '@qbit-tech/libs-utils';
import {
  ChangePasswordUsingSessionRequest,
  ChangePasswordUsingSessionResponse,
  ForgotPasswordByLinkRequest,
} from './auth.contract';
import { UserService } from '../user/user.service';
import { EAuthMethod } from '@qbit-tech/libs-authv3/dist/authentication.entity';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
import { verify } from 'jsonwebtoken';
import { DEFAULT_HASH_TOKEN } from '@qbit-tech/libs-session/dist/session.helper';
import { CreateUserRequest } from '../user/contract/user.contract';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserModel, UserProperties } from '../user/user.entity';
import { async as crypt } from 'crypto-random-string';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authv3Service: AuthService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'New admin using email authenticator' })
  @ApiBearerAuth()
  @Post('register-with-profile')
  // @UseGuards(AuthPermissionGuardV2())
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

      let result;

      const userData = await this.userService.create({
        ...body,
      });

      if (body.email) {
        this.logger.log('email registered');
        const registerByEmail = await this.authv3Service.register(
          EAuthMethod.emailPassword,
          {
            userId: userData.userId,
            username: body.email,
            password: body.password ? body.password : randomPassword,
          },
        );

        result = {
          ...result,
          registerByEmailResult: {
            ...registerByEmail,
          },
        };
      }

      if (body.username) {
        this.logger.log('username registered');
        const registerByUsername = await this.authv3Service.register(
          EAuthMethod.usernamePassword,
          {
            userId: userData.userId,
            username: body.email,
            password: body.password ? body.password : randomPassword,
          },
        );

        result = {
          ...result,
          registerByUsernameResult: {
            ...registerByUsername,
          },
        };

        return result;
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }

  @ApiOperation({ summary: 'Sign In using email auth' })
  @Post('signin')
  // @ApiOkResponse({ type: SignInResponse })
  async signIn(@Body() req: SignInRequest): Promise<any> {
    try {
      const authenticateLogin = await this.authv3Service.authenticate({
        method: EAuthMethod.emailPassword,
        username: req.email,
        password: req.password,
      });

      const user = await this.userService.findOneByUserId(
        authenticateLogin.userId,
      );

      // const user = await this.userService.findOneByEmail(
      //   authenticateLogin.username
      // )

      const signInResult = await this.sessionService.generateLoginToken(
        {
          method: EAuthMethod.emailPassword,
          username: req.email,
          userId: authenticateLogin.userId,
        },
        user,
      );

      if (signInResult.access_token === null) {
        throw new HttpException(
          {
            code: 401,
            message: 'Failed to sign in',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        access_token: signInResult.access_token,
        refresh_token: signInResult.refresh_token,
        userId: authenticateLogin.userId,
        isVerified: authenticateLogin.isVerified,
        isPasswordExpired: authenticateLogin.isPasswordExpired,
        passwordExpiredAt: authenticateLogin.passwordExpiredAt,
        isBlocked: authenticateLogin.isBlocked,
        blockedAt: authenticateLogin.blockedAt,
      };
    } catch (err) {
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(AuthPermissionGuardV2())
  async refreshToken(@Req() req: any): Promise<any> {
    try {
      const token = req.headers.authorization.substr(7);

      const decodedToken = verify(
        token,
        process.env.SESSION_HASH_TOKEN || DEFAULT_HASH_TOKEN,
        {
          algorithms: ['HS256'],
        },
      ) as any;
      const user = await this.userService.findOneByUserId(decodedToken.sub);
      return this.sessionService.refreshToken(token, user);
    } catch (err) {
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  // @ApiOperation({ summary: 'User will get link for reset password via email' })
  // @Post('forgot-password/link')
  // async forgotPasswordByLink(
  //   @Body() params: ForgotPasswordByLinkRequest,
  // ): Promise<any> {
  //   try {
  //     Logger.log('--ENTER FORGOT PASSWORD BY LINK, AUTH CONTROLLER--');
  //     Logger.log('auth : ' + JSON.stringify(params), 'auth.controller');
  //     const { sessionId } = await this.authv3Service.forgotPasswordByLink({
  //       email: params.email,
  //     });

  //     return {
  //       link: process.env.BASE_URL_CMS + '/reset-password' + '/' + sessionId,
  //     };
  //   } catch (err) {
  //     throw new HttpException(err, getErrorStatusCode(err));
  //   }
  // }

  // @Get('/reset-password/:sessionId')
  // async pageResetPassword(
  //   @Query() query: { page_url: string },
  //   @Param('sessionId') sessionId: string,
  //   @Res() res: any,
  // ): Promise<any> {
  //   Logger.log(
  //     'pageResetPassword: ' + JSON.stringify(sessionId),
  //     'auth.controller',
  //   );
  //   const result: any = await this.sessionService.getSession(sessionId);
  //   Logger.log(
  //     'pageResetPassword::: getSession() => ' + JSON.stringify(result),
  //     'auth.controller',
  //   );
  //   if (
  //     result
  //     // && result.action && result.action.includes('reset_password')
  //   ) {
  //     Logger.log('pageResetPassword::: before redirect()', 'auth.controller');
  //     if (query && query.page_url) {
  //       res.redirect(query.page_url + '/' + sessionId);
  //     } else {
  //       res.send({
  //         isSuccess: true,
  //       });
  //     }
  //   } else {
  //     throw new HttpException(
  //       {
  //         code: 'session_invalid',
  //         message: 'Invalid session',
  //       },
  //       400,
  //     );
  //   }
  // }

  // @ApiOperation({
  //   summary: 'User can reset password after got reset password link via email',
  // })
  // @Post('change-password/session')
  // //   @ApiOkResponse({ type: ChangePasswordUsingSessionResponse })
  // async changePasswordUsingSession(
  //   @Body() params: ChangePasswordUsingSessionRequest,
  // ): Promise<ChangePasswordUsingSessionResponse> {
  //   return this.authv3Service.changePasswordUsingSession({
  //     sessionId: params.sessionId,
  //     newPassword: params.newPassword,
  //   });
  // }
}
