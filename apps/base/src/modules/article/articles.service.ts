import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateArticlesRequest,
  FindAllArticlesRequest,
  FindAllArticlesResponse,
  FindOneArticlesResponse,
  DeleteArticlesResponse,
  UpdateArticlesRequest,
  UpdateArticlesResponse,
  SimpleResponse,
} from './articles.contract';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { AppRequest, generateResultPagination } from '@qbit-tech/libs-utils';
import { ArticlesModel } from './articles.entity';
import { FileModel } from '@qbit-tech/libs-uploader/dist/uploader.entity';
import { UploaderService } from '@qbit-tech/libs-uploader';
import slugify from 'slugify';
import { MasterArticleCategoriesModel } from '../masterArticleCategories/masterArticleTags.entity';
import { ArticleTagsModel } from './articleTags.entity';
import { MasterArticleTagsModel } from '../masterArticleTags/masterArticleTags.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticlesModel)
    private readonly articlesRepositories: typeof ArticlesModel,
    @InjectModel(FileModel)
    private readonly fileModelRepositories: typeof FileModel,
    @InjectModel(ArticleTagsModel)
    private readonly articleTagsRepositories: typeof ArticleTagsModel,
    private uploaderService: UploaderService,
  ) {}

  async findAll(
    query: FindAllArticlesRequest,
  ): Promise<FindAllArticlesResponse> {
    try {
      Logger.log('---START ARTICLES SERVICE, FIND ALL---');

      Logger.log(
        'query: ' + JSON.stringify(query),
        'articles.service::findAll',
      );

      let where: any = {};
      let options: any = {};

      if (query.status) {
        where = {
          ...where,
          status: query.status,
        };
      }

      if (query.search) {
        where = {
          ...where,
          [Op.or]: [{ title: { [Op.iLike]: `%${query.search}%` } }],
        };
      }

      if (query.startAt && query.endAt) {
        where = {
          ...where,
          [Op.or]: [
            {
              updatedAt: {
                [Op.gte]: query.startAt,
                [Op.lte]: query.endAt,
              },
            },
          ],
        };
      }

      console.log('query.multipleCategory', query.multipleCategory);

      const categoryArray = Array.isArray(query.multipleCategory)
        ? query.multipleCategory
        : [query.multipleCategory];
      const categoryFilter = categoryArray.map((category) => ({
        name: category,
      }));
      options = {
        where,
        distinct: true,
        col: 'articleId',
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: MasterArticleCategoriesModel,
            as: 'category',
            ...(query.category
              ? {
                  where: {
                    name: query.category,
                  },
                }
              : {}),
          },
          {
            model: MasterArticleCategoriesModel,
            as: 'category',
            ...(query.multipleCategory
              ? {
                  where: {
                    [Op.or]: categoryFilter,
                  },
                }
              : {}),
          },
          {
            model: ArticleTagsModel,
            as: 'tags',
            include: [
              {
                model: MasterArticleTagsModel,
              },
            ],
          },
          // {
          //   model: MasterArticleTypeModel,
          //   as: 'type',
          // },
          // {
          //   model: UserModel,
          //   as: 'user',
          // },
        ],
      };

      const count: any = await this.articlesRepositories.count(options);

      if (query.limit || query.offset) {
        options = {
          ...options,
          limit: query.limit,
          offset: query.offset,
        };
      }

      const data = await this.articlesRepositories.findAll(options);

      Logger.log(`Results: ${JSON.stringify(data)}`);

      const generatePagination = generateResultPagination(count, query);

      let results = data.map((item) => item.get());
      const articleIds = data.map((item) => item.articleId);

      const fileImage = await this.uploaderService.fileSearchByTable(
        'articles',
        articleIds,
      );

      results = await Promise.all(
        results.map(async (result) => {
          const images = fileImage.get(result.articleId)
            ? fileImage.get(result.articleId)
            : [];

          images.sort((a: any, b: any) => b.createdAt - a.createdAt);

          const latestImage = images[0];

          return {
            ...result,
            images: latestImage
              ? [
                  {
                    fileId: latestImage.fileId,
                    imageUrl: latestImage.fileLinkCache,
                  },
                ]
              : [],
          };
        }),
      );

      return {
        ...generatePagination,
        results,
      };
    } catch (err) {
      Logger.error(
        'findAll:::ERROR: ' + JSON.stringify(err),
        'articles.service',
        'articles.service',
      );

      return Promise.reject(err);
    }
  }

  async findOne(
    articleId: string,
  ): Promise<FindOneArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES SERVICE, FIND ONE---');

      Logger.log(
        'articleId: ' + JSON.stringify(articleId),
        'articles.service::findOne',
      );

      const result = await this.articlesRepositories.findOne({
        where: {
          [Op.or]: [
            {
              articleId,
            },
            {
              slug: articleId,
            },
          ],
        },
        include: [
          {
            model: MasterArticleCategoriesModel,
            as: 'category',
          },
          {
            model: ArticleTagsModel,
            as: 'tags',
            include: [
              {
                model: MasterArticleTagsModel,
                as: 'tag',
              },
            ],
          },
          // {
          //   model: MasterArticleTypeModel,
          //   as: 'type',
          // },
          // {
          //   model: UserModel,
          //   as: 'user',
          // },
        ],
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        const data = result.get();

        const fileImages = await this.fileModelRepositories.findAll({
          where: {
            tableId: data.articleId,
          },
        });

        if (fileImages.length > 0) {
          fileImages.sort((a: any, b: any) => b.createdAt - a.createdAt);

          const latestImage = fileImages[0];

          data.images = [
            {
              fileId: latestImage.fileId,
              imageUrl: latestImage.fileLinkCache,
            },
          ];
        } else {
          data.images = [];
        }

        return {
          ...data,
        };
      } else {
        Logger.error(`articleId: ${articleId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `articleId: ${articleId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'findOne:::ERROR: ' + JSON.stringify(err),
        'articles.service',
        'articles.service',
      );

      return Promise.reject(err);
    }
  }

  async create(
    body: CreateArticlesRequest,
    req: AppRequest,
  ): Promise<FindOneArticlesResponse> {
    try {
      Logger.log('---START ARTICLES SERVICE, CREATE---');

      const result: any = await this.articlesRepositories.create({
        ...body,
        articleId: uuidv4(),
        slug: slugify(body.title, { lower: true, remove: /[*+~.(){}'"!:@]/g }),
        slugEn: slugify(body.titleEn, {
          lower: true,
          remove: /[*+~.(){}'"!:@]/g,
        }),
        createdByUserId: req?.user?.userId ? req?.user?.userId : body.createdByUserId,
      });

      if (body.tagIds && body.tagIds.length > 0) {
        const createTags = body.tagIds.map((tagId: string) => ({
          articleId: result.articleId,
          tagId,
        }));

        await this.articleTagsRepositories.bulkCreate(createTags);
      }

      Logger.log(`Success Create: ${JSON.stringify(result)}`);

      return result;
    } catch (err) {
      Logger.error(
        'create:::ERROR: ' + JSON.stringify(err),
        'articles.service',
        'articles.service',
      );

      return Promise.reject(err);
    }
  }

  async uploadImage(
    articleId: string,
    filePath: string,
    fileLinkCache: string,
  ): Promise<any> {
    try {
      Logger.log('---START ARTICLES SERVICE, UPLOAD IMAGE---');

      const resCreate = await this.fileModelRepositories.create({
        fileId: uuidv4(),
        tableName: 'articles',
        tableId: articleId,
        order: 1,
        filePath,
        fileLinkCache,
      });

      Logger.log(`Success Upload Image: ${JSON.stringify(resCreate)}`);

      return resCreate;
    } catch (error) {
      Logger.error(
        'createImages::: error: ' + JSON.stringify(error),
        'articles.service',
        'articles.service',
      );
      return Promise.reject(error);
    }
  }

  async update(
    articleId: string,
    body: Omit<UpdateArticlesRequest, 'articleId'>,
  ): Promise<UpdateArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES SERVICE, UPDATE---');

      Logger.log(
        'articleId: ' + JSON.stringify(articleId),
        'articles.service::update',
      );

      const result = await this.articlesRepositories.findOne({
        where: {
          articleId,
        },
      });

      if (result) {
        await this.articlesRepositories.update(
          {
            ...body,
            slug: slugify(body.title, {
              lower: true,
              remove: /[*+~.(){}'"!:@]/g,
            }),
            slugEn: slugify(body.titleEn, {
              lower: true,
              remove: /[*+~.(){}'"!:@]/g,
            }),
          },
          {
            where: { articleId },
          },
        );

        if (body.tagIds && body.tagIds.length > 0) {
          const result = await this.articlesRepositories.findOne({
            where: {
              articleId,
            },
          });

          await this.articleTagsRepositories.destroy({
            where: {
              articleId: result.articleId,
            },
          });

          const createTags = body.tagIds.map((tagId: string) => ({
            articleId: result.articleId,
            tagId,
          }));

          await this.articleTagsRepositories.bulkCreate(createTags);
        }

        const newData = await this.articlesRepositories.findOne({
          where: {
            articleId,
          },
        });

        Logger.log(`Success Update: ${JSON.stringify(newData)}`);

        return newData;
      } else {
        Logger.error(`articleId: ${articleId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `articleId: ${articleId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'update:::ERROR: ' + JSON.stringify(err),
        'articles.service',
        'articles.service',
      );

      return Promise.reject(err);
    }
  }

  async remove(
    articleId: string,
  ): Promise<DeleteArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES SERVICE, REMOVE---');

      Logger.log(
        'articleId: ' + JSON.stringify(articleId),
        'articles.service::remove',
      );

      const result = await this.articlesRepositories.findOne({
        where: { articleId },
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        await this.articlesRepositories.destroy({
          where: {
            articleId,
          },
        });

        await this.articleTagsRepositories.destroy({
          where: {
            articleId: result.articleId,
          },
        });

        await this.fileModelRepositories.destroy({
          where: {
            tableId: articleId,
          },
        });

        Logger.log(`Success Delete: ${articleId}`);

        return {
          isSuccess: true,
        };
      } else {
        Logger.error(`articleId: ${articleId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `articleId: ${articleId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'remove:::ERROR: ' + JSON.stringify(err),
        'articles.service',
        'articles.service',
      );

      return Promise.reject(err);
    }
  }

  async removeImage(
    articleId: string,
  ): Promise<DeleteArticlesResponse | SimpleResponse> {
    try {
      Logger.log('---START ARTICLES SERVICE, REMOVE IMAGE---');

      Logger.log(
        'articleId: ' + JSON.stringify(articleId),
        'articles.service::remove',
      );

      const result = await this.fileModelRepositories.findOne({
        where: { tableId: articleId },
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        await this.fileModelRepositories.destroy({
          where: {
            tableId: articleId,
          },
        });

        Logger.log(`Success Delete Image: ${articleId}`);

        return {
          isSuccess: true,
        };
      } else {
        Logger.error(`articleId: ${articleId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `articleId: ${articleId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'removeImage:::ERROR: ' + JSON.stringify(err),
        'articles.service',
        'articles.service',
      );

      return Promise.reject(err);
    }
  }
}