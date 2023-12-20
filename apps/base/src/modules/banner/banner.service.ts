import {
    BannerFindAllRequest,
    BannerFindAllResponse,
    BannerFindOneResponse,
    BannerCreateRequest,
    BannerCreateResponse,
    BannerUpdateRequest,
    BannerUpdateResponse,
    BannerUpdateImageRequest,
    UserMetadata,
    OrderItem,
} from './banner.contract';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BannerModel } from './banner.entity';
import { Op } from 'sequelize';
import { generateResultPagination } from '@qbit-tech/libs-utils';
import { v4 as uuidv4 } from 'uuid';

export type BannerRepositories = {
    bannerId: string;
    bannerType: string;
    bannerImageUrl?: string;
    title?: string;
    content?: string;
    createdByUserId: string;
    metaCreatedByUser: UserMetadata;
    relatedContentType?: string;
    relatedContentId?: string;
    relatedContentUrl?: string;
    isPublished: boolean;
    order: number;
    updatedAt: Date;
    createdAt: Date;
};

@Injectable()
export class BannerService {

    constructor(
        @InjectModel(BannerModel)
        private readonly bannerRepositories: typeof BannerModel,
    ) { }

    async getAllBanner(params: BannerFindAllRequest): Promise<BannerFindAllResponse> {
        try {
            let where = {};

            params.search &&
                (where = {
                    ...where,
                    title: {
                        [Op.iLike]: `%${params.search}%`,
                    },
                });

            if (typeof params.isPublished === 'boolean') {
                where = {
                    ...where,
                    isPublished: params.isPublished,
                };
            } else if (params.isPublished == null) {
                where = {
                    ...where,
                };
            }

            const options: any = {
                where,
                distinct: true,
                col: 'bannerId',
            };

            const count = await this.bannerRepositories.count(options); //ngitung total data
            const results = await this.bannerRepositories.findAll({
                ...options,
                limit: params.limit || 1000000000,
                offset: params.offset || 0,
                order: [['order', 'DESC']],
            });
            Logger.log('file exist: ' + JSON.stringify(results), 'banner.service');

            Logger.log('--EXIT FIND ALL BANNER SERVICE--');
            return {
                ...generateResultPagination(count, params),
                results: results.map(row => row.get()),
            };
        } catch (error) {
            Logger.error(
                'findAll banner::: error: ' + JSON.stringify(error),
                'voucher.service',
                'voucher.service',
            );
            return Promise.reject(error);
        }

    }

    async getDetail(bannerId: string): Promise<BannerFindOneResponse> {
        return await this.bannerRepositories.findOne({
            where: { bannerId },
            attributes: [
                'bannerId',
                'bannerType',
                'bannerImageUrl',
                'title',
                'subtitle',
                'content',
                'createdByUserId',
                'metaCreatedByUser',
                'relatedContentType',
                'relatedContentId',
                'relatedContentUrl',
                'isPublished',
                'order',
                'updatedAt',
                'createdAt',
            ],
        });
    }

    async createBanner(data: BannerCreateRequest): Promise<BannerCreateResponse> {
        Logger.log('-ENTER CREATE BANNER SERVICE--');
        const orderedBanners = await this.bannerRepositories.findAll({
            order: [['order', 'DESC']],
        });
        const order = orderedBanners.length === 0 ? 0 : orderedBanners[0].order + 1;

        const newData = {
            ...data,
            order,
        };
        const result = await this.bannerRepositories.create({
            ...newData,
            bannerId: uuidv4(),
        });
        Logger.log('-EXIT CREATE BANNER SERVICE--');
        return result;
    }

    async updateBanner(
        params: BannerUpdateRequest,
    ): Promise<BannerUpdateResponse> {
        await this.bannerRepositories.update(
            { ...params },
            {
                where: { bannerId: params.bannerId },
            },
        );

        return this.getDetail(params.bannerId);
    }

    async updateBannerImage(
        params: BannerUpdateImageRequest,
    ): Promise<BannerUpdateResponse> {
        await this.bannerRepositories.update(params, {
            where: { bannerId: params.bannerId },
        });

        return this.getDetail(params.bannerId);
    }

    async deleteBanner(bannerId: string): Promise<{ isSuccess: boolean }> {
        const result = await this.bannerRepositories.destroy({
            where: { bannerId },
        });

        return { isSuccess: result ? true : false };
    }

    async updateQueue(bulk: OrderItem[]) {
        const promises = bulk.map(item =>
            this.bannerRepositories.update(
                { order: item.order },
                {
                    where: {
                        bannerId: item.bannerId,
                    },
                },
            ),
        );

        await Promise.all(promises);
        return true;
    }

}