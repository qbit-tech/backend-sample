import {
	Injectable,
  HttpStatus,
  HttpException,
	Logger
} from '@nestjs/common';
import { SessionService } from 'libs/session/src';
import * as jwt from 'jsonwebtoken';
import { DEFAULT_HASH_TOKEN } from '../../core/constants';
import { v4 as uuidv4 } from 'uuid';
import * as cryptoRandomString from 'crypto-random-string';
import { EmailAuthenticatorService } from 'libs/authv3/src/email/email-authenticator.service';
import { ESessionAction, ValidationSessionResponse } from 'libs/authv3/src/email/email-authenticator.contract';


@Injectable()
export class Authv3Service {
    private readonly logger = new Logger(Authv3Service.name);

    constructor(
        private readonly sessionService: SessionService,
        private readonly emailAuthService: EmailAuthenticatorService,
        // private readonly sibService: SendInBlueEmailService,
      ) {}

      async generateLoginToken(
        userId: string,
      ): Promise<{ token: string }> {
        this.logger.log('Generate login token for userid: ' + userId);

        const id = uuidv4()
        const sessionData = {
          uid: id,
        };
        const sessionId = await this.sessionService.saveSession(
          sessionData,
          31535000, //timeInSec expired 1 year
        );
        await this.sessionService.saveLatestSessionIdByKey(
          'auth_' + id,
          sessionId,
        );
    
        const tokenData = {
          sessionId,
        };
        const token = jwt.sign(
          tokenData,
          process.env.SESSION_HASH_TOKEN || DEFAULT_HASH_TOKEN,
          {
            expiresIn: '365d', // expires in 1 year
          },
        );
    
        return {
          token,
        };
      }

      async generateSessionAndOTP(
        action: ESessionAction,
        email: string,
        config?: { otpLength?: number; sendOTP?: boolean },
      ): Promise<{ otp: string; sessionId: string }> {
        this.logger.log('==== generateSessionAndOTP ====');
        this.logger.log('email: ' + email);
    
        let otpLength = 6;
        if (config && config.otpLength) {
          otpLength = config.otpLength;
        }
        const otp = cryptoRandomString({
          length: otpLength,
          type: 'numeric',
        });
    
        this.logger.log('OTP: ' + otp);
    
        let sessionData: ValidationSessionResponse = null;
        const sessionTimeoutInSec = 600; // 600 = 10 minutes
        sessionData = {
          action,
          email,
          otp,
        };
    
        const sessionId = await this.sessionService.saveSession(
          sessionData,
          sessionTimeoutInSec,
        );
    
        if (config && config.sendOTP) {
          // send otp
    
          const findUser = await this.emailAuthService.findOneByEmail(email)
          // await this.sibService.sendTemplate({
          //   to: { email },
          //   templateId: parseInt(process.env.SENDINBLUE_TEMPLATE_ID_EMAIL_OTP),
          //   dynamicTemplateData: {
          //     name:  'User',
          //     email,
          //     otp,
          //   },
          // });
        }
    
        return { otp, sessionId };
      }
    
      async generateVerifiedSession(
        prevSessionDetail: ValidationSessionResponse & { userId?: string },
      ): Promise<string> {
        this.logger.log('==== generateVerifiedSession ====');
        this.logger.log('prevSessionDetail: ' + JSON.stringify(prevSessionDetail));
    
        let sessionData: ValidationSessionResponse = null;
        const sessionTimeoutInSec = 600; // 600 = 10 minutes
        sessionData = {
          ...prevSessionDetail,
          action: ESessionAction.VERIFIED_OTP_EMAIL,
        };
    
        const sessionId = await this.sessionService.saveSession(
          sessionData,
          sessionTimeoutInSec,
        );
    
        return sessionId;
      }
    
      async verifySessionId(
        sessionId: string,
        email: string,
      ): Promise<{
        isValid: boolean;
        email?: ValidationSessionResponse['email'];
      }> {
        this.logger.log('==== verifySessionId ====');
        this.logger.log('sessionId: ' + sessionId);
        this.logger.log('email: ' + email);
    
        const sessionDetail = (await this.sessionService.getSession(
          sessionId,
        )) as ValidationSessionResponse;
    
        if (sessionDetail) {
          if (
            sessionDetail.action === ESessionAction.VERIFIED_OTP_EMAIL &&
            email === sessionDetail.email
          ) {
            return { ...sessionDetail, isValid: true };
          } else {
            return {isValid: false};
          }
        } else {
          return {isValid: false};
        }
      }

      async forgotPasswordByLink(params: {
        email: string;
      }): Promise<{
        sessionId: string;
        // name: string;
      }> {
        Logger.log('--ENTER FORGOT PASSWORD BY LINK, AUTH SERVICE--');
    
        const user = await this.emailAuthService.findOneByEmail(params.email);
        
        if (!user) {
          return Promise.reject({
            code: 'err_not_found',
            message: 'User not registered.',
          });
        }
        const sessionData: ValidationSessionResponse = {
          action: ESessionAction.VERIFIED_LINK_EMAIL,
          email: params.email,
          userId: user.userId,
        };
        const sessionId = await this.sessionService.saveSession(sessionData, 600);
    
        Logger.log(
          'auth forgotPasswordByLink: ' + JSON.stringify(user),
          'auth.service',
        );
    
        return {
          sessionId,
          // name: user.name,
        };
      }

      async changePasswordUsingSession(params: {
        sessionId: string;
        newPassword: string;
      }): Promise<{ isSuccess: boolean }> {
        const sessionData = (await this.sessionService.getSession(
          params.sessionId,
        )) as {
          action: string;
          userId: string;
          email: string;
        };
    
        const isValidSession =
          sessionData !== null 
          // &&
          // (sessionData.action === 'admin_forgot_login' ||
          //   sessionData.action === 'changePassword');
        if (!isValidSession) {
          throw new HttpException(
            {
              code: 'err_unauthorized',
              message: 'Invalid session',
              payload: {},
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
    
        await this.emailAuthService.changePasswordByEmail(
          sessionData.email,
          params.newPassword,
        );
    
        await this.sessionService.removeSession(params.sessionId);
    
        return {
          isSuccess: true,
        };
      }
}