import {
    Body,
    Controller,
    Delete,
    Get,
    Req,
    Logger,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import {
    AddressApiContract,
    AddressCreateRequest,
    AddressFindAllRequest,
    AddressFindAllResponse,
    AddressUpdateRequest,
    AppRequest,
  } from './userAddress.contract';
  import { UserAddressService } from './userAddress.service';
  import { UserAddressModel } from './userAddress.entity';
  import { SimpleResponse } from './userAddress.contract';
  import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
  import { DEFAULT_ROLES } from '../../data/role';
  
  @ApiTags('User Addresses')
  @Controller('users/:userId/address')
  export class UserAddressController implements AddressApiContract {
    constructor(private readonly userAddressService: UserAddressService) {}
  
    @Get()
    async findAll(
      @Query() params: AddressFindAllRequest,
      @Param("userId") userId: string
    ): Promise<AddressFindAllResponse> {
      try {
        Logger.log('--ENTER FIND ALL USER ADDRESS, USER ADDRESS CONTROLLER--');
        Logger.log(
          `file exist: ` + JSON.stringify(params),
          'userAddress.controller',
        );
        const res = await this.userAddressService.findAll({
          ...params,
          userId,
        });
  
        const newRes: AddressFindAllResponse = {
          ...res,
        };
        return newRes;
      } catch (error) {
        Logger.error('findAll error ::: ' + error, 'address.controller');
        return Promise.reject(error);
      }
    }
  
  
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthPermissionGuardV2())
    async create(
      @Req() req: AppRequest,
      @Body() params: AddressCreateRequest,
      @Param('userId') userId: string
    ): Promise<UserAddressModel> {
      try {
        Logger.log('--ENTER CREATE USER ADDRESS, USER ADDRESS CONTROLLER--');
        Logger.log(
          `file created: ` + JSON.stringify(params),
          'userAddress.controller',
        );
        const loggedInUser = req.user;

      const userRole = DEFAULT_ROLES.find(role => role.roleId === loggedInUser.role);
      if (
        userRole && 
        (userRole.roleName === 'Super Admin' )
      ) {     
          const data = { ...params, userId };
          const address = await this.userAddressService.create(data);
          return address;
      } else if (loggedInUser.userId === userId) {
          const data = { ...params, userId: loggedInUser.userId };
          const address = await this.userAddressService.create(data);
          return address;
      } else {
          throw new Error("Permission denied");
      }

      } catch (error) {
        Logger.error('create error ::: ' + error, 'address.controller');
        return Promise.reject(error);
      }
    }
  
    @ApiBearerAuth()
    @Patch(':addressId')
    @UseGuards(AuthPermissionGuardV2())
    async update(
      @Param('addressId') addressId: string,
      @Param('userId') userId: string,
      @Body() data: AddressUpdateRequest,
    ): Promise<UserAddressModel> {
      try {
        Logger.log('--ENTER UPDATE USER ADDRESS, USER ADDRESS CONTROLLER--');
        Logger.log(
          `file ${addressId} updated: ` + JSON.stringify(data),
          'userAddress.controller',
        );
        const res = await this.userAddressService.update({
          ...data,
          addressId,
          userId,
        });
  
        return res;
      } catch (error) {
        Logger.error('update address error ::: ' + error, 'address.controller');
        return Promise.reject(error);
      }
    }
  
    @ApiBearerAuth()
    @Delete(':addressId')
    @UseGuards(AuthPermissionGuardV2())
    async delete(
      @Param('addressId') addressId: string,
      @Param('userId') userId: string): Promise<SimpleResponse> {
      try {
        Logger.log('--ENTER DELETE USER ADDRESS, USER ADDRESS CONTROLLER--');
        Logger.log(
          `file deleted: ` + JSON.stringify(addressId),
          'userAddress.controller',
        );
        await this.userAddressService.delete(addressId, userId);
  
        return {
          isSuccess: true,
        };
      } catch (error) {
        Logger.error(
          'delete address error ::: ' + JSON.stringify(error),
          'address.controller',
        );
        return Promise.reject(error);
      }
    }
  }