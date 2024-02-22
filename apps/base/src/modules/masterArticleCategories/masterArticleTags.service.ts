import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateMasterArticleCategoriesRequest,
  FindAllMasterArticleCategoriesRequest,
  FindAllMasterArticleCategoriesResponse,
  FindOneMasterArticleCategoriesResponse,
  DeleteMasterArticleCategoriesResponse,
  UpdateMasterArticleCategoriesRequest,
  UpdateMasterArticleCategoriesResponse,
  SimpleResponse,
} from './masterArticleCategories.contract';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { MasterArticleCategoriesModel } from './masterArticleTags.entity';

@Injectable()
export class MasterArticleCategoriesService {
  constructor(
    @InjectModel(MasterArticleCategoriesModel)
    private readonly masterArticleCategoriesRepositories: typeof MasterArticleCategoriesModel,
  ) {}

  async findAll(
    query: FindAllMasterArticleCategoriesRequest,
  ): Promise<FindAllMasterArticleCategoriesResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES SERVICE, FIND ALL---');

      Logger.log(
        'query: ' + JSON.stringify(query),
        'masterArticleCategories.service::findAll',
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
        col: 'categoryId',
        order: [['createdAt', 'DESC']],
      };

      const count: any = await this.masterArticleCategoriesRepositories.count(
        options,
      );

      if (query.limit || query.offset) {
        options = {
          ...options,
          limit: query.limit,
          offset: query.offset,
        };
      }

      const data = await this.masterArticleCategoriesRepositories.findAll(
        options,
      );

      const generatePagination = generateResultPagination(count, query);

      const results = data.map((item) => item.get());

      Logger.log(`Results: ${JSON.stringify(data)}`);

      return {
        ...generatePagination,
        results,
      };
    } catch (err) {
      Logger.error(
        'findAll:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.service',
        'masterArticleCategories.service',
      );

      return Promise.reject(err);
    }
  }

  async findOne(
    categoryId: string,
  ): Promise<FindOneMasterArticleCategoriesResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES SERVICE, FIND ONE---');

      Logger.log(
        'categoryId: ' + JSON.stringify(categoryId),
        'masterArticleCategories.service::findOne',
      );

      const result = await this.masterArticleCategoriesRepositories.findOne({
        where: { categoryId },
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        const newItem = result.get();
        return {
          ...newItem,
        };
      } else {
        Logger.error(`categoryId: ${categoryId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `categoryId: ${categoryId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'findOne:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.service',
        'masterArticleCategories.service',
      );

      return Promise.reject(err);
    }
  }

  async create(
    body: CreateMasterArticleCategoriesRequest,
  ): Promise<FindOneMasterArticleCategoriesResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES SERVICE, CREATE---');

      const result = await this.masterArticleCategoriesRepositories.create({
        ...body,
        categoryId: uuidv4(),
      });

      Logger.log(`Success Create: ${JSON.stringify(result)}`);

      return result;
    } catch (err) {
      Logger.error(
        'create:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.service',
        'masterArticleCategories.service',
      );

      return Promise.reject(err);
    }
  }

  async update(
    categoryId: string,
    body: Omit<UpdateMasterArticleCategoriesRequest, 'categoryId'>,
  ): Promise<UpdateMasterArticleCategoriesResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES SERVICE, UPDATE---');

      Logger.log(
        'categoryId: ' + JSON.stringify(categoryId),
        'masterArticleCategories.service::update',
      );

      const result = await this.masterArticleCategoriesRepositories.findOne({
        where: {
          categoryId,
        },
      });

      if (result) {
        await this.masterArticleCategoriesRepositories.update(
          {
            ...body,
          },
          {
            where: { categoryId },
          },
        );

        Logger.log(`Result: ${JSON.stringify(result)}`);

        const newData = await this.masterArticleCategoriesRepositories.findOne({
          where: {
            categoryId,
          },
        });

        Logger.log(`Success Update: ${JSON.stringify(newData)}`);

        return newData;
      } else {
        Logger.error(`categoryId: ${categoryId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `categoryId: ${categoryId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'update:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.service',
        'masterArticleCategories.service',
      );

      return Promise.reject(err);
    }
  }

  async remove(
    categoryId: string,
  ): Promise<DeleteMasterArticleCategoriesResponse | SimpleResponse> {
    try {
      Logger.log('---START MASTER ARTICLE CATEGORIES SERVICE, REMOVE---');

      Logger.log(
        'categoryId: ' + JSON.stringify(categoryId),
        'masterArticleCategories.service::remove',
      );

      const result = await this.masterArticleCategoriesRepositories.findOne({
        where: { categoryId },
      });

      Logger.log(`Result: ${JSON.stringify(result)}`);

      if (result) {
        await this.masterArticleCategoriesRepositories.destroy({
          where: {
            categoryId,
          },
        });

        Logger.log(`Success Delete: ${categoryId}`);

        return {
          isSuccess: true,
        };
      } else {
        Logger.error(`categoryId: ${categoryId} not found`);
        return {
          code: HttpStatus.NOT_FOUND,
          message: `categoryId: ${categoryId} not found`,
        };
      }
    } catch (err) {
      Logger.error(
        'remove:::ERROR: ' + JSON.stringify(err),
        'masterArticleCategories.service',
        'masterArticleCategories.service',
      );

      return Promise.reject(err);
    }
  }
}
