import {
	Controller,
	Get,
	Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DEFAULT_PERMISSION_FULL_ACCESS, DEFAULT_PERMISSION_MINIMUM_ACCESS, DEFAULT_PERMISSION_NO_ACCESS } from '../../featureAndPermission/defaultPermission.constant';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  @Get('default/full-access')
  async getDefaultPermissionFullAccess(): Promise<any> {
    try {
      return DEFAULT_PERMISSION_FULL_ACCESS;
    } catch (error) {
      Logger.error(
        'getDefaultPermissionFullAccess error ::: ' + error,
        'permission.controller',
      );
      return Promise.reject(error);
    }
  }

  @Get('default/minimum-access')
  async getDefaultPermissionMinimumAccess(): Promise<any> {
    try {
      return DEFAULT_PERMISSION_MINIMUM_ACCESS;
    } catch (error) {
      Logger.error(
        'getDefaultPermissionMinimumAccess error ::: ' + error,
        'permission.controller',
      );
      return Promise.reject(error);
    }
  }

  @Get('default/no-access')
  async getDefaultPermissionNoAccess(): Promise<any> {
    try {
      return DEFAULT_PERMISSION_NO_ACCESS;
    } catch (error) {
      Logger.error(
        'getDefaultPermissionNoAccess error ::: ' + error,
        'permission.controller',
      );
      return Promise.reject(error);
    }
  }
}