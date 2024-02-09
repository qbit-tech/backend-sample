import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SponsorModel, SponsorProperties } from './sponsor.entity';
import * as uuid from 'uuid';
import { Op } from 'sequelize';
import { ERRORS } from '../../core/error.constant';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { SponsorUpdateImageRequest, SponsorUpdateRequest, SponsorUpdateResponse } from './sponsor.contract';

@Injectable()
export class SponsorService {
  constructor(
    @InjectModel(SponsorModel)
    private readonly sponsorRepositories: typeof SponsorModel,
  ) {}

  async findAll(params: {
    search?: string;
    offset?: number;
    limit?: number;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: SponsorProperties[];
  }> {
    try {
      Logger.log('--ENTER FIND ALL SPONSOR SERVICE--');
      let where = {};

      params.search &&
        (where = {
          ...where,
          [Op.or]: [
            { sponsorName: { [Op.iLike]: `%${params.search}%` } },
          ],
        });

      const options: any = {
        where,
        distinct: true,
        col: 'sponsorId',
      };

      const count = await this.sponsorRepositories.count({ ...options });
      const results = await this.sponsorRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['createdAt', 'DESC']],
      });

      Logger.log('results: ' + JSON.stringify(results), 'sponsor.service');

      return {
        ...generateResultPagination(count, params),
        results: results.map((row) => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll sponsor::: error: ' + JSON.stringify(error),
        'sponsor.service',
        'sponsor.service',
      );
      return Promise.reject(error);
    }
  }

  async findOne(sponsorId: string): Promise<any> {
    try {
      Logger.log('--ENTER FIND ONE SPONSOR SERVICE--');
      const result = await this.sponsorRepositories.findOne({
        where: { sponsorId },
      });
      Logger.log('file found: ' + JSON.stringify(result), 'sponsor.service');

      if (!result) {
        return Promise.reject({
          statusCode: ERRORS.sponsor.sponsor_not_found.statusCode,
          code: ERRORS.sponsor.sponsor_not_found.code,
          message: ERRORS.sponsor.sponsor_not_found.message,
        });
      }
      // const name = result.tagName

      return result.get();
    } catch (error) {
      Logger.error(
        'findOne sponsor::: error: ' + JSON.stringify(error),
        'sponsor.service',
        'sponsor.service',
      );
      return Promise.reject(error);
    }
  }

  async findOneBySponsorName(sponsorName: string): Promise<SponsorProperties> {
    try {
      Logger.log('--ENTER FIND ONE BY SPONSOR NAME');
      const result = await this.sponsorRepositories.findOne({
        where: {
          sponsorName: {
            [Op.iLike]: `%${sponsorName}%`,
          },
        },
      });

      Logger.log('file found: ' + JSON.stringify(result), 'sponsor.service');

      return result ? result.get() : null;
    } catch (error) {
      Logger.error(
        'findOne eventSponsor::: error: ' + JSON.stringify(error),
        'eventSponsor.service',
        'eventSponsor.service',
      );
      return Promise.reject(error);
    }
  }

  async create(
    // req:any,
    params: Omit<SponsorProperties, 'createdAt' | 'updatedAt'>,
  ): Promise<SponsorProperties> {
    try {
      Logger.log('--ENTER CREATE SPONSOR--');
      // const sponsorId = params.sponsorId ? params.sponsorId : uuidv4();
      const sponsorId = params.sponsorId ? params.sponsorId : uuid.v4();
      const result = await this.sponsorRepositories.create({
        sponsorId: sponsorId,
        sponsorName: params.sponsorName,
        sponsorUrl: params.sponsorUrl,
      });

      Logger.log('sponsor created: ' + JSON.stringify(result), 'sponsor.service');

      return result.get();
    } catch (error) {
      Logger.error('Failed create new sponsor');
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateSponsorImage(
    params: SponsorUpdateImageRequest,
  ): Promise<SponsorUpdateImageRequest>{
    await this.sponsorRepositories.update(params, {
      where: { sponsorId: params.sponsorId }, 
    });
    return this.findOne(params.sponsorId);
  }

  async update(
    params: SponsorUpdateRequest,
  ): Promise<SponsorUpdateResponse> {
    try {
      Logger.log('--ENTER UPDATE SPONSOR--');
      const [_, results] = await this.sponsorRepositories.update(params, {
        where: {
          sponsorId: params.sponsorId,
        },
        returning: true,
      });

      Logger.log(
        'sponsor updated: ' + JSON.stringify(results[0].get()),
        'sponsor.service',
      );

      if (results && results.length > 0) {
        return results[0].get();
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(
        'update sponsor::: error: ' + JSON.stringify(error),
        'sponsor.service',
        'sponsor.service',
      );
      return Promise.reject(error);
    }
  }

  async delete(sponsorId: string): Promise<{
    isSuccess: boolean;
  }> {
    try {
      Logger.log('--ENTER DELETE SPONSOR SERVICE--');
      const find = await this.sponsorRepositories.findOne({
        where: { sponsorId },
      });
      Logger.log('deleting: ' + JSON.stringify(find), 'sponsor.service')
      const result = await this.sponsorRepositories.destroy({ where: { sponsorId } });

      Logger.log('sponsor deleted: ' + JSON.stringify(result), 'sponsor.service');

      return {
        isSuccess: true,
      };
      // }
    } catch (error) {
      Logger.error(
        'delete sponsor::: error: ' + JSON.stringify(error),
        'sponsor.service',
        'sponsor.service',
      );
      return Promise.reject(error);
    }
  }
}
