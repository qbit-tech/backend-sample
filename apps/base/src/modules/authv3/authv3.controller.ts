import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Res,
    Query,
    Param,
    Post,
    Get,
    Request,
    UseGuards,
    Logger,
    Req,
  } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiOkResponse
} from '@nestjs/swagger';
import { SessionService } from 'libs/authv3/src/session/src';
import { getErrorStatusCode } from 'libs/libs-utils/src/utils';
import { ERRORS } from '../../core/error.constant';
import { EmailAuthenticatorService } from 'libs/authv3/src/email/email-authenticator.service';
import { CheckEmailExistRequest, CheckEmailExistResponse, ESessionAction, RegisterRequest, RegisterResponse, SendEmailOTPResponse, SendOTPEmail, SignInRequest, ValidationSessionResponse, VerifyOTPEmailRequest, VerifyOTPEmailResponse } from 'libs/authv3/src/email/email-authenticator.contract';
import { Authv3Service } from './authv3.service';
import { EMAIL_OTP_LENGTH } from '../../data/config';
import { ulid } from 'ulid';
import { ChangePasswordUsingSessionRequest, ChangePasswordUsingSessionResponse, ForgotPasswordByLinkRequest, ForgotPasswordByLinkResponse } from './authv3.contract';

@ApiTags('Auth v3')
@Controller('auth/v3')
export class Authv3Controller {
  private readonly logger = new Logger(Authv3Controller.name);

  constructor(
    private readonly authv3Service: Authv3Service,
    private readonly emailAuthService: EmailAuthenticatorService,
    private readonly sessionService: SessionService,
  ) {}

  @ApiOperation({ summary: 'User will get link for reset password via email' })
  @Post('forgot-password/link')
  async forgotPasswordByLink(
    @Body() params: ForgotPasswordByLinkRequest,
  ): Promise<any> {
    try {
        Logger.log('--ENTER FORGOT PASSWORD BY LINK, AUTH CONTROLLER--');
        Logger.log('auth : ' + JSON.stringify(params), 'auth.controller');
        const { sessionId } = await this.authv3Service.forgotPasswordByLink({
          email: params.email,
        });

    return {
        link: process.env.BASE_URL_CMS + '/reset-password' + '/' + sessionId
    }

    } catch (err) {
        throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  @Get('/reset-password/:sessionId')
  async pageResetPassword(
    @Query() query: { page_url: string },
    @Param('sessionId') sessionId: string,
    @Res() res: any,
  ): Promise<any> {
    Logger.log(
      'pageResetPassword: ' + JSON.stringify(sessionId),
      'auth.controller',
    );
    const result: any = await this.sessionService.getSession(sessionId);
    Logger.log(
      'pageResetPassword::: getSession() => ' + JSON.stringify(result),
      'auth.controller',
    );
    if (result 
        // && result.action && result.action.includes('reset_password')
        ) {
      Logger.log('pageResetPassword::: before redirect()', 'auth.controller');
      if (query && query.page_url) {
        res.redirect(query.page_url + '/' + sessionId);
      } else {
        res.send({
          isSuccess: true,
        });
      }
    } else {
      throw new HttpException(
        {
          code: 'session_invalid',
          message: 'Invalid session',
        },
        400,
      );
    }
  }

  @ApiOperation({
    summary: 'User can reset password after got reset password link via email',
  })
  @Post('change-password/session')
//   @ApiOkResponse({ type: ChangePasswordUsingSessionResponse })
  async changePasswordUsingSession(
    @Body() params: ChangePasswordUsingSessionRequest,
  ): Promise<ChangePasswordUsingSessionResponse> {
    return this.authv3Service.changePasswordUsingSession({
      sessionId: params.sessionId,
      newPassword: params.newPassword,
    });
  }
}