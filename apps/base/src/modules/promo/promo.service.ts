import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PromoModel } from './promo.entity';
import { PromoProperties, UpdatePromoProperties } from './promo.contract';
import * as fsp from 'fs/promises';

export type PromoRepositories = {
    promoId: string;
    title: string;
    description: string;
    image?: string;
    isPublish: Boolean;
    startedAt: Date;
    endedAt: Date;
};

@Injectable()
export class PromoService {
    constructor(
        @InjectModel(PromoModel)
        private readonly promoRepository: typeof PromoModel,
    ) { }

    public async createPromo(
        newPromo: PromoProperties
    ): Promise<PromoModel> {
        if (!newPromo.title || !newPromo.startedAt || !newPromo.endedAt || newPromo.isPublish === null) {
            return Promise.reject({
                statusCode: 400,
                code: 'failed_to_create',
                message: 'please complete the create promo payload'
            });
        }

        const [promo, created] = await this.promoRepository.findOrCreate({
            where: {
                title: newPromo.title
            },
            defaults: {
                ...newPromo
            }
        })

        if (created) {
            return promo
        }

    }

    public async findAll(): Promise<PromoModel[]> {
        try {
            const promos = await this.promoRepository.findAll({ order: [["createdAt", 'ASC']]})

            if (!promos) {
                return Promise.reject({
                    statusCode: 404,
                    code: 'failed_to_get',
                    message: `promo not found`,
                })
            }
            return promos
        } catch (error) {
            Logger.error(error);
            return Promise.reject(error);
        }
    }

    public async findById(promoId: string): Promise<PromoModel> {
        try {
            const promo = await this.promoRepository.findByPk(promoId);

            return promo;
        } catch (error) {
            Logger.error(error);
            return Promise.reject(error);
        }
    }

    public async deleteById(promoId: string): Promise<string> {
        try {
            const rows = await this.promoRepository.destroy({
                where: {
                    promoId: promoId
                }
            })

            if (rows === 0) {
                return Promise.reject({
                    statusCode: 404,
                    code: 'failed_to_delete',
                    message: `promo with id ${promoId} not found`,
                })
            }

            return "Promo deleted"
        } catch (error) {
            Logger.error(error);
            return Promise.reject(error);
        }
    }

    public async updatePromo(promoId: string, newPromo: UpdatePromoProperties): Promise<PromoModel> {
        await this.promoRepository.update(
            {...newPromo},
            {
                where: { promoId: promoId}
            }
        );

        return this.findById(promoId)
    }

    public async updatedPromoImage(
        promoId: string,
        image?: string
    ): Promise<PromoModel> {
        await this.promoRepository.update({promoId, image}, {
            where: { promoId: promoId}
        });

        return this.findById(promoId)
    }


}