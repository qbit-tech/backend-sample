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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionService } from '@qbit-tech/libs-authv3';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { Authv3Service } from './authv3.service';
import {
  ChangePasswordUsingSessionRequest,
  ChangePasswordUsingSessionResponse,
  ForgotPasswordByLinkRequest,
} from './authv3.contract';

@ApiTags('Auth v3')
@Controller('auth/v3')
export class Authv3Controller {
  private readonly logger = new Logger(Authv3Controller.name);

  constructor(
    private readonly authv3Service: Authv3Service,
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
        link: process.env.BASE_URL_CMS + '/reset-password' + '/' + sessionId,
      };
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
    if (
      result
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
