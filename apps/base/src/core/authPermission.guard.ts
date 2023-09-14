import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  mixin,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { hasPermissionFromRoles } from '../modules/permission/featureAndPermission/featureAndPermissionHelper';
import { AuthSessionService } from '../modules/authUser/authUser.service';

export const AuthPermissionGuard = (feature?: string, permission?: string, isTokenOptional?: boolean) => {
  @Injectable()
  class AuthPermissionGuardMixin implements CanActivate {
    constructor(readonly authSessionService: AuthSessionService) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      return this.validateRequest(request, response);
    }

    async validateRequest(req: Request, res: Response): Promise<boolean> {
      const token = AuthPermissionGuardMixin.getToken(req);

      if (isTokenOptional) {
        Logger.log('!token && isTokenOptional');
        return true;
      }

      const auth = await this.authSessionService.validateToken(token);

      if (auth) {
        Logger.log('auth exist');
        let approved = true;

        if (feature && permission) {
          Logger.log('feature', feature);
          Logger.log('permission', permission);
          // const permissions = Array.isArray(permission)
          //   ? permission
          //   : [permission];
          // for (const role of auth.roles) {
          //   approved = hasPermission(role.permissions, feature, permission);
          // }
          approved = hasPermissionFromRoles(auth.user.role, feature, permission);
        } else {
          approved = true;
        }

        if (!approved) {
          throw new HttpException(
            {
              code: 'err_unauthorized',
              message: 'Authorization Failed',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        req['user'] = {
          sessionId: auth.decodedToken.sessionId,
          ...auth.user,
        };

        return true;
      } else {
        throw new HttpException(
          {
            code: 'err_unauthorized',
            message: 'Authorization Failed',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    static getToken(req: Request) {
      const header: any = req.get('Authorization');

      if (header === undefined || !header.toLowerCase().startsWith('bearer ')) {
        return false;
      }
      return header.substr(7);
    }
  }

  return mixin(AuthPermissionGuardMixin);
};
