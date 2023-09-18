import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleModel } from './article.entity';
import { CreateArticleDto } from './dto/create.article.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateArticleDto } from './dto/update.article.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'create new article' })
  @ApiHeader({
    name: 'Content-Type',
    description: 'multipart/form-data',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'success create article' })
  @Post()
  @UseInterceptors(FileInterceptor('cover-article'))
  async createArticle(
    @Body() body: CreateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 200000, message: 'Max 2 mb' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    coverImage?: Express.Multer.File,
  ): Promise<ArticleModel> {
    try {
      const article = await this.articleService.createArticle(
        body,
        coverImage?.originalname,
        coverImage?.buffer,
      );

      return article;
    } catch (error: any) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'get list of article' })
  @Get('paginate/:page')
  async findAllWithPaginate(
    @Param('page', ParseIntPipe) page: number,
  ): Promise<{
    totalPage: number;
    currentPage: number;
    articles: ArticleModel[];
  }> {
    try {
      const articles = await this.articleService.findAllWithPaginate(page);

      return articles;
    } catch (error: any) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'get spesific article' })
  @Get(':articleId')
  async findById(@Param('articleId') articleId: string): Promise<ArticleModel> {
    try {
      const article = await this.articleService.findById(articleId);

      return article;
    } catch (error: any) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'update article content and title' })
  @ApiHeader({
    name: 'Content-Type',
    description: 'application/json',
  })
  @ApiBearerAuth()
  @Patch(':articleId')
  async updateArticle(
    @Param('articleId') articleId: string,
    @Body() body: UpdateArticleDto,
  ): Promise<ArticleModel> {
    try {
      const article = await this.articleService.updateArticle(articleId, body);

      return article;
    } catch (error: any) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'update article cover image' })
  @ApiBearerAuth()
  @Patch('/cover/:articleId')
  @UseInterceptors(FileInterceptor('cover-article'))
  async updateCoverImage(
    @Param('articleId') articleId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/png',
        })
        .addMaxSizeValidator({
          maxSize: 200000,
          message: 'Max 2 mb',
        })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    coverImage: Express.Multer.File,
  ): Promise<ArticleModel> {
    try {
      const article = await this.articleService.updateCoverImage(
        articleId,
        coverImage.originalname,
        coverImage.buffer,
      );

      return article;
    } catch (error: any) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'delete article' })
  @ApiBearerAuth()
  @Delete(':articleId')
  async deleteById(@Param('articleId') articleId: string): Promise<Object> {
    try {
      const message = await this.articleService.deleteById(articleId);

      return { message };
    } catch (error: any) {
      throw new HttpException(
        error,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
