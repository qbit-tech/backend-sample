import {
    Controller,
    Get,
    Put,
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
    UploadedFile,
  } from '@nestjs/common';
  import {
    SponsorApiContract,
    SponsorFindAllRequest,
    SponsorFindAllResponse,
    SponsorFindOneResponse,
    SponsorCreateRequest,
    SponsorUpdateRequest,
    UpdateImageRequest,
    UpdateImageResponse,
  } from './sponsor.contract';
  import { SponsorService } from './sponsor.service';
  import { getErrorStatusCode } from '@qbit-tech/libs-utils';
  import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
  } from '@nestjs/swagger';
  import { FEATURE_PERMISSIONS } from '../permission/featureAndPermission/featureAndPermission.constant';
  import { CacheInterceptor } from '@nestjs/cache-manager';
  import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@qbit-tech/libs-uploader';
  
  @ApiTags('Sponsors')
  @Controller('sponsors')
  export class SponsorController implements SponsorApiContract {
    constructor(
      private sponsorService: SponsorService,
      private uploaderService: UploaderService,
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
    async findOne(@Param('sponsorId') sponsorId: string): Promise<any> {
      try {
        Logger.log('--ENTER FIND ONE SPONSOR CONTROLLER--');
        Logger.log('sponsor : ' + JSON.stringify(sponsorId), 'sponsor.controller');
        const result = await this.sponsorService.findOne(sponsorId);
        const fileSearchResult = await this.uploaderService.fileSearchByIds(
          [sponsorId],
        );
        Logger.log('sponsorImage : ' + JSON.stringify(fileSearchResult));
        return result;
      } catch (error) {
        Logger.log('find one sponsor error: ' + JSON.stringify(error));
        throw new HttpException(error, getErrorStatusCode(error));
      }
    }
  
    @ApiOperation({ summary: 'Create new sponsor' })
    @ApiBearerAuth()
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({ type: SponsorFindOneResponse })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          sponsorName: { type:'string' },
          sponsorUrl: { type:'string' }
        }
      }
    })
    @UseInterceptors(FileInterceptor('image'))
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
      return res;
    }

    @ApiOperation({ summary: 'Upload sponsor image' })
    @ApiBearerAuth()
    @Put()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          sponsorId: { type:'string' },
          image: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    })
    @ApiOkResponse({ type: SponsorFindOneResponse })
    @UseInterceptors(FileInterceptor('image'))
    async uploadSponsorImage(
      @Body() params: SponsorFindOneResponse,
      @UploadedFile() file
    ): Promise<any>{
      Logger.log('--UPLOAD SPONSOR IMAGE--');
      Logger.log('sponsor : ' + JSON.stringify(params.sponsorId), 'sponsor.controller');
      if(file){
        // const fileSearchResult = await this.uploaderService.fileSearchByTable(
        //   'sponsors',
        //   [params.sponsorId],
        // );
        // if (fileSearchResult.has(params.sponsorId)) {
        //   await this.uploaderService.deleteFileById(
        //     fileSearchResult.get(params.sponsorId)[0].fileId,
        //   );
        // }
        Logger.log('file added: ' + JSON.stringify(params.sponsorId), 'sponsor.controller');
        const uploadResult = await this.uploaderService.updateImage(
          'sponsors',
          params.sponsorId,
          file,
          {},
        );
        Logger.log(
          'file uploaded: ' + JSON.stringify(file), 'sponsor.controller'
        );

        Logger.log('--EXIT UPLOAD SPONSOR IMAGE--');
      }
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
        return this.sponsorService.update({
          ...params,
          sponsorId,
        });
      } catch (error) {
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
        // const fileSearchResult = await this.uploaderService.fileSearchByTable(
        //   'sponsors',
        //   [sponsorId],
        // );
        // if (fileSearchResult.has(sponsorId)) {
        //   await this.uploaderService.deleteFileById(
        //     fileSearchResult.get(sponsorId)[0].fileId,
        //   );
        // }
        return await this.sponsorService.delete(sponsorId);
      } catch (error) {
        // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        throw new HttpException(error, getErrorStatusCode(error));
      }
      
    }
  }
  