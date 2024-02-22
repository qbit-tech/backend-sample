import {
	Body,
	Controller,
	Put,
	UseInterceptors,
    HttpStatus,
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
import { RoleService } from './role.service';
import { 
    RoleApiContract,
    RoleFindAllRequest,
    RoleFindAllResponse,
    RoleFindOneResponse,
    RoleCreateRequest,
    RoleUpdateRequest,
    RoleDeleteResponse
 } from './role.contract';
import { AppRequest, SimpleResponse } from '@qbit-tech/libs-utils';
// import { AppRequest, SimpleResponse } from '@comika/appContract/app.contract';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { RoleProperties, BaseRoleProperties } from './role.entity';
// import { AuthPermissionGuard } from '../../core/authPermission.guard';
// import { FEATURE_PERMISSIONS } from '../../featureAndPermission/featureAndPermission.constant';

@ApiTags('Roles')
@Controller('roles')
export class RoleController implements RoleApiContract {
  constructor(
    private readonly roleService: RoleService,
    ) {}

  @ApiOperation({summary: 'List roles'})
  @Get()
  @ApiOkResponse({type: RoleFindAllResponse})
  async findAll(
    @Query() params: RoleFindAllRequest,
  ): Promise<RoleFindAllResponse> {
    try {
      Logger.log(
        'findAll params: ' + JSON.stringify(params),
        'role.controller',
      );
      const res = await this.roleService.findAll({
        ...params,
      });
      Logger.log(
        'findAll res.results.length: ' + res.results.length,
        'role.controller',
      );

      return res;
    } catch (error) {
      Logger.error('findAll error ::: ' + error, 'role.controller');
      return Promise.reject(error);
    }
  }

  @ApiOperation({summary: 'Get single role'})
  @Get(':roleId')
  @ApiOkResponse({type: RoleFindOneResponse})
  async findOne(@Param('roleId') roleId: string): Promise<RoleFindOneResponse> {
    try {
      Logger.log('--ENTER FIND ONE, ROLE CONTROLLER--');
      Logger.log('findOne : ' + JSON.stringify(roleId), 'role.controller');
      const res = await this.roleService.findOne(roleId);

      return {
        ...res,
      };
    } catch (error) {
      Logger.error('findOne error ::: ' + error, 'role.controller');
      return Promise.reject(error);
    }
  }

  @ApiOperation({summary: 'Update role'})
  @ApiBearerAuth()
  @Patch(':roleId')
//   @UseGuards(
//     AuthPermissionGuard(
  //     FEATURE_PERMISSIONS.ROLE.__type,
  //     FEATURE_PERMISSIONS.ROLE.UPDATE.__type,
  //   ),
  // )
    // ))
  @ApiOkResponse({type: RoleProperties})
  async update(
    @Req() req: AppRequest,
    @Param('roleId') roleId: string,
    @Body() data: RoleUpdateRequest,
  ): Promise<RoleProperties> {
    try {
      Logger.log('--ENTER UPDATE, Role CONTROLLER--');
      Logger.log('update : ' + JSON.stringify(roleId), 'role.controller');

      const res = await this.roleService.update({
        ...data,
        roleId,
      });

      return {
        ...res,
      };
    } catch (error) {
      Logger.error('update Role error ::: ' + error, 'role.controller');
      return Promise.reject(error);
    }
  }

  @ApiOperation({summary: 'Delete role'})
  @ApiBearerAuth()
  @Delete(':roleId')
//   @UseGuards(
//     AuthPermissionGuard(
  //     FEATURE_PERMISSIONS.ROLE.__type,
  //     FEATURE_PERMISSIONS.ROLE.DELETE.__type,
  //   ),
  // )
    // ))
  @ApiOkResponse({type: RoleDeleteResponse})
  async delete(
    @Req() req: AppRequest,
    @Param('roleId') roleId: string
    ): Promise<RoleDeleteResponse> {
    try {
      Logger.log('--ENTER DELETE, ROLE CONTROLLER--');
      Logger.log('delete : ' + JSON.stringify(roleId), 'role.controller');

      const findDataBefore = await this.roleService.findOne(roleId)

      return await this.roleService.delete(roleId);
    } catch (error) {
      Logger.error('delete Role error ::: ' + error, 'role.controller');
      return Promise.reject(error);
    }
  }

  
  @ApiOperation({ summary: 'Soft Delete role by roleId' })
  @ApiBearerAuth()
  @Delete(':roleId/request')
//   @UseGuards(AuthPermissionGuard())
  @ApiOkResponse({ type: SimpleResponse })
  async requestDelete(
    @Req() req: AppRequest,
    @Param('roleId') roleId: string): Promise<{ isSuccess }> {
    // const isSuccess = await this.userService.delete(roleId)
    try{

      const findDataBefore = await this.roleService.findOne(roleId)

      const isSuccess = await this.roleService.update(
        {
          ...findDataBefore,
          isDeleted: true,
        },
      );  

      if (isSuccess) {
        return {
          isSuccess: true,
        }; 
      } 
    } catch(error){
      Logger.error(error);
      throw new HttpException(
        {
          code: 'failed_delete_role',
          message: error.errors[0].message,
        },
        422,
      );
    }
  }

  @ApiOperation({summary: 'Create new role'})
  @ApiBearerAuth()
  @Post()
//   @UseGuards(
//     AuthPermissionGuard(
  //     FEATURE_PERMISSIONS.ROLE.__type,
  //     FEATURE_PERMISSIONS.ROLE.CREATE.__type,
  //   ),
  // )
    // ))
  @ApiOkResponse({type: RoleFindOneResponse})
  async create(
    @Req() req: AppRequest,
    @Body() params: RoleCreateRequest): Promise<any> {
    try {
      Logger.log('--ENTER CREATE, ROLE CONTROLLER--');
      Logger.log('create : ' + JSON.stringify(params), 'role.controller');
      console.info('params', JSON.stringify(params));
      const data = { ...params };
      const role = await this.roleService.create({
        ...data,
      });

      return this.findOne(role.roleId);
    } catch (error) {
      Logger.error('create error ::: ' + error, 'role.controller');
      return Promise.reject(error);
    }
  }

  @ApiOperation({summary: "Convert permissions to v2"})
  @ApiBearerAuth()
  @Patch()
  @ApiOkResponse({type: RoleFindAllResponse})
  async convert(
    @Query() params: RoleFindAllRequest,
  ):Promise<RoleFindAllResponse>{
    try{
      Logger.log('--ENTER CONVERT ROLE PERMS CONTROLLER--');
      const res = await this.roleService.findAll({
        ...params,
      });
      const convertRes = await this.roleService.convert(res);
      return convertRes;
    }
    catch{}
    return;
  }
}