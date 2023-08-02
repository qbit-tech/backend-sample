import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SessionService,
  // EmailAuthenticatorService,
  AuthService,
  CheckEmailExistRequest,
  CheckEmailExistResponse,
  ESessionAction,
  RegisterRequest,
  SendEmailOTPResponse,
  SendOTPEmail,
  SignInRequest,
  ValidationSessionResponse,
  VerifyOTPEmailRequest,
  VerifyOTPEmailResponse,
} from '@qbit-tech/libs-authv3';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { Authv3Service } from './authv3.service';
import { EMAIL_OTP_LENGTH } from '../../data/config';
import { ulid } from 'ulid';
import { EAuthMethod } from '@qbit-tech/libs-authv3/dist/authentication.entity';

@ApiTags('Auth v3 Email OTP')
@Controller('auth/v3/email')
export class Authv3EmailOTPController {
  private readonly logger = new Logger(Authv3EmailOTPController.name);

  constructor(
    private readonly authEmailOTPService: Authv3Service,
    private readonly emailAuthService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @ApiOperation({ summary: 'Register using email auth' })
  @Post('register')
  // @ApiOkResponse({ type: RegisterResponse })
  async register(@Body() body: RegisterRequest): Promise<any> {
    try {
      const userId = ulid();

      const result = await this.emailAuthService.register(EAuthMethod.emailPassword,{
        userId,
        username: body.email,
        password: body.password,
      });
      return result;
    } catch (err) {
      console.log('auth.controller: ', err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  @ApiOperation({ summary: 'Sign In using email auth' })
  @Post('signin')
  // @ApiOkResponse({ type: SignInResponse })
  async signIn(@Body() req: SignInRequest): Promise<any> {
    try {
      const authenticateLogin = await this.emailAuthService.authenticate({
        method: EAuthMethod.emailPassword,
        username: req.email,
        password: req.password,
      });

      const signInResult = await this.authEmailOTPService.generateLoginToken(
        authenticateLogin.userId,
      );

      if (signInResult.token === null) {
        throw new HttpException(
          {
            code: 401,
            message: 'Failed to sign in',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        token: signInResult.token,
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

  @ApiOperation({ summary: 'Check email exist' })
  @Post('is-exist')
  // @ApiOkResponse({ type: SendEmailOTPRequest })
  async checkEmail(
    @Body() body: CheckEmailExistRequest,
  ): Promise<CheckEmailExistResponse> {
    try {
      const result = await this.emailAuthService.findOne(EAuthMethod.emailPassword, body.email);

      if (result) {
        return {
          isExist: true,
        };
      }
    } catch {
      return {
        isExist: false,
      };
    }
  }

  @ApiOperation({ summary: 'Send OTP to email' })
  @Post('send-otp')
  // @ApiOkResponse({ type: SendEmailOTPRequest })
  async sendOTP(@Body() body: SendOTPEmail): Promise<SendEmailOTPResponse> {
    const bypassEmail =
      process.env.NODE_ENV === 'development' ||
      process.env.RETURN_OTP_EMAIL_IN_RESPONSE === 'TRUE';
    // const bypassEmail = false;
    console.info('byPassEmail', bypassEmail);

    const result = await this.authEmailOTPService.generateSessionAndOTP(
      ESessionAction.REQUEST_OTP_EMAIL,
      body.email,
      { otpLength: EMAIL_OTP_LENGTH, sendOTP: !bypassEmail },
    );

    if (!bypassEmail) {
      delete result.otp;
    }

    return result;
  }

  @ApiOperation({ summary: 'Verify otp which user got via email' })
  @Post('verify-otp')
  // @ApiOkResponse({ type: VerifyEmailOTPResponse })
  async verifyOtp(
    @Body() body: VerifyOTPEmailRequest,
  ): Promise<VerifyOTPEmailResponse> {
    const sessionDetail = (await this.sessionService.getSession(
      body.sessionId,
    )) as ValidationSessionResponse;

    if (sessionDetail) {
      if (sessionDetail.otp === body.otp) {
        const findUserByEmail = await this.emailAuthService.findOne(
          EAuthMethod.emailPassword,
          sessionDetail.username,
        );

        if (findUserByEmail) {
          // generate new verified session
          const sessionId =
            await this.authEmailOTPService.generateVerifiedSession({
              ...sessionDetail,
              userId: findUserByEmail.userId,
            });

          return {
            sessionId,
          };
        } else {
          const sessionId =
            await this.authEmailOTPService.generateVerifiedSession(
              sessionDetail,
            );

          return {
            sessionId,
          };
        }
      } else {
        throw new HttpException(
          {
            code: 'invalid_otp',
            message: 'Invalid OTP',
          },
          401,
        );
      }
    } else {
      throw new HttpException(
        {
          code: 'invalid_session',
          message: 'Invalid Session',
        },
        401,
      );
    }
  }
}
