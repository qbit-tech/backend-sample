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
} from '@nestjs/common';
import {
  TagApiContract,
  TagFindAllRequest,
  TagFindAllResponse,
  TagFindOneResponse,
  TagCreateRequest,
  TagUpdateRequest,
} from './tag.contract';
import { TagService } from './tag.service';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import { FEATURE_PERMISSIONS } from '../../featureAndPermission/featureAndPermission.constant';

@ApiTags('Tags')
@Controller('tags')
export class TagController implements TagApiContract {
  constructor(
    private readonly tagService: TagService, // private readonly eventLogService: EventLogService,
  ) {}

  @ApiOperation({ summary: 'Find all event tags' })
  @Get()
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.TAG.__type,
      FEATURE_PERMISSIONS.TAG.LIST.__type,
    ),
  )
  @ApiOkResponse({ type: TagFindAllResponse })
  async findAll(
    @Query() params: TagFindAllRequest,
    // ): Promise<TagFindAllResponse> {
  ): Promise<any> {
    try {
      Logger.log('--ENTER FIND ALL TAG CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(params), 'tag.controller');
      return await this.tagService.findAll(params);
    } catch (error) {
      // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }

  @ApiOperation({ summary: 'Find one event tag' })
  @Get(':tagId')
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.TAG.__type,
      FEATURE_PERMISSIONS.TAG.DETAIL.__type,
    ),
  )
  @ApiOkResponse({ type: TagFindOneResponse })
  async findOne(@Param('tagId') tagId: string): Promise<TagFindOneResponse> {
    try {
      Logger.log('--ENTER FIND ONE TAG CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(tagId), 'tag.controller');
      const result = await this.tagService.findOne(tagId);
      return result.tagName;
    } catch (error) {
      Logger.log('find one tag error: ' + JSON.stringify(error));
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

  @ApiOperation({ summary: 'Create new event tag' })
  // @ApiBearerAuth()
  @Post()
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.TAG.__type,
      FEATURE_PERMISSIONS.TAG.CREATE.__type,
    ),
  )
  // @UseGuards(AuthPermissionGuard())
  @ApiOkResponse({ type: TagFindOneResponse })
  async create(
    // @Req() req: AppRequest,
    @Body() params: TagCreateRequest,
  ): Promise<TagFindOneResponse> {
    // try {
    Logger.log('--ENTER CREATE TAG CONTROLLER--');
    Logger.log('tag : ' + JSON.stringify(params), 'tag.controller');

    const res = await this.tagService.create(
      // req,
      params,
    );

    // await this.eventLogService.create({
    //   userId: req.user.userId,
    //   dataId: res.tagId,
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

  @ApiOperation({ summary: 'Update event tag' })
  // @ApiBearerAuth()
  @Patch(':tagId')
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.TAG.__type,
      FEATURE_PERMISSIONS.TAG.UPDATE.__type,
    ),
  )
  // @UseGuards(AuthPermissionGuard())
  @ApiOkResponse({ type: TagFindOneResponse })
  async update(
    // @Req() req: AppRequest,
    @Param('tagId') tagId: string,
    @Body() params: Omit<TagUpdateRequest, 'tagId'>,
  ): Promise<TagFindOneResponse> {
    try {
      Logger.log('--ENTER UPDATE TAG CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(tagId), 'tag.controller');

      const findDataBefore = await this.tagService.findOne(tagId);

      const res = await this.tagService.update({
        ...params,
        tagId,
      });

      // await this.eventLogService.create({
      //   userId: req.user.userId,
      //   dataId: tagId,
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

  @ApiOperation({ summary: 'Delete single tag' })
  // @ApiBearerAuth()
  @Delete(':tagId')
  @UseGuards(
    AuthPermissionGuard(
      FEATURE_PERMISSIONS.TAG.__type,
      FEATURE_PERMISSIONS.TAG.DELETE.__type,
    ),
  )
  // @UseGuards(AuthPermissionGuard())
  // @ApiOkResponse({type: SimpleResponse})
  async delete(
    // @Req() req: AppRequest,
    @Param('tagId') tagId: string,
  ): Promise<any> {
    try {
      Logger.log('--ENTER DELETE TAG CONTROLLER--');
      Logger.log('tag : ' + JSON.stringify(tagId), 'tag.controller');

      // const findDataBefore = await this.tagService.findOne(tagId);

      // await this.eventLogService.create({
      //   userId: req.user.userId,
      //   dataId: tagId,
      //   action: ELogAction.HARD_DELETE_TAG,
      //   metaUser: req.user,
      //   dataBefore: findDataBefore,
      //   note: `${req.user.name} delete tag ${findDataBefore.tagName}`
      // })

      return await this.tagService.delete(tagId);
    } catch (error) {
      // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(error, getErrorStatusCode(error));
    }
  }
}
