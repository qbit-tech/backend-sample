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
  CreateArticlesRequest,
  FindAllArticlesRequest,
  FindAllArticlesResponse,
  FindOneArticlesResponse,
  ArticlesApiContract,
  DeleteArticlesResponse,
  UpdateArticlesRequest,
  UpdateArticlesResponse,
  SimpleResponse,
} from './articles.contract';
// import { AuthPermissionGuard } from '../../core/authPermission.guard';
// import { FEATURE_PERMISSIONS } from '../permission/featureAndPermission/featureAndPermission.constant';
import { AuthPermissionGuard } from '@qbit-tech/libs-session';
import { ArticlesService } from './articles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@qbit-tech/libs-uploader';
import { AppRequest } from '@qbit-tech/libs-utils';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController implements ArticlesApiContract {
  constructor(
    private readonly articlesService: ArticlesService,
    private uploaderService: UploaderService,
    // readonly authSessionService: AuthSessionService,
  ) {}

  @Get()
  @ApiResponse({ type: FindAllArticlesResponse })
  async findAll(
    @Query() query: FindAllArticlesRequest,
  ): Promise<FindAllArticlesResponse> {
    try {
      Logger.log('---START ARTICLES CONTROLLER, FIND ALL---');

      Logger.log(
        'findAll:::query: ' + JSON.stringify(query),
        'articles.controller',
      );

      const resArticles = await this.articlesService.findAll({
        ...query,
      });

      return {
        ...resArticles,
      };
    } catch (err) {
      Logger.error(
        'findAll:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Get(':articleId')
  @ApiResponse({ type: FindOneArticlesResponse })
  async findOne(
    @Param('articleId') articleId: string,
  ): Promise<FindOneArticlesResponse | SimpleResponse> {
    Logger.log('---START ARTICLES CONTROLLER, FIND ONE---');

    Logger.log(
      'findOne:::articleId: ' + JSON.stringify(articleId),
      'articles.controller',
    );
    try {
      const res = await this.articlesService.findOne(articleId);

      if (res) {
        return {
          ...res,
        };
      } else {
        Logger.error(`articleId: ${articleId} not found`);
        throw new NotFoundException('Not Found');
      }
    } catch (err) {
      Logger.error(
        'findOne:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: FindOneArticlesResponse })
  // @UseGuards(AuthPermissionGuard())
  async create(
    @Body() body: CreateArticlesRequest,
    @Req() req: AppRequest,
  ): Promise<FindOneArticlesResponse> {
    try {
      Logger.log('---START ARTICLES CONTROLLER, CREATE---');

      Logger.log(
        'create:::body: ' + JSON.stringify(body),
        'articles.controller',
      );

      const articles = await this.articlesService.create(
        {
          ...body,
        },
        req,
      );

      return articles;
    } catch (err) {
      Logger.error(
        'create:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @ApiBearerAuth()
  @Post('image/:articleId')
  // @UseGuards(AuthPermissionGuard())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @Param('articleId') articleId: string,
    @UploadedFile() file,
  ): Promise<any> {
    try {
      Logger.log('---START ARTICLES CONTROLLER, UPLOAD---');

      Logger.log(
        'upload:::articleId: ' + JSON.stringify(articleId),
        'articles.controller',
      );

      if (file) {
        const res = await this.uploaderService.updateImage(
          'articles',
          articleId,
          file,
        );
        return await this.articlesService.uploadImage(
          articleId,
          res.payload.filePath,
          res.payload.fileLinkCache,
        );
      } else {
        throw new HttpException(
          {
            code: 'error_not_found',
            message: 'Image not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      Logger.error(
        'upload:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Patch(':articleId')
  @ApiBearerAuth()
  // @UseGuards(AuthPermissionGuard())
  async update(
    @Param('articleId') articleId: string,
    @Body() body: UpdateArticlesRequest,
  ): Promise<UpdateArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES CONTROLLER, UPDATE---');

      Logger.log(
        'update:::articleId: ' + JSON.stringify(articleId),
        'articles.controller',
      );

      return await this.articlesService.update(articleId, {
        ...body,
      });
    } catch (err) {
      Logger.error(
        'update:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Delete(':articleId')
  @ApiBearerAuth()
  // @UseGuards(AuthPermissionGuard())
  async remove(
    @Param('articleId') articleId: string,
  ): Promise<DeleteArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES CONTROLLER, REMOVE---');

      Logger.log(
        'remove:::articleId: ' + JSON.stringify(articleId),
        'articles.controller',
      );

      return await this.articlesService.remove(articleId);
    } catch (err) {
      Logger.error(
        'remove:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }

  @Delete('image/:articleId')
  @ApiBearerAuth()
  // @UseGuards(AuthPermissionGuard())
  async removeImage(
    @Param('articleId') articleId: string,
  ): Promise<DeleteArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES CONTROLLER, REMOVE IMAGE---');

      Logger.log(
        'remove:::articleId: ' + JSON.stringify(articleId),
        'articles.controller',
      );

      return await this.articlesService.removeImage(articleId);
    } catch (err) {
      Logger.error(
        'removeImage:::ERROR: ' + JSON.stringify(err),
        'articles.controller',
        'articles.controller',
      );
      throw new HttpException(err, 500);
    }
  }
}