import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TagModel, TagProperties } from './tag.entity';
import * as uuid from 'uuid';
import { Op } from 'sequelize';
import { ERRORS } from '../../core/error.constant';
import { generateResultPagination } from '@qbit-tech/libs-utils';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(TagModel)
    private readonly tagRepositories: typeof TagModel,
  ) {}

  async findAll(params: {
    search?: string;
    offset?: number;
    limit?: number;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: TagProperties[];
  }> {
    try {
      Logger.log('--ENTER FIND ALL TAG SERVICE--');
      let where = {};

      params.search &&
        (where = {
          ...where,
          [Op.or]: [
            { tagName: { [Op.iLike]: `%${params.search}%` } },
            { description: { [Op.iLike]: `%${params.search}%` } },
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
        col: 'tagId',
      };

      const count = await this.tagRepositories.count({ ...options });
      const results = await this.tagRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'DESC']],
      });

      Logger.log('file found: ' + JSON.stringify(results), 'tag.service');

      return {
        ...generateResultPagination(count, params),
        results: results.map((row) => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll tag::: error: ' + JSON.stringify(error),
        'tag.service',
        'tag.service',
      );
      return Promise.reject(error);
    }
  }

  async findOne(tagId: string): Promise<any> {
    try {
      Logger.log('--ENTER FIND ONE TAG SERVICE--');
      const result = await this.tagRepositories.findOne({
        where: { tagId },
        // include: [
        //   {
        //     model: EventModel,
        //     as: 'events',
        //   },
        // ],
      });

      Logger.log('file found: ' + JSON.stringify(result), 'tag.service');

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
        'findOne tag::: error: ' + JSON.stringify(error),
        'tag.service',
        'tag.service',
      );
      return Promise.reject(error);
    }
  }

  async findOneByTagName(tagName: string): Promise<TagProperties> {
    try {
      Logger.log('--ENTER FIND ONE BY TAG NAME, TAG SERVICE--');
      const result = await this.tagRepositories.findOne({
        where: {
          tagName: {
            [Op.iLike]: `%${tagName}%`,
          },
        },
      });

      Logger.log('file found: ' + JSON.stringify(result), 'tag.service');

      return result ? result.get() : null;
    } catch (error) {
      Logger.error(
        'findOne eventTag::: error: ' + JSON.stringify(error),
        'eventTag.service',
        'eventTag.service',
      );
      return Promise.reject(error);
    }
  }

  async create(
    // req:any,
    params: Omit<TagProperties, 'createdAt' | 'updatedAt'>,
  ): Promise<TagProperties> {
    try {
      Logger.log('--ENTER CREATE TAG SERVICE--');
      // const tagId = params.tagId ? params.tagId : uuidv4();
      const tagId = params.tagId ? params.tagId : uuid.v4();
      const result = await this.tagRepositories.create({
        tagId: tagId,
        tagName: params.tagName,
        status: params.status,
        description: params.description,
      });

      Logger.log('tag created: ' + JSON.stringify(result), 'tag.service');

      return result.get();
    } catch (error) {
      Logger.error('Failed create new tag');
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async update(
    params: Omit<TagProperties, 'createdAt' | 'updatedAt'>,
  ): Promise<TagProperties> {
    try {
      Logger.log('--ENTER UPDATE TAG SERVICE--');
      const [_, results] = await this.tagRepositories.update(params, {
        where: {
          tagId: params.tagId,
        },
        returning: true,
      });

      Logger.log(
        'tag updated: ' + JSON.stringify(results[0].get()),
        'tag.service',
      );

      if (results && results.length > 0) {
        return results[0].get();
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(
        'update tag::: error: ' + JSON.stringify(error),
        'tag.service',
        'tag.service',
      );
      return Promise.reject(error);
    }
  }

  async delete(tagId: string): Promise<{
    isSuccess: boolean;
  }> {
    try {
      Logger.log('--ENTER DELETE TAG SERVICE--');
      const findTag = await this.findOne(tagId);

      // if (findTag.events?.length > 0) {
      //   await this.eventTagService.deleteBytagId(tagId);
      // }

      const result = await this.tagRepositories.destroy({ where: { tagId } });

      Logger.log('tag deleted: ' + JSON.stringify(result), 'tag.service');

      return {
        isSuccess: true,
      };
      // }
    } catch (error) {
      Logger.error(
        'delete tag::: error: ' + JSON.stringify(error),
        'tag.service',
        'tag.service',
      );
      return Promise.reject(error);
    }
  }
}
