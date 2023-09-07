import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ArticleModel, ArticleProperties } from './article.entity';
import * as uuid from 'uuid';
import { Op } from 'sequelize';
import { ERRORS } from '../../core/error.constant';
import { generateResultPagination } from '@qbit-tech/libs-utils';

@Injectable
export class ArticleService {
    constructor(
        @InjectModel(ArticleModel)
        private readonly articleRepositories: typeof ArticleModel,
    ) { }

    async findAll(params: {
        search?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        count: number;
        prev: string;
        next: string;
        results: ArticleProperties[];
    }> {
        try {
            Logger.log('--ENTER FIND ALL ARTICLE SERVICE--');
            let where = {};

            params.search &&
                (where = {
                    ...where,
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${params.search}%` } },
                        { author: { [Op.iLike]: `%${params.search}%` } },
                        { category: { [Op.iLike]: `%${params.search}%` } },
                    ],
                });

            const options: any = {
                where,
                // include: [
                //   {
                //     model: EventModel,
                //     as: 'events',
                //   },
                // ],
                distinct: true,
                col: 'articleId',
            };

            const count = await this.articleRepositories.count({ ...options });
            const results = await this.articleRepositories.findAll({
                ...options,
                limit: params.limit,
                offset: params.offset,
                order: [['createdAt', 'DESC']],
            });

            Logger.log('results: ' + JSON.stringify(results), 'article.service');

            return {
                ...generateResultPagination(count, params),
                results: results.map((row) => row.get()),
            };
        } catch (error) {
            Logger.error(
                'findAll article::: error: ' + JSON.stringify(error),
                'article.service',
                'article.service',
            );
            return Promise.reject(error);
        }
    }

    async findOne(articleId: string): Promise<any> {
        try {
            Logger.log('--ENTER FIND ONE ARTICLE SERVICE--');
            const result = await this.articleRepositories.findOne({
                where: { articleId },
                // include: [
                //   {
                //     model: EventModel,
                //     as: 'events',
                //   },
                // ],
            });

            Logger.log('file found: ' + JSON.stringify(result), 'article.service');

            if (!result) {
                return Promise.reject({
                    statusCode: ERRORS.tag.tag_not_found.statusCode,
                    code: ERRORS.tag.tag_not_found.code,
                    message: ERRORS.tag.tag_not_found.message,
                });
            }
            // const name = result.tagName

            return result.get();
        } catch (error) {
            Logger.error(
                'findOne article::: error: ' + JSON.stringify(error),
                'article.service',
                'article.service',
            );
            return Promise.reject(error);
        }
    }

    async create(
        // req:any,
        params: Omit<ArticleProperties, 'createdAt' | 'updatedAt'>,
    ): Promise<ArticleProperties> {
        try {
            Logger.log('--ENTER CREATE ARTICLE SERVICE--');
            // const tagId = params.tagId ? params.tagId : uuidv4();
            const articleId = params.articleId ? params.articleId : uuid.v4();
            const result = await this.articleRepositories.create({
                articleId: articleId,
                title: params.title,
                content: params.content,
                author: params.author,
                category: params.category,
                thumbnail: params.thumbnail,
            });

            Logger.log('article created: ' + JSON.stringify(result), 'article.service');

            return result.get();
        } catch (error) {
            Logger.error('Failed create new article');
            Logger.error(error);
            return Promise.reject(error);
        }
    }

    async update(
        params: Omit<ArticleProperties, 'createdAt' | 'updatedAt'>,
    ): Promise<ArticleProperties> {
        try {
            Logger.log('--ENTER UPDATE ARTICLE SERVICE--');
            const [_, results] = await this.articleRepositories.update(params, {
                where: {
                    articleId: params.articleId,
                },
                returning: true,
            });

            Logger.log(
                'article updated: ' + JSON.stringify(results[0].get()),
                'article.service',
            );

            if (results && results.length > 0) {
                return results[0].get();
            } else {
                return null;
            }
        } catch (error) {
            Logger.error(
                'update article::: error: ' + JSON.stringify(error),
                'article.service',
                'article.service',
            );
            return Promise.reject(error);
        }
    }

    async delete(articleId: string): Promise<{
        isSuccess: boolean;
    }> {
        try {
            Logger.log('--ENTER DELETE ARTICLE SERVICE--');
            const findArticle = await this.findOne(articleId);

            // if (findTag.events?.length > 0) {
            //   await this.eventTagService.deleteBytagId(tagId);
            // }

            const result = await this.articleRepositories.destroy({ where: { articleId } });

            Logger.log('article deleted: ' + JSON.stringify(result), 'article.service');

            return {
                isSuccess: true,
            };
            // }
        } catch (error) {
            Logger.error(
                'delete article::: error: ' + JSON.stringify(error),
                'article.service',
                'article.service',
            );
            return Promise.reject(error);
        }
    }
}