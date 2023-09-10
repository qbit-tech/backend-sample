import {
    Body,
    Controller,
    Put,
    UseInterceptors,
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
import {
    ArticleApiContract,
    ArticleFindAllRequest,
    ArticleFindAllResponse,
    ArticleFindOneResponse,
    ArticleCreateRequest,
    ArticleUpdateRequest,
    UpdateThumbnailResponse,
} from './article.contract';
import { ArticleService } from './article.service';
import { getErrorStatusCode, AppRequest, SimpleResponse } from '@qbit-tech/libs-utils';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import { FEATURE_PERMISSIONS } from '../../featureAndPermission/featureAndPermission.constant';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController implements ArticleApiContract {
    constructor(
        private readonly articleService: ArticleService, // private readonly eventLogService: EventLogService,
    ) { }

    @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: 'Find all event articles' })
    @Get()
    @ApiOkResponse({ type: ArticleFindAllResponse })
    async findAll(
        @Query() params: ArticleFindAllRequest,
    ): Promise<any> {
        try {
            Logger.log('--ENTER FIND ALL ARTICLE CONTROLLER--');
            Logger.log('article : ' + JSON.stringify(params), 'article.controller');
            return await this.articleService.findAll(params);
        } catch (error) {
            // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }

    @ApiOperation({ summary: 'Find one event article' })
    @Get(':articleId')
    // @UseGuards(
    //     AuthPermissionGuard(
    //         FEATURE_PERMISSIONS.TAG.__type,
    //         FEATURE_PERMISSIONS.TAG.DETAIL.__type,
    //     ),
    // )
    @ApiOkResponse({ type: ArticleFindOneResponse })
    async findOne(@Param('articleId') articleId: string): Promise<ArticleFindOneResponse> {
        try {
            Logger.log('--ENTER FIND ONE ARTICLE CONTROLLER--');
            Logger.log('article : ' + JSON.stringify(articleId), 'article.controller');
            const result = await this.articleService.findOne(articleId);
            return result.articleName;
        } catch (error) {
            Logger.log('find one article error: ' + JSON.stringify(error));
            // throw new HttpException(error, error.code);
            // throw new HttpException(
            //   {
            //     code: 'failed_create_article',
            //     message: error,
            //   },
            //   422,
            // );
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }

    @ApiOperation({ summary: 'Create new event article' })
    @ApiBearerAuth()
    @Post()
    // @UseGuards(
    //     AuthPermissionGuard(
    //         FEATURE_PERMISSIONS.TAG.__type,
    //         FEATURE_PERMISSIONS.TAG.CREATE.__type,
    //     ),
    // )
    // @UseGuards(AuthPermissionGuard())
    @ApiOkResponse({ type: ArticleFindOneResponse })
    async create(
        // @Req() req: AppRequest,
        @Body() params: ArticleCreateRequest,
    ): Promise<ArticleFindOneResponse> {
        // try {
        Logger.log('--ENTER CREATE TAG CONTROLLER--');
        Logger.log('article : ' + JSON.stringify(params), 'article.controller');

        const res = await this.articleService.create(
            // req,
            params,
        );

        // await this.eventLogService.create({
        //   articleId: req.article.articleId,
        //   dataId: res.articleId,
        //   action: ELogAction.CREATE_TAG,
        //   metaUser: req.article,
        //   dataAfter: res,
        //   note: `${req.article.name} create article ${res.articleName}`
        // })

        return res;
        // } catch (error) {
        //   Logger.error(error);
        // throw new HttpException(
        //   {
        //     code: 'failed_create_article',
        //     message: error,
        //   },
        //   422,
        // );
        // throw new HttpException(error, getErrorStatusCode(error));
        // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        // return Promise.reject(error.message);
        // }
    }

    @ApiOperation({ summary: 'Update event article' })
    @ApiBearerAuth()
    @Patch(':articleId')
    // @UseGuards(
    //     AuthPermissionGuard(
    //         FEATURE_PERMISSIONS.TAG.__type,
    //         FEATURE_PERMISSIONS.TAG.UPDATE.__type,
    //     ),
    // )
    // @UseGuards(AuthPermissionGuard())
    @ApiOkResponse({ type: ArticleFindOneResponse })
    async update(
        // @Req() req: AppRequest,
        @Param('articleId') articleId: string,
        @Body() params: ArticleUpdateRequest,
    ): Promise<ArticleFindOneResponse> {
        try {
            Logger.log('--ENTER UPDATE TAG CONTROLLER--');
            Logger.log('article : ' + JSON.stringify(articleId), 'article.controller');

            const findDataBefore = await this.articleService.findOne(articleId);

            const res = await this.articleService.update({
                ...params,
                articleId,
            });

            // await this.eventLogService.create({
            //   articleId: req.article.articleId,
            //   dataId: articleId,
            //   action: ELogAction.UPDATE_TAG,
            //   metaUser: req.article,
            //   dataBefore: findDataBefore,
            //   dataAfter: res,
            //   note: `${req.article.name} update article ${res.articleName}`
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

    @ApiOperation({ summary: 'Delete single article' })
    @ApiBearerAuth()
    @Delete(':articleId')
    // @UseGuards(
    //     AuthPermissionGuard(
    //         FEATURE_PERMISSIONS.TAG.__type,
    //         FEATURE_PERMISSIONS.TAG.DELETE.__type,
    //     ),
    // )
    // @UseGuards(AuthPermissionGuard())
    // @ApiOkResponse({type: SimpleResponse})
    async delete(
        // @Req() req: AppRequest,
        @Param('articleId') articleId: string,
    ): Promise<any> {
        try {
            Logger.log('--ENTER DELETE TAG CONTROLLER--');
            Logger.log('article : ' + JSON.stringify(articleId), 'article.controller');

            // const findDataBefore = await this.articleService.findOne(articleId);

            // await this.eventLogService.create({
            //   articleId: req.article.articleId,
            //   dataId: articleId,
            //   action: ELogAction.HARD_DELETE_TAG,
            //   metaUser: req.article,
            //   dataBefore: findDataBefore,
            //   note: `${req.article.name} delete article ${findDataBefore.articleName}`
            // })

            return await this.articleService.delete(articleId);
        } catch (error) {
            // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }

    @ApiOperation({
        summary:
            'Change thumbnail by articleId',
    })
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
    @ApiBearerAuth()
    @Put(':articleId/thumbnail')
    // @UseGuards(AuthPermissionGuard())
    @UseInterceptors(FileInterceptor('image'))
    @ApiOkResponse({ type: UpdateThumbnailResponse })
    async updateThumbnail(
        @Param('articleId') articleId: string,
        @UploadedFile() file,
        @Req() req: AppRequest,
    ): Promise<UpdateThumbnailResponse> {
        try {
            Logger.log('Update article: ' + articleId);
            let uid = articleId;
            if (articleId === 'me') {
                uid = req.user.userId;
            }

            return file.path


        } catch (err) {
            console.info('error: ', err);
        }
    }
}
