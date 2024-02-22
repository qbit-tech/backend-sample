import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateMasterArticleCategoriesRequest,
  FindAllMasterArticleCategoriesRequest,
  FindAllMasterArticleCategoriesResponse,
  FindOneMasterArticleCategoriesResponse,
  MasterArticleCategoriesApiContract,
  DeleteMasterArticleCategoriesResponse,
  UpdateMasterArticleCategoriesRequest,
  UpdateMasterArticleCategoriesResponse,
  SimpleResponse,
} from './masterArticleCategories.contract';
import { AuthPermissionGuardV2 } from '@qbit-tech/libs-session';
import { MasterArticleCategoriesService } from './masterArticleTags.service';

@ApiTags('Master Article Categories')
@Controller('master-article-categories')
export class MasterArticleCategoriesController
  implements MasterArticleCategoriesApiContract
{
  constructor(
    private readonly masterArticleCategoriesService: MasterArticleCategoriesService,
  ) {}

  @Get()
  @ApiResponse({ type: FindAllMasterArticleCategoriesResponse })
  async findAll(
    @Query() query: FindAllMasterArticleCategoriesRequest,
  ): Promise<FindAllMasterArticleCategoriesResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES CONTROLLER, FIND ALL---');

      Logger.log(
        'findAll:::query: ' + JSON.stringify(query),
        'masterArticleCategories.controller',
      );

      const resMasterArticleCategories =
        await this.masterArticleCategoriesService.findAll({
          ...query,
        });

      return {
        ...resMasterArticleCategories,
      };
    } catch (err) {
      Logger.error(
        'findAll:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.controller',
        'masterArticleCategories.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Get(':categoryId')
  @ApiResponse({ type: FindOneMasterArticleCategoriesResponse })
  async findOne(
    @Param('categoryId') categoryId: string,
  ): Promise<FindOneMasterArticleCategoriesResponse | SimpleResponse> {
    Logger.log('---START MASTER ARTICLE CATEGORIES CONTROLLER, FIND ONE---');

    Logger.log(
      'findOne:::categoryId: ' + JSON.stringify(categoryId),
      'masterArticleCategories.controller',
    );
    try {
      const res = await this.masterArticleCategoriesService.findOne(categoryId);

      if (res) {
        return {
          ...res,
        };
      } else {
        Logger.error(`categoryId: ${categoryId} not found`);
        throw new NotFoundException('Not Found');
      }
    } catch (err) {
      Logger.error(
        'findOne:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.controller',
        'masterArticleCategories.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: FindOneMasterArticleCategoriesResponse })
  @UseGuards(AuthPermissionGuardV2(['NEWS_ARTICLES.CREATE']))
  async create(
    @Body() body: CreateMasterArticleCategoriesRequest,
  ): Promise<FindOneMasterArticleCategoriesResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES CONTROLLER, CREATE---');

      Logger.log(
        'create:::body: ' + JSON.stringify(body),
        'masterArticleCategories.controller',
      );

      const masterArticleCategories =
        await this.masterArticleCategoriesService.create({
          ...body,
        });

      return masterArticleCategories;
    } catch (err) {
      Logger.error(
        'create:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.controller',
        'masterArticleCategories.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Patch(':categoryId')
  @ApiBearerAuth()
  @UseGuards(AuthPermissionGuardV2(['NEWS_ARTICLES.UPDATE']))
  async update(
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateMasterArticleCategoriesRequest,
  ): Promise<UpdateMasterArticleCategoriesResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES CONTROLLER, UPDATE---');

      Logger.log(
        'update:::categoryId: ' + JSON.stringify(categoryId),
        'masterArticleCategories.controller',
      );

      return await this.masterArticleCategoriesService.update(categoryId, {
        ...body,
      });
    } catch (err) {
      Logger.error(
        'update:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.controller',
        'masterArticleCategories.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Delete(':categoryId')
  @ApiBearerAuth()
  @UseGuards(AuthPermissionGuardV2(['NEWS_ARTICLES.DELETE']))
  async remove(
    @Param('categoryId') categoryId: string,
  ): Promise<DeleteMasterArticleCategoriesResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES CONTROLLER, REMOVE---');

      Logger.log(
        'remove:::categoryId: ' + JSON.stringify(categoryId),
        'masterArticleCategories.controller',
      );

      return await this.masterArticleCategoriesService.remove(categoryId);
    } catch (err) {
      Logger.error(
        'remove:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.controller',
        'masterArticleCategories.controller',
      );
      throw new HttpException(err, 500);
    }
  }
}
