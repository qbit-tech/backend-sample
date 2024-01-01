import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TrackMeModel } from './trackme.entity';
import { generateResultPagination } from '@qbit-tech/libs-utils';

@Injectable()
export class TrackMeService {
  constructor(
    @InjectModel(TrackMeModel)
    private readonly trackMeRepositories: typeof TrackMeModel,
  ) {}

  async findAll(params: {
    search?: string;
    offset?: number;
    limit?: number;

    appName?: string;
    userId?: string;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: TrackMeModel[];
  }> {
    try {
      Logger.log('--ENTER FIND ALL TRACKME SERVICE--');
      let where: any = {};

      if (params.appName) {
        where = { ...where, appName: params.appName };
      }
      if (params.userId) {
        where = { ...where, userId: params.userId };
      }

      const options: any = {
        where,
      };

      const count = await this.trackMeRepositories.count({ ...options });
      const results = await this.trackMeRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: [['timestamp', 'DESC']],
      });

      Logger.log('results: ' + JSON.stringify(results), 'trackMe.service');

      return {
        ...generateResultPagination(count, params),
        results: results.map((row) => row.get()),
      };
    } catch (error) {
      Logger.error(
        'findAll trackMe::: error: ' + JSON.stringify(error),
        'trackMe.service',
        'trackMe.service',
      );
      return Promise.reject(error);
    }
  }

  async bulkCreate(bulkData: TrackMeModel[]) {
    return this.trackMeRepositories.bulkCreate(
      bulkData.map((item) => ({
        activityId: item.activityId,
        appName: item.appName,
        userId: item.userId,
        activityType: item.activityType,
        eventKey: item.eventKey,
        payload: item.payload,
        timestamp: item.timestamp,
      })),
    );
  }
}
