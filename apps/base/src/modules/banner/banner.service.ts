import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BannerModel } from "./banner.entity";
import { CreateBannerDto } from "./dto/create.banner.dto";
import { uuid } from 'uuidv4';

@Injectable()
export class BannerService {

    constructor(
        @InjectModel(BannerModel)
        private readonly bannerRepository: typeof BannerModel,
    ) {}

    public async createBanner(
        newBanner: CreateBannerDto
    ): Promise<BannerModel> {
        try {
            const bannerId = uuid();
            const [banner, created] = await this.bannerRepository.findOrCreate({
                where: {
                    id: bannerId,
                    title: newBanner.title,
                    bannerImage: newBanner.bannerImage,
                    bannerLink: newBanner.bannerLink
                }
            });
            if (created) {
                return banner;
            }
            return Promise.reject({
                statusCode: 400,
                code: 'failed_to_create',
                message: `banner with title ${newBanner.title} already exist`,
            });
        } catch (error) {
            Logger.error(error);
            return Promise.reject({
                statusCode: 500,
                code: 'internal_server_error',
                message: `something went wrong`,
            });
        }   
    }


    public async updateBanner(
        bannerId: string,
        title: string,
        bannerImage: string,
        bannerLink: string,
    ): Promise<BannerModel> {
        try {
            const isBannerExist = await this.bannerRepository.findByPk(bannerId);

            if (!isBannerExist) {
                return Promise.reject({
                    statusCode: 404,
                    code: 'banner_not_found',
                    message: `banner with id ${bannerId} not found`,
                });
            }
            const [_, updatedBanner] = await this.bannerRepository.update(
                { title: title, bannerImage: bannerImage, bannerLink: bannerLink },
                {
                    where: {
                        id: bannerId,
                    },
                    returning: true,
                },
            );
            return updatedBanner[0];
        } catch (error) {
            Logger.error(error);
            return Promise.reject({
                statusCode: 500,
                code: 'internal_server_error',
                message: `something went wrong`,
            });
        }
    }

    public async deleteBanner(
        bannerId: string
    ): Promise<BannerModel> {
        try{
            const isBannerExist = await this.bannerRepository.findByPk(bannerId);

            if (!isBannerExist) {
                return Promise.reject({
                    statusCode: 404,
                    code: 'banner_not_found',
                    message: `banner with id ${bannerId} not found`,
                });
            }
            const deletedBanner = await this.bannerRepository.destroy({
                where: {
                    id: bannerId,
                },
            });
        } catch (error) {
            Logger.error(error);
            return Promise.reject({
                statusCode: 500,
                code: 'internal_server_error',
                message: `something went wrong`,
            });
        }
    }

    public async getBannerById(
        bannerId: string
    ): Promise<BannerModel> {
        try{
            const banner = await this.bannerRepository.findByPk(bannerId);

            if (!banner) {
                return Promise.reject({
                    statusCode: 404,
                    code: 'banner_not_found',
                    message: `banner with id ${bannerId} not found`,
                });
            }
            return banner;
        } catch (error) {
            Logger.error(error);
            return Promise.reject({
                statusCode: 500,
                code: 'internal_server_error',
                message: `something went wrong`,
            });
        }
    }

    public async getAllBanner(): Promise<BannerModel[]> {
        try{
            const banners = await this.bannerRepository.findAll();
            return banners;
        } catch (error) {
            Logger.error(error);
            return Promise.reject({
                statusCode: 500,
                code: 'internal_server_error',
                message: `something went wrong`,
            });
        }
    }

    public async getLatestBanner(
        limit: number
    ): Promise<BannerModel[]> {
        try{
            const banners = await this.bannerRepository.findAll({
                limit: limit,
                order: [['createdAt', 'DESC']]
            });
            return banners;
        } catch (error) {
            Logger.error(error);
            return Promise.reject({
                statusCode: 500,
                code: 'internal_server_error',
                message: `something went wrong`,
            });
        }
    }
}
