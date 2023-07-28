import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { AuthModel, AuthProperties, EAuthMethod } from '../authv3.entity';
import { ERRORS } from 'apps/base/src/core/error.constant';

@Injectable()
export class EmailAuthenticatorService {
  private readonly logger = new Logger(EmailAuthenticatorService.name);

  constructor(
    @InjectModel(AuthModel)
    private readonly authRepositories: typeof AuthModel,
  ) {}

  
  async register(params: {
    email: string;
    password: string;
    userId: string;
  }): Promise<Omit<AuthProperties, 'password'>> {
    this.logger.log('Register new email authenticator: ');
    this.logger.verbose('Params: ' + JSON.stringify(params));

    
    try {
        const pwd = await bcrypt.hash(params.password, 10);
        const emailData = await this.authRepositories.create({
            username: params.email,
            userId: params.userId,
            method: EAuthMethod.emailPassword,
            password: pwd,
            isVerified: false,
            isBlocked: false,
        })
        
        const result = emailData.get();
        delete result.password;
        delete result.id;
        delete result.method;
        return result;
    } catch (error) {
        this.logger.error('Failed register to email auth!');
        this.logger.error(error);
        return Promise.reject(error);
      }
  }

  async authenticateLogin(params: {
    email: string;
    password: string;
  }): Promise<Omit<AuthProperties, 'password'>> {
    this.logger.log('Authenticate login');
    this.logger.verbose('Params: ' + JSON.stringify(params));

    const emailData = await this.findOneByEmail(params.email, true);

    const isPasswordMatch = await bcrypt.compare(
      params.password,
      emailData.password,
    );

    if (isPasswordMatch) {
      const row = emailData;
      delete row.password;
      delete row.id;
      return row;
    } else {
      return Promise.reject({
        statusCode: ERRORS.login.password_mismatch.statusCode,
        code: ERRORS.login.password_mismatch.code,
        message: ERRORS.login.password_mismatch.message,
      })
    }
  }

  async changePasswordByEmail(
    email: string,
    newPassword: string,
  ): Promise<Omit<AuthProperties, 'password'>> {
    try {
    this.logger.log('Change password email: ' + email);
    const pwd = await bcrypt.hash(newPassword, 10);

    this.logger.log('Updating email ');

    const findByEmail = await this.findOneByEmail(email) 

    if(findByEmail) {
      await this.authRepositories.update(
        {
          password: pwd,
        },
        {
          where: {
            username: email,
          },
        },
      );
    } 

    this.logger.log('email updated ');
    return await this.findOneByEmail(email);
    } catch (error) {
      Logger.error(
        'reset password::: error: ' + JSON.stringify(error),
        'email-authenticator.service',
        'email-authenticator.service',
      );
      return Promise.reject(error);
    }
  }

  async findOneByEmail(
    email: string,
    isNeedPassword?: boolean
  ): Promise<AuthProperties> {
      this.logger.log('find one by email: ' + email);
      const result = await this.authRepositories.findOne({ where: { username: email } });

      if (!result) {
        return Promise.reject({
            statusCode: ERRORS.login.email_not_found.statusCode,
            code: ERRORS.login.email_not_found.code,
            message: ERRORS.login.email_not_found.message,
          })
      }
      
      const row = result.get();
      if(!isNeedPassword) {
          delete row.password;
      }
      return row;
  }

  async deleteByEmail(email: string): Promise<{ isSuccess: boolean }> {
    this.logger.log('Delete email authenticator: ' + email);

    await this.findOneByEmail(email)
    await this.authRepositories.destroy({ where: {username : email}});
    return {
      isSuccess: true,
    };
  }
}