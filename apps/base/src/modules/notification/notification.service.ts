import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { NotificationModel } from "@qbit-tech/libs-notification/dist/notification.entity";
import { generateResultPagination } from "@qbit-tech/libs-utils";
import { Op } from "sequelize";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(NotificationModel)
        private readonly notificationRepositories: typeof NotificationModel,
    ) { }

    async findAll(params: {
        search?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        count: number;
        prev: string;
        next: string;
        results: NotificationModel[];
    }> {
        try {
            Logger.log('--ENTER FIND ALL NOTIFICATION SERVICE--');
            let where = {};

            params.search &&
                (where = {
                    ...where,
                    [Op.or]: [
                        { notificationTitle: { [Op.iLike]: `%${params.search}%` } },
                        { description: { [Op.iLike]: `%${params.search}%` } },
                    ],
                });

            const options: any = {
                where,
                distinct: true,
                col: 'id',
            };

            const count = await this.notificationRepositories.count({ ...options });
            const results = await this.notificationRepositories.findAll({
                ...options,
                limit: params.limit,
                offset: params.offset,
                order: [['createdAt', 'DESC']],
            });

            Logger.log('results: ' + JSON.stringify(results), 'notification.service');

            return {
                ...generateResultPagination(count, params),
                results: results.map((row) => row.get()),
            };
        } catch (error) {
            Logger.error(
                'findAll notification::: error: ' + JSON.stringify(error),
                'notification.service',
                'notification.service',
            );
            return Promise.reject(error);
        }
    }
}