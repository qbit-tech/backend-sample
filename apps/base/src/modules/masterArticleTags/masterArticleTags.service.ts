import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateMasterArticleTagsRequest,
  FindAllMasterArticleTagsRequest,
  FindAllMasterArticleTagsResponse,
  FindOneMasterArticleTagsResponse,
  DeleteMasterArticleTagsResponse,
  UpdateMasterArticleTagsRequest,
  UpdateMasterArticleTagsResponse,
  SimpleResponse,
} from './masterArticleTags.contract';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { MasterArticleTagsModel } from './masterArticleTags.entity';

@Injectable()
export class MasterArticleTagsService {
  constructor(
    @InjectModel(MasterArticleTagsModel)
    private readonly masterArticleTagsRepositories: typeof MasterArticleTagsModel,
  ) {}

  async findAll(
    query: FindAllMasterArticleTagsRequest,
  ): Promise<FindAllMasterArticleTagsResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS SERVICE, FIND ALL---');

      Logger.log(
        'query: ' + JSON.stringify(query),
        'masterArticleTags.service::findAll',
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
          [Op.or]: [{ name: { [Op.iLike]: `%${query.search}%` } }],
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

      options = {
        where,
        distinct: true,
        col: 'tagId',
        order: [['createdAt', 'DESC']],
      };

      const count: any = await this.masterArticleTagsRepositories.count(
        options,
      );

      if (query.limit || query.offset) {
        options = {
          ...options,
          limit: query.limit,
          offset: query.offset,
        };
      }

      const data = await this.masterArticleTagsRepositories.findAll(options);

      Logger.log(`Results: ${JSON.stringify(data)}`);

      const generatePagination = generateResultPagination(count, query);

      const results = data.map((item) => item.get());

      return {
        ...generatePagination,
        results,
      };
    } catch (err) {
      Logger.error(
        'findAll:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.service',
        'masterArticleTags.service',
      );

      return Promise.reject(err);
    }
  }

  async findOne(
    tagId: string,
  ): Promise<FindOneMasterArticleTagsResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS SERVICE, FIND ONE---');

      Logger.log(
        'tagId: ' + JSON.stringify(tagId),
        'masterArticleTags.service::findOne',
      );

      const result = await this.masterArticleTagsRepositories.findOne({
        where: { tagId },
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        const newItem = result.get();
        return {
          ...newItem,
        };
      } else {
        Logger.error(`tagId: ${tagId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `tagId: ${tagId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'findOne:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.service',
        'masterArticleTags.service',
      );

      return Promise.reject(err);
    }
  }

  async create(
    body: CreateMasterArticleTagsRequest,
  ): Promise<FindOneMasterArticleTagsResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS SERVICE, CREATE---');

      const result = await this.masterArticleTagsRepositories.create({
        ...body,
        tagId: uuidv4(),
      });

      Logger.log(`Success Create: ${JSON.stringify(result)}`);

      return result;
    } catch (err) {
      Logger.error(
        'create:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.service',
        'masterArticleTags.service',
      );

      return Promise.reject(err);
    }
  }

  async update(
    tagId: string,
    body: Omit<UpdateMasterArticleTagsRequest, 'tagId'>,
  ): Promise<UpdateMasterArticleTagsResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS SERVICE, UPDATE---');

      Logger.log(
        'tagId: ' + JSON.stringify(tagId),
        'masterArticleTags.service::update',
      );

      const result = await this.masterArticleTagsRepositories.findOne({
        where: {
          tagId,
        },
      });

      if (result) {
        await this.masterArticleTagsRepositories.update(
          {
            ...body,
          },
          {
            where: { tagId },
          },
        );

        Logger.log(`Result: ${JSON.stringify(result)}`);

        const newData = await this.masterArticleTagsRepositories.findOne({
          where: {
            tagId,
          },
        });

        Logger.log(`Success Update: ${JSON.stringify(newData)}`);

        return newData;
      } else {
        Logger.error(`tagId: ${tagId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `tagId: ${tagId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'update:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.service',
        'masterArticleTags.service',
      );

      return Promise.reject(err);
    }
  }

  async remove(
    tagId: string,
  ): Promise<DeleteMasterArticleTagsResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE TAGS SERVICE, REMOVE---');

      Logger.log(
        'tagId: ' + JSON.stringify(tagId),
        'masterArticleTags.service::remove',
      );

      const result = await this.masterArticleTagsRepositories.findOne({
        where: { tagId },
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        await this.masterArticleTagsRepositories.destroy({
          where: {
            tagId,
          },
        });

        Logger.log(`Success Delete: ${tagId}`);

        return {
          isSuccess: true,
        };
      } else {
        Logger.error(`tagId: ${tagId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `tagId: ${tagId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'remove:::ERROR: ' + JSON.stringify(err),
        'masterArticleTags.service',
        'masterArticleTags.service',
      );

      return Promise.reject(err);
    }
  }
}
