import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import {
  CalculatePointFromTransactionRequest,
  CreateTransactionExternalRequest,
  CreateTransactionRequest,
  CreditCardData,
  ShippingServiceOptionRequest,
  UpdateTransactionStatusRequest,
} from '../transaction.contract';
import { UserService } from '../../user/user.service';
import { 
    AppConfigService, 
    generateResultPagination,
    AppRequest
} from '@qbit-tech/libs-utils';
import {
  ETransactionStatus,
  TransactionModel,
  TransactionProperties,
} from '../entity/transaction.entity';
import { TransactionItemModel } from '../entity/transactionItem.entity';
import {
  EShipmentStatus,
  TransactionShipmentModel,
} from '../entity/transactionShipment.entity';
import moment = require('moment');
import { Op, OrderItem } from 'sequelize';


const midtransSetup: any = {
    STAGE: process.env.NODE_ENV,
    SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
    CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
};


const JNESetup: any = {
    username: process.env.JNE_USERNAME,
    api_key: process.env.JNE_API_KEY,
};    


@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  
  constructor(
    // private readonly appConfigService: AppConfigService,
    private readonly userService: UserService,
    @InjectModel(TransactionModel)
    private readonly transactionRepositories: typeof TransactionModel,
    @InjectModel(TransactionItemModel)
    private readonly transactionItemRepositories: typeof TransactionItemModel,
    @InjectModel(TransactionShipmentModel)
    private readonly transactionShipmentRepositories: typeof TransactionShipmentModel,
  ) {}

  
  async findAll(params: {
    offset?: number;
    limit?: number;
    search?: string;
    sort?: OrderItem[];
    buyerId?: string;
    transactionStatus?: string;
    shipmentType?: string;
    startAt?: Date | string;
    endAt?: Date | string;
  }): Promise<{
    count: number;
    prev: string;
    next: string;
    results: TransactionProperties[];
  }> {
    try {
      this.logger.log('--- FIND ALL TRANSACTION ---');
      this.logger.log('Params: ' + JSON.stringify(params));

      let where = {};

      const options: any = {
        where,
        include: [
          {
            model: TransactionItemModel,
            as: 'transactionItems',
            // required: true,
          },
          {
            model: TransactionShipmentModel,
            as: 'transactionShipment',
            // required: true,
          },
        ],
        distinct: true,
        col: 'transactionId',
      };
  
      const count = await this.transactionRepositories.count(options);
      
      const results = await this.transactionRepositories.findAll({
        ...options,
        limit: params.limit,
        offset: params.offset,
        order: params.sort ? params.sort : [['createdAt', 'desc']],
      });

      return {
        ...generateResultPagination(count, params),
        results: results.map(row => row.get()),
      };
    } catch (err) {
      this.logger.error('ERROR FIND ALL TRANSACTION');
      this.logger.error('err::: ' + JSON.stringify(err));
      return Promise.reject(err);
    }
  }
  
  async findOne(transactionId: string): Promise<TransactionProperties> {
    this.logger.log('--- FIND ONE TRANSACTION ---');
    this.logger.log('transactionId: ' + JSON.stringify(transactionId));
    
    try {
      const result = await this.transactionRepositories.findOne({
        where: { transactionId: transactionId },
        include: [
          {
            model: TransactionItemModel,
            as: 'transactionItems',
          },
          {
            model: TransactionShipmentModel,
            as: 'transactionShipment',
          },
        ],
      });
      
      return result ? result.get() : null;
    } catch (err) {
      this.logger.error('ERROR FIND ONE TRANSACTION');
      this.logger.error('err::: ' + JSON.stringify(err));
      return Promise.reject(err);
    }
  }
  
  async create(
    params: CreateTransactionRequest,
    req: AppRequest,
  ): Promise<any> {
    this.logger.log('--- CREATE TRANSACTION ---');
    this.logger.log('params: ' + JSON.stringify(params));
    
    let result: TransactionProperties;
    try {
      const transactionItems = [];
      let totalWeight = 0;

      try {
        this.logger.log('--- REDUCE PRODUCT STOCK ---');

        for (const item of params.products) {
          // if (item.productId) {
          //   const findProduct = await this.productService.getOne(
          //     item.productId,
          //   );
          //   const productStock =
          //     findProduct.stock.length > 0 &&
          //     findProduct.stock?.find(
          //       item => item.locationId === params.locationId,
          //     );

          //   if (productStock && productStock.currentStock >= item.qty) {
          //     this.productStockService.updateStock(
          //       {
          //         description: 'Transaction',
          //         currentStock: productStock.currentStock - item.qty,
          //       },
          //       {
          //         productId: findProduct.productId,
          //         locationId: params.locationId,
          //       },
          //     );

          //     const totalProductPrice = item.qty * item.pricePerUnit;
          //     const totalProductWeight = item.qty * findProduct.grossWeight;
          //     totalWeight += totalProductWeight;

          //     transactionItems.push({
          //       transactionItemId: uuidv4(),
          //       productId: findProduct.productId,
          //       metaProduct: findProduct,
          //       qty: item.qty,
          //       unitOfMeasure: findProduct.baseUnit,
          //       pricePerUnit: item.pricePerUnit,
          //       totalFinalPrice: totalProductPrice,
          //     });
          //   } else {
          //     return Promise.reject({
          //       status_code: 400,
          //       message: 'Product stock not enough',
          //     });
          //   }
          // } else if (item.promoId) {
          //   const findPromotion = await this.promotionService.findOne(
          //     item.promoId,
          //   );

          //   let totalPromotionItemWeight = 0;

          //   if (findPromotion.items?.length === 1) {
          //     for (const promotionItem of findPromotion.items) {
          //       totalPromotionItemWeight += promotionItem.product?.grossWeight;

          //       const productStock =
          //         promotionItem.product?.stock?.length > 0 &&
          //         promotionItem.product?.stock?.find(
          //           item => item.locationId === params.locationId,
          //         );

          //       if (productStock && productStock.currentStock >= item.qty) {
          //         this.productStockService.updateStock(
          //           {
          //             description: 'Transaction',
          //             currentStock: productStock.currentStock - item.qty,
          //           },
          //           {
          //             productId: promotionItem.productId,
          //             locationId: params.locationId,
          //           },
          //         );
          //       } else {
          //         return Promise.reject({
          //           status_code: 400,
          //           message: 'Product Stock not enough',
          //         });
          //       }
          //     }
          //   } else {
          //     for (const promotionItem of findPromotion.items) {
          //       totalPromotionItemWeight +=
          //         promotionItem.quantity + promotionItem.product?.grossWeight;

          //       const productStock =
          //         promotionItem.product?.stock?.length > 0 &&
          //         promotionItem.product?.stock?.find(
          //           item => item.locationId === params.locationId,
          //         );

          //       if (
          //         productStock &&
          //         productStock.currentStock >= promotionItem.quantity * item.qty
          //       ) {
          //         this.productStockService.updateStock(
          //           {
          //             description: 'Transaction',
          //             currentStock:
          //               productStock.currentStock -
          //               promotionItem.quantity * item.qty,
          //           },
          //           {
          //             productId: promotionItem.productId,
          //             locationId: params.locationId,
          //           },
          //         );
          //       } else {
          //         return Promise.reject({
          //           status_code: 400,
          //           message: 'Product Stock not enough',
          //         });
          //       }
          //     }
          //   }

          //   totalWeight += totalPromotionItemWeight * item.qty;

          //   const totalPromotionPrice = item.qty * item.pricePerUnit;

          //   transactionItems.push({
          //     transactionItemId: uuidv4(),
          //     productId: findPromotion.promoId,
          //     metaProduct: findPromotion,
          //     qty: item.qty,
          //     unitOfMeasure: 'Promotion',
          //     pricePerUnit: item.pricePerUnit,
          //     totalFinalPrice: totalPromotionPrice,
          //   });
          // } else if (item.redeemProductId) {
          //   const redeemProduct = await this.redeemProductsService.findOne(
          //     item.redeemProductId,
          //   );

          //   const productStock =
          //     redeemProduct.product?.stock?.length > 0 &&
          //     redeemProduct.product.stock.find(
          //       item => item.locationId === params.locationId,
          //     );

          //   if (productStock && productStock.currentStock >= item.qty) {
          //     this.productStockService.updateStock(
          //       {
          //         description: 'Transaction',
          //         currentStock: productStock.currentStock - item.qty,
          //       },
          //       {
          //         productId: redeemProduct.productId,
          //         locationId: params.locationId,
          //       },
          //     );

          //     const totalProductPrice = item.qty * item.pricePerUnit;

          //     const totalProductWeight =
          //       item.qty * redeemProduct.product.grossWeight;
          //     totalWeight += totalProductWeight;

          //     transactionItems.push({
          //       transactionItemId: uuidv4(),
          //       productId: redeemProduct.redeemProductId,
          //       metaProduct: redeemProduct,
          //       qty: item.qty,
          //       unitOfMeasure: 'Redeem Product',
          //       pricePerUnit: item.pricePerUnit,
          //       totalFinalPrice: totalProductPrice,
          //     });
          //   } else {
          //     return Promise.reject({
          //       status_code: 400,
          //       message: 'Product Stock not enough',
          //     });
          //   }
          // }

          transactionItems.push({
            transactionItemId: uuidv4(),
            productId: item.productId,
            metaProduct: item,
            qty: item.qty,
            unit: 'ML',
            pricePerUnit: item.pricePerUnit,
            totalFinalPrice: item.qty * item.pricePerUnit,
          });
        }
      } catch (err) {
        this.logger.error('ERROR REDUCE PRODUCT STOCK');
        this.logger.error('err::: ' + JSON.stringify(err));
        return Promise.reject(err);
      }
      
      this.logger.log('transactionItems: ' + JSON.stringify(transactionItems));
      this.logger.log('totalWeight: ' + JSON.stringify(totalWeight));
      
      let subTotalRedeemProduct = 0;
      let shippingFeeRedeemProduct = 0;
      

      const detailPrice = await this.calculate({ ...params });

      this.logger.log('detailPrice: ' + JSON.stringify(detailPrice));
      const subTotal = detailPrice?.find(
        (item: any) => item.key === 'sub-total',
      ).value;
      const voucher = detailPrice?.find((item: any) => item.key === 'voucher')
        .value;
      const total = detailPrice?.find((item: any) => item.key === 'total')
        .value;
      
      
      const findBuyer = await this.userService.findOneByUserId(req.user.userId);
      
      result = await this.transactionRepositories.create({
        transactionId: uuidv4(),
        transactionCode:
          'T' +
          moment(new Date()).format('YYYYMMDD') +
          Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase(),
        totalPrice:  subTotal,
        totalFinalPrice: total,
        transactionStatus: ETransactionStatus.created,
        buyerId: findBuyer.userId,
        buyerDetail: findBuyer,
        sellerId: uuidv4(),
        sellerDetail: findBuyer,
        details: { items: detailPrice },
      });

        
      this.logger.log('result: ' + JSON.stringify(result));

      if (result) {
        this.logger.log('--- CREATE TRANSACTION ITEM ---');
        
        const newTransactionItems = transactionItems.map(item => ({
          ...item,
          transactionId: result.transactionId,
        }));

        const resultTransactionItems = await this.transactionItemRepositories.bulkCreate(
          newTransactionItems,
        );

        this.logger.log(
          'resultTransactionItems: ' + JSON.stringify(resultTransactionItems),
        );

        this.logger.log('--- CREATE TRANSACTION SHIPMENT ---');

        // const shipmentData = {
        //   transactionShipmentId: uuidv4(),
        //   transactionId: result.transactionId,
        //   courierVendor: params.shipping.selectShipping,
        //   courirService: params.shipping.courirService,
        //   weight: totalWeight,
        //   shipmentStatus: EShipmentStatus.CREATED,
        //   shipToAdress: params.shipping.shippingAddress,
        // };

        // this.logger.log('shipmentData: ' + JSON.stringify(shipmentData));

        // const resultTransactionShipment = await this.transactionShipmentRepositories.create(
        //   shipmentData,
        // );

        // this.logger.log(
        //   'resultTransactionShipment: ' +
        //     JSON.stringify(resultTransactionShipment),
        // );

        
        return {
          transction: result,
          transactionItems: resultTransactionItems,
          // transactionShipment: resultTransactionShipment,
        };
      }
    } catch (err) {
      this.logger.error('ERROR CREATE TRANSACTION');
      this.logger.error('err::: ' + JSON.stringify(err));

      await this.delete(result.transactionId);

      return Promise.reject(err);
    }
  }

  async updateJneResponse(
    transactionId: string,
    resJne?: any,
    lastJNEStatus?: number,
  ): Promise<TransactionShipmentModel> {
    this.logger.log('--- UPDATE JNE Response ---');
    this.logger.log('resJne::: ' + JSON.stringify(resJne));
    this.logger.log('lastJNEStatus::: ' + JSON.stringify(lastJNEStatus));

    try {
      const [_, results] = await this.transactionShipmentRepositories.update(
        {
          jneResponse: resJne,
          lastJNEStatus: lastJNEStatus,
        },
        {
          where: {
            transactionId: transactionId,
          },
          returning: true,
        },
      );

      return results ? results[0].get() : null;
    } catch (err) {
      this.logger.error('ERROR UPDATE JNE RESPONSE');
      this.logger.error('err::: ' + JSON.stringify(err));
      return Promise.reject(err);
    }
  }

  async updateWaybill(
    transactionId: string,
    waybill: string,
    shipmentType: string,
    shipmentDate: string,
    shipmentTime: string,
  ): Promise<TransactionShipmentModel> {
    this.logger.log('--- UPDATE WAYBILL ---');
    this.logger.log('transactionId::: ' + JSON.stringify(transactionId));
    this.logger.log('waybill::: ' + JSON.stringify(waybill));

    try {
      const [_, results] = await this.transactionShipmentRepositories.update(
        {
          waybill: waybill,
          shipmentStatus: EShipmentStatus.SCHEDULED,
          shipmentType: shipmentType,
          shipmentDate: shipmentDate,
          shipmentTime: shipmentTime,
        },
        {
          where: {
            transactionId,
          },
          returning: true,
        },
      );

      await this.transactionRepositories.update(
        {
          transactionStatus: ETransactionStatus.scheduled_for_shipment,
        },
        { where: { transactionId } },
      );

      return results ? results[0].get() : null;
    } catch (err) {
      this.logger.error('ERROR PAYMENT STATUS');
      this.logger.error('err::: ' + JSON.stringify(err));
      return Promise.reject(err);
    }
  }

  async shippingServiceOption(
    params: ShippingServiceOptionRequest,
  ): Promise<any> {
    this.logger.log('--- SHIPPING SERVICE OPTION ---');
    this.logger.log('params::: ' + JSON.stringify(params));

    try {


      return []
    } catch (error) {
      this.logger.error('ERROR SHIPPING SERVICE OPTION');
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  async shipmentProgress(transactionId: string): Promise<any> {
    this.logger.log('--- SHIPPING PROGRESS ---');
    this.logger.log('transactionId::: ' + JSON.stringify(transactionId));

    try {
      return await this.transactionShipmentRepositories.findOne({
        where: {
          transactionId: transactionId,
        },
      });
    } catch (error) {
      this.logger.error('ERROR SHIPPING PROGRESS');
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  async delete(transactionId: string): Promise<{ isSuccess: boolean }> {
    this.logger.log('DELETE TRANSACTION');
    this.logger.log('transactionId::: ' + JSON.stringify(transactionId));

    try {
      const findTransaction = await this.transactionRepositories.findOne({
        where: { transactionId: transactionId },
        include: [
          {
            model: TransactionItemModel,
            as: 'transactionItems',
          },
        ],
      });

      const resDelTransaction = await this.transactionRepositories.destroy({
        where: { transactionId: transactionId },
      });

      this.logger.log(
        'resDelTransaction::: ' + JSON.stringify(resDelTransaction),
      );

      const resDelTransactionItem = await this.transactionItemRepositories.destroy(
        {
          where: { transactionId: transactionId },
        },
      );

      this.logger.log(
        'resDelTransactionItem::: ' + JSON.stringify(resDelTransactionItem),
      );

      const resDelTransactionShipment = await this.transactionShipmentRepositories.destroy(
        {
          where: { transactionId: transactionId },
        },
      );

      this.logger.log(
        'resDelTransactionShipment::: ' +
          JSON.stringify(resDelTransactionShipment),
      );

      return {
        isSuccess:
          resDelTransaction &&
          resDelTransactionItem &&
          resDelTransactionShipment
            ? true
            : false,
      };
    } catch (error) {
      this.logger.error('ERROR DELETE TRANSACTION');
      this.logger.error(error);
      return Promise.reject(error);
    }
  }
  
  async calculate(params: CreateTransactionRequest): Promise<any> {
    this.logger.log('--- CALCULATE TRANSCTION ---');
    this.logger.log('params::: ' + JSON.stringify(params));

    try {
      let totalProduct = 0;
      let totalWeight = 0;
      let shipmentFee = 0;
      
      for (const item of params.products) {

      }

      return null
    } catch (error) {
      this.logger.error('ERROR CALCULATE TRANSACTION');
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

}