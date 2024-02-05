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
    @ApiConsumes('multipart/form-data')
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.CREATE']))
    @ApiOkResponse({ type: SponsorFindOneResponse })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          sponsorName: { type:'string' },
          sponsorUrl: { type:'string' },
          image: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    })
    @UseInterceptors(FileInterceptor('image'))
    async create(
      // @Req() req: AppRequest,
      @Body() params: SponsorCreateRequest,
      @UploadedFile() file,
    ): Promise<SponsorFindOneResponse> {
      // try {
      Logger.log('--ENTER CREATE SPONSOR CONTROLLER--');
      Logger.log('sponsor : ' + JSON.stringify(params), 'sponsor.controller');
  
      const res = await this.sponsorService.create(
        // req,
        params,
      );

      if(file){
        Logger.log('file added: ' + JSON.stringify(params), 'sponsor.controller');
        const uploadResult = await this.uploaderService.fileUploaded({
          tableName: 'sponsors',
          tableId: res.sponsorId,
          filePath: file['key'],
          metadata: {},
        });
        Logger.log(
          'file uploaded: ' + JSON.stringify(file), 'sponsor.controller'
        );
        Logger.log('--EXIT CREATE SPONSOR CONTROLLER--');
        await this.sponsorService.updateSponsorImage({
          sponsorId: res.sponsorId,
          sponsorImageUrl: file ? uploadResult.fileLinkCache : null,
        });
      }
      return res;
    }
  
    @ApiOperation({ summary: 'Update sponsor' })
    @ApiBearerAuth()
    @Patch(':sponsorId')
    // @UseGuards(AuthPermissionGuardV2(['SPONSOR.UPDATE']))
    @ApiOkResponse({ type: SponsorFindOneResponse })
    @UseInterceptors(FileInterceptor('image'))
    async update(
      // @Req() req: AppRequest,
      @Param('sponsorId') sponsorId: string,
      @Body() params: Omit<SponsorUpdateRequest, 'sponsorId'>,
      @UploadedFile() file,
    ): Promise<SponsorFindOneResponse> {
      try {
        Logger.log('--ENTER UPDATE SPONSOR CONTROLLER--');
        Logger.log('sponsor : ' + JSON.stringify(sponsorId), 'sponsor.controller');
  
        const findDataBefore = await this.sponsorService.findOne(sponsorId);

        if(file){
          const imageResult = await this.updateImage({
            file,
            sponsorId,
          });
          return this.sponsorService.update({
            ...params,
            sponsorId,
            sponsorImageUrl: imageResult.payload.fileLinkCache
          })
        }
        return this.sponsorService.update({
          ...params,
          sponsorId,
        });
      } catch (error) {
        throw new HttpException(error, getErrorStatusCode(error));
      }
    }

    async updateImage(request: UpdateImageRequest): Promise<UpdateImageResponse> {
      try {
        const fileSearchResult = await this.uploaderService.fileSearchByTable(
          'sponsors',
          [request.sponsorId],
        );
  
        const uploadResult = await this.uploaderService.fileUploaded({
          tableName: 'sponsors',
          tableId: request.sponsorId,
          filePath: request.file['key'],
          metadata: {},
        });
  
        if (fileSearchResult.has(request.sponsorId)) {
          await this.uploaderService.deleteFileById(
            fileSearchResult.get(request.sponsorId)[0].fileId,
          );
        }
  
        return { isSuccess: true, payload: uploadResult };
      } catch (err) {
        console.log('err_sponsor: updateImage', err);
        return { isSuccess: false, payload: null };
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
  