import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateMasterArticleTagsRequest,
  FindAllMasterArticleTagsRequest,
  FindAllMasterArticleTagsResponse,
  FindOneMasterArticleTagsResponse,
  MasterArticleTagsApiContract,
  DeleteMasterArticleTagsResponse,
  UpdateMasterArticleTagsRequest,
  UpdateMasterArticleTagsResponse,
  SimpleResponse,
} from './masterArticleTags.contract';
// import { AuthPermissionGuard } from '../../core/authPermission.guard';
// import { FEATURE_PERMISSIONS } from '../permission/featureAndPermission/featureAndPermission.constant';
import { AuthPermissionGuard } from '@qbit-tech/libs-session';
import { MasterArticleTagsService } from './masterArticleTags.service';

@ApiTags('Master Article Tags')
@Controller('master-article-tags')
export class MasterArticleTagsController
  implements MasterArticleTagsApiContract
{
  constructor(
    private readonly masterArticleTagsService: MasterArticleTagsService,
  ) {}

  @Get()
  @ApiResponse({ type: FindAllMasterArticleTagsResponse })
  async findAll(
    @Query() query: FindAllMasterArticleTagsRequest,
  ): Promise<FindAllMasterArticleTagsResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS CONTROLLER, FIND ALL---');

      Logger.log(
        'findAll:::query: ' + JSON.stringify(query),
        'masterArticleTags.controller',
      );

      const resMasterArticleTags = await this.masterArticleTagsService.findAll({
        ...query,
      });

      return {
        ...resMasterArticleTags,
      };
    } catch (err) {
      Logger.error(
        'findAll:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.controller',
        'masterArticleTags.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Get(':tagId')
  @ApiResponse({ type: FindOneMasterArticleTagsResponse })
  async findOne(
    @Param('tagId') tagId: string,
  ): Promise<FindOneMasterArticleTagsResponse | SimpleResponse> {
    Logger.log('---START MASTER ARTICLE TAGS CONTROLLER, FIND ONE---');

    Logger.log(
      'findOne:::tagId: ' + JSON.stringify(tagId),
      'masterArticleTags.controller',
    );
    try {
      const res = await this.masterArticleTagsService.findOne(tagId);

      if (res) {
        return {
          ...res,
        };
      } else {
        Logger.error(`tagId: ${tagId} not found`);
        throw new NotFoundException('Not Found');
      }
    } catch (err) {
      Logger.error(
        'findOne:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.controller',
        'masterArticleTags.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: FindOneMasterArticleTagsResponse })
  @UseGuards(AuthPermissionGuard())
  async create(
    @Body() body: CreateMasterArticleTagsRequest,
  ): Promise<FindOneMasterArticleTagsResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS CONTROLLER, CREATE---');

      Logger.log(
        'create:::body: ' + JSON.stringify(body),
        'masterArticleTags.controller',
      );

      const masterArticleTags = await this.masterArticleTagsService.create({
        ...body,
      });

      return masterArticleTags;
    } catch (err) {
      Logger.error(
        'create:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.controller',
        'masterArticleTags.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Patch(':tagId')
  @ApiBearerAuth()
  @UseGuards(AuthPermissionGuard())
  async update(
    @Param('tagId') tagId: string,
    @Body() body: UpdateMasterArticleTagsRequest,
  ): Promise<UpdateMasterArticleTagsResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS CONTROLLER, UPDATE---');

      Logger.log(
        'update:::tagId: ' + JSON.stringify(tagId),
        'masterArticleTags.controller',
      );

      return await this.masterArticleTagsService.update(tagId, {
        ...body,
      });
    } catch (err) {
      Logger.error(
        'update:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.controller',
        'masterArticleTags.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Delete(':tagId')
  @ApiBearerAuth()
  @UseGuards(AuthPermissionGuard())
  async remove(
    @Param('tagId') tagId: string,
  ): Promise<DeleteMasterArticleTagsResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS CONTROLLER, REMOVE---');

      Logger.log(
        'remove:::tagId: ' + JSON.stringify(tagId),
        'masterArticleTags.controller',
      );

      return await this.masterArticleTagsService.remove(tagId);
    } catch (err) {
      Logger.error(
        'remove:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.controller',
        'masterArticleTags.controller',
      );
      throw new HttpException(err, 500);
    }
  }
}
