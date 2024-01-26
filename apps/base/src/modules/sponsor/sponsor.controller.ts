import {
    Controller,
    Get,
    Query,
    Param,
    Logger,
    Post,
    Patch,
    Body,
    Delete,
    HttpException,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import {
    SponsorApiContract,
    SponsorFindAllRequest,
    SponsorFindAllResponse,
    SponsorFindOneResponse,
    SponsorCreateRequest,
    SponsorUpdateRequest,
  } from './sponsor.contract';
  import { SponsorService } from './sponsor.service';
  import { getErrorStatusCode } from '@qbit-tech/libs-utils';
  import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { FEATURE_PERMISSIONS } from '../permission/featureAndPermission/featureAndPermission.constant';
  import { CacheInterceptor } from '@nestjs/cache-manager';
  import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
  
  @ApiTags('Sponsors')
  @Controller('sponsors')
  export class SponsorController implements SponsorApiContract {
    constructor(
      private readonly sponsorService: SponsorService, // private readonly eventLogService: EventLogService,
    ) {}
  
    // @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: 'Find all sponsors' })
    @ApiBearerAuth()
    @Get()
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.LIST']))
    @ApiOkResponse({ type: SponsorFindAllResponse })
    async findAll(
      @Query() params: SponsorFindAllRequest,
      // ): Promise<TagFindAllResponse> {
    ): Promise<any> {
      try {
        Logger.log('--ENTER FIND ALL SPONSOR CONTROLLER--');
        Logger.log('sponsor : ' + JSON.stringify(params), 'sponsor.controller');
        return await this.sponsorService.findAll(params);
      } catch (error) {
        // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        throw new HttpException(error, getErrorStatusCode(error));
      }
    }
  
    @ApiOperation({ summary: 'Find one sponsor' })
    @Get(':sponsorId')
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.DETAIL']))
    @ApiOkResponse({ type: SponsorFindOneResponse })
    async findOne(@Param('sponsorId') sponsorId: string): Promise<SponsorFindOneResponse> {
      try {
        Logger.log('--ENTER FIND ONE SPONSOR CONTROLLER--');
        Logger.log('sponsor : ' + JSON.stringify(sponsorId), 'sponsor.controller');
        const result = await this.sponsorService.findOne(sponsorId);
        return result.sponsorName;
      } catch (error) {
        Logger.log('find one sponsor error: ' + JSON.stringify(error));
        // throw new HttpException(error, error.code);
        // throw new HttpException(
        //   {
        //     code: 'failed_create_tag',
        //     message: error,
        //   },
        //   422,
        // );
        throw new HttpException(error, getErrorStatusCode(error));
      }
    }
  
    @ApiOperation({ summary: 'Create new sponsor' })
    @ApiBearerAuth()
    @Post()
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.CREATE']))
    @ApiOkResponse({ type: SponsorFindOneResponse })
    async create(
      // @Req() req: AppRequest,
      @Body() params: SponsorCreateRequest,
    ): Promise<SponsorFindOneResponse> {
      // try {
      Logger.log('--ENTER CREATE SPONSOR CONTROLLER--');
      Logger.log('sponsor : ' + JSON.stringify(params), 'sponsor.controller');
  
      const res = await this.sponsorService.create(
        // req,
        params,
      );
  
      // await this.eventLogService.create({
      //   userId: req.user.userId,
      //   dataId: res.sponsorId,
      //   action: ELogAction.CREATE_TAG,
      //   metaUser: req.user,
      //   dataAfter: res,
      //   note: `${req.user.name} create tag ${res.tagName}`
      // })
  
      return res;
      // } catch (error) {
      //   Logger.error(error);
      // throw new HttpException(
      //   {
      //     code: 'failed_create_tag',
      //     message: error,
      //   },
      //   422,
      // );
      // throw new HttpException(error, getErrorStatusCode(error));
      // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      // return Promise.reject(error.message);
      // }
    }
  
    @ApiOperation({ summary: 'Update sponsor' })
    @ApiBearerAuth()
    @Patch(':sponsorId')
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.UPDATE']))
    @ApiOkResponse({ type: SponsorFindOneResponse })
    async update(
      // @Req() req: AppRequest,
      @Param('sponsorId') sponsorId: string,
      @Body() params: Omit<SponsorUpdateRequest, 'sponsorId'>,
    ): Promise<SponsorFindOneResponse> {
      try {
        Logger.log('--ENTER UPDATE SPONSOR CONTROLLER--');
        Logger.log('sponsor : ' + JSON.stringify(sponsorId), 'sponsor.controller');
  
        const findDataBefore = await this.sponsorService.findOne(sponsorId);
  
        const res = await this.sponsorService.update({
          ...params,
          sponsorId,
        });
  
        // await this.eventLogService.create({
        //   userId: req.user.userId,
        //   dataId: sponsorId,
        //   action: ELogAction.UPDATE_TAG,
        //   metaUser: req.user,
        //   dataBefore: findDataBefore,
        //   dataAfter: res,
        //   note: `${req.user.name} update tag ${res.tagName}`
        // })
  
        return res;
      } catch (error) {
        // throw new HttpException(
        //   { message: error.errors },
        //   HttpStatus.BAD_REQUEST,
        // );
        throw new HttpException(error, getErrorStatusCode(error));
      }
    }
  
    @ApiOperation({ summary: 'Delete single sponsor' })
    // @ApiBearerAuth()
    @Delete(':sponsorId')
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.DELETE']))
    async delete(
      // @Req() req: AppRequest,
      @Param('sponsorId') sponsorId: string,
    ): Promise<any> {
      try {
        Logger.log('--ENTER DELETE SPONSOR CONTROLLER--');
        Logger.log('sponsor : ' + JSON.stringify(sponsorId), 'sponsor.controller');
  
        // const findDataBefore = await this.sponsorService.findOne(sponsorId);
  
        // await this.eventLogService.create({
        //   userId: req.user.userId,
        //   dataId: sponsorId,
        //   action: ELogAction.HARD_DELETE_TAG,
        //   metaUser: req.user,
        //   dataBefore: findDataBefore,
        //   note: `${req.user.name} delete tag ${findDataBefore.tagName}`
        // })
  
        return await this.sponsorService.delete(sponsorId);
      } catch (error) {
        // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        throw new HttpException(error, getErrorStatusCode(error));
      }
    }
  }
  