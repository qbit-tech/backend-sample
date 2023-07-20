import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { AuthModel, AuthProperties } from '../authv3.entity';
import { ERRORS } from 'apps/base/src/core/error.constant';

@Injectable()
export class UsernameAuthenticatorService {
  private readonly logger = new Logger(UsernameAuthenticatorService.name);

  constructor(
    @InjectModel(AuthModel)
    private readonly authRepositories: typeof AuthModel,
  ) {}

  async register(params: {
    username: string;
    password: string;
    userId: string;
  }): Promise<Omit<AuthProperties, 'password'>> {
    this.logger.log('Register new username authenticator: ');
    this.logger.verbose('Params: ' + JSON.stringify(params));

    
    try {
        const pwd = await bcrypt.hash(params.password, 10);
        const usernameData = await this.authRepositories.create({
            // id,
            username: params.username,
            userId: params.userId,
            password: pwd,
        })
        
        const result = usernameData.get();
        delete result.password;
        return result;
    } catch (error) {
        this.logger.error('Failed register to username auth!');
        this.logger.error(error);
        return Promise.reject(error);
      }
    }

    async authenticateLogin(params: {
        username: string;
        password: string;
      }): Promise<Omit<AuthProperties, 'password'>> {
        this.logger.log('Authenticate login');
        this.logger.verbose('Params: ' + JSON.stringify(params));
    
        const usernameData = await this.findOneByUsername(params.username, true);
    
        const isPasswordMatch = await bcrypt.compare(
          params.password,
          usernameData.password,
        );
    
        if (isPasswordMatch) {
          const row = usernameData;
          delete row.password;
          return row;
        } else {
          return Promise.reject({
            statusCode: ERRORS.login.password_mismatch.statusCode,
            code: ERRORS.login.password_mismatch.code,
            message: ERRORS.login.password_mismatch.message,
          })
        }
      }

      async changePasswordByUsername(
        username: string,
        newPassword: string,
      ): Promise<Omit<AuthProperties, 'password'>> {
        try {
        this.logger.log('Change password username: ' + username);
        const pwd = await bcrypt.hash(newPassword, 10);
    
        this.logger.log('Updating username ');
    
        const findByusername = await this.findOneByUsername(username) 
    
        if(findByusername) {
          await this.authRepositories.update(
            {
              password: pwd,
            },
            {
              where: {
                username,
              },
            },
          );
        } 
    
        this.logger.log('username updated ');
        return await this.findOneByUsername(username);
        } catch (error) {
          Logger.error(
            'reset password::: error: ' + JSON.stringify(error),
            'username-authenticator.service',
            'username-authenticator.service',
          );
          return Promise.reject(error);
        }
      }

      async findOneByUsername(
        username: string,
        isNeedPassword?: boolean
      ): Promise<AuthProperties> {
          this.logger.log('find one by username: ' + username);
          const result = await this.authRepositories.findOne({ where: { username } });
    
          if (!result) {
            return Promise.reject({
                statusCode: ERRORS.login.username_not_found.statusCode,
                code: ERRORS.login.username_not_found.code,
                message: ERRORS.login.username_not_found.message,
              })
          }
          
          const row = result.get();
          if(!isNeedPassword) {
              delete row.password;
          }
          return row;
      }

      async deleteByUsername(username: string): Promise<{ isSuccess: boolean }> {
        this.logger.log('Delete username authenticator: ' + username);
    
        await this.findOneByUsername(username)
        await this.authRepositories.destroy({ where: {username}});
        return {
          isSuccess: true,
        };
      }
  }