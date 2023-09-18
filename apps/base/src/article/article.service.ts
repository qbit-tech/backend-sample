import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ArticleModel } from './article.entity';
import { CreateArticleDto } from './dto/create.article.dto';
import { UpdateArticleDto } from './dto/update.article.dto';
import * as fsp from 'fs/promises';

@Injectable()
export class ArticleService {
  private imageDir: string = './images';
  constructor(
    @InjectModel(ArticleModel)
    private readonly articleRepository: typeof ArticleModel,
  ) {}

  async createArticle(
    newArticle: CreateArticleDto,
    filename?: string,
    coverImageFile?: Buffer,
  ): Promise<ArticleModel> {
    if (!newArticle.title || !newArticle.authorId || !newArticle.content) {
      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_create',
        message: `please complete the create article payload`,
      });
    }

    try {
      let imagePathname: string;

      if (filename && coverImageFile) {
        imagePathname = `${this.imageDir}/${filename}`;

        await this.checkDir();

        await fsp.writeFile(imagePathname, coverImageFile);
      }

      const [article, created] = await this.articleRepository.findOrCreate({
        where: {
          title: newArticle.title,
        },
        defaults: {
          ...newArticle,
          coverImage: imagePathname,
        },
      });

      if (created) {
        return article;
      }

      // delete cover when failed to create article
      if (imagePathname) {
        await fsp.rm(imagePathname);
      }

      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_create',
        message: `article with title ${newArticle.title} already exists, please use different title`,
      });
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async findAllWithPaginate(page: number): Promise<{
    totalPage: number;
    currentPage: number;
    articles: ArticleModel[];
  }> {
    if (page < 1) {
      page = 1;
    }

    const limit = 5;

    try {
      // order by newest article
      const articles = await this.articleRepository.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset: limit * (page - 1),
      });

      const totalArticle = await this.articleRepository.count();

      const totalPage = Math.ceil(totalArticle / limit);

      return {
        totalPage,
        currentPage: page,
        articles,
      };
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async findById(articleId: string): Promise<ArticleModel> {
    if (!articleId) {
      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_get',
        message: `article id is required`,
      });
    }

    try {
      // since article id is primary key
      const article = await this.articleRepository.findByPk(articleId);

      if (!article) {
        return Promise.reject({
          statusCode: 404,
          code: 'failed_to_get',
          message: `article not found`,
        });
      }
      return article;
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateArticle(
    articleId: string,
    article: UpdateArticleDto,
  ): Promise<ArticleModel> {
    if (!articleId) {
      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_update',
        message: `article id is required`,
      });
    }

    if (!article.title || !article.content) {
      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_update',
        message: `title and content can't be empty`,
      });
    }

    try {
      const isArticleExists = await this.articleRepository.findByPk(articleId);

      if (!isArticleExists) {
        return Promise.reject({
          statusCode: 404,
          code: 'failed_to_update',
          message: `article not found`,
        });
      }

      const [_, [updatedArticle]] = await this.articleRepository.update(
        { ...article },
        {
          where: {
            id: articleId,
          },
          returning: true,
        },
      );

      return updatedArticle;
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateCoverImage(
    articleId: string,
    newCoverName: string,
    newCoverImage: Buffer,
  ): Promise<ArticleModel> {
    if (!articleId || !newCoverImage) {
      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_update',
        message: `article id and cover image is required`,
      });
    }

    try {
      const article = await this.articleRepository.findByPk(articleId);

      if (!article) {
        return Promise.reject({
          statusCode: 404,
          code: 'failed_to_update',
          message: `article not found`,
        });
      }

      if (article.coverImage) {
        await this.checkDir();

        try {
          await fsp.readFile(article.coverImage);

          await fsp.rm(article.coverImage);
        } catch (_) {}
      }

      const imagePath = `${this.imageDir}/${newCoverName}`;

      await fsp.writeFile(imagePath, newCoverImage);

      const [_, [updatedArticle]] = await this.articleRepository.update(
        { coverImage: imagePath },
        {
          where: {
            id: articleId,
          },
          returning: true,
        },
      );

      return updatedArticle;
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async deleteById(articleId: string): Promise<string> {
    if (!articleId) {
      return Promise.reject({
        statusCode: 400,
        code: 'failed_to_delete',
        message: `article id is required`,
      });
    }

    try {
      const rowsAffected = await this.articleRepository.destroy({
        where: {
          id: articleId,
        },
      });

      if (rowsAffected === 0) {
        return Promise.reject({
          statusCode: 404,
          code: 'failed_to_delete',
          message: `article with id ${articleId} not found`,
        });
      }

      return 'Success delete article';
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async checkDir() {
    try {
      await fsp.readdir(this.imageDir.replace('./', ''));
    } catch (error) {
      await fsp.mkdir(this.imageDir, { recursive: true });
    }
  }
}
