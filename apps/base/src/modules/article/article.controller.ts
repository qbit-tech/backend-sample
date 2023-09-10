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
    ArticleApiContract,
    ArticleFindAllRequest,
    ArticleFindAllResponse,
    ArticleFindOneResponse,
    ArticleCreateRequest,
    ArticleUpdateRequest,
} from './article.contract';
import { ArticleService } from './article.service';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import { FEATURE_PERMISSIONS } from '../../featureAndPermission/featureAndPermission.constant';
import { CacheInterceptor } from '@nestjs/cache-manager';

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
        //   userId: req.user.userId,
        //   dataId: res.articleId,
        //   action: ELogAction.CREATE_TAG,
        //   metaUser: req.user,
        //   dataAfter: res,
        //   note: `${req.user.name} create article ${res.articleName}`
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
            //   userId: req.user.userId,
            //   dataId: articleId,
            //   action: ELogAction.UPDATE_TAG,
            //   metaUser: req.user,
            //   dataBefore: findDataBefore,
            //   dataAfter: res,
            //   note: `${req.user.name} update article ${res.articleName}`
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
            //   userId: req.user.userId,
            //   dataId: articleId,
            //   action: ELogAction.HARD_DELETE_TAG,
            //   metaUser: req.user,
            //   dataBefore: findDataBefore,
            //   note: `${req.user.name} delete article ${findDataBefore.articleName}`
            // })

            return await this.articleService.delete(articleId);
        } catch (error) {
            // throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }
}
