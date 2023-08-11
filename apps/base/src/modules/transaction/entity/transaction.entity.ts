/* eslint-disable @typescript-eslint/camelcase */
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  UpdatedAt,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import {
  TransactionItemModel,
  TransactionItemProperties,
} from './transactionItem.entity';
import {
  TransactionShipmentModel,
  TransactionShipmentProperties,
} from './transactionShipment.entity';
import { 
  TransactionLogModel, 
  TransactionLogProperties 
} from './transactionLog.entity';
  
  export enum ETransactionStatus {
    created = 'created', // transaksi berhasil terbuat / waiting approval
    waiting_payment = 'waiting_payment', // menunggu pembayaran
    paid = 'paid', // dibayar
    expired = 'expired', // expired
    scheduled_for_shipment = 'scheduled_for_shipment',
    shipped = 'shipped', // dikirim
    done = 'done', //diterima
  
    canceled_by_buyer = 'canceled_by_buyer', // dibatalkan oleh buyer
    canceled_by_seller = 'canceled_by_seller', // dibatalkan oleh seller
    canceled_by_admin = 'canceled_by_admin', // dibatalkan oleh admin

    rejected_by_seller = 'rejected_by_seller', // ditolak oleh seller
    rejected_by_seller_noresponse = 'rejected_by_seller_noresponse', // ditolak karena seller tidak memberikan resnponse
    
    refund_requested = 'refund_requested', // permintaan refund dikirim
    refund_approved = 'refund_approved', // permintaan refunded diterima
    refund_processed = 'refund_processed', // permintaan refunded diproses
    refund_rejected = 'refund_rejected', // permintaan refunded ditolak
  }

  export type Buyer = {
    name: string;
    email: string;
    phone: string;
  }

  export type Seller = {
    name?: string;
    storeName: string;
    email: string;
    phone: string;
    address: string;
  }

  export type CalculationDetail = {
    key: string;
    type: string;
    label: string;
    value: number;
  }
  
  export type TransactionProperties = {
    transactionId: string;
    transactionCode: string;
    totalPrice: number;
    totalAdminFee?: number;
    totalTax?: number;
    totalAdditionalFee?: number;
    totalDiscount?: number;
    totalFinalPrice: number;
    buyerId: string;
    buyerDetail: Buyer;
    sellerId: string;
    sellerDetail: Seller;
    calculationDetails?: CalculationDetail[];
    transactionStatus: ETransactionStatus;
    expiredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    transactionItems?: TransactionItemProperties[];
    transactionLogs?: TransactionLogProperties[];
    transactionShipment?: TransactionShipmentProperties;
  };
  
  @Table({
    tableName: 'transactions',
    timestamps: true,
  })
  export class TransactionModel extends Model {
    @PrimaryKey
    @Column
    transactionId: string;
  
    @Column
    transactionCode: string;
  
    @Column
    totalPrice: number;
  
    @Column
    totalAdminFee?: number;
  
    @Column
    totalTax?: number;
  
    @Column
    totalAdditionalFee?: number;
  
    @Column
    totalDiscount?: number;
  
    @Column
    totalFinalPrice: number;
  
    @Column
    buyerId: string;
  
    @Column({ type: DataType.JSONB })
    buyerDetail: Buyer;
  
    @Column
    sellerId: string;
  
    @Column({ type: DataType.JSONB })
    sellerDetail: Seller;
  
    @Column({ type: DataType.JSONB })
    calculationDetails: CalculationDetail[];

    @Column({
      type: DataType.ENUM,
      values: Object.values(ETransactionStatus),
    })
    transactionStatus: ETransactionStatus;
  
    @Column
    expiredAt?: Date;
  
    @UpdatedAt
    updatedAt: Date;
  
    @CreatedAt
    createdAt: Date;
  
    @HasMany(() => TransactionItemModel, 'transactionId')
    transactionItems: TransactionItemModel[];
  
    @HasMany(() => TransactionLogModel, 'transactionId')
    transactionLogs: TransactionLogModel[];
  
    @HasOne(() => TransactionShipmentModel, 'transactionId')
    transactionShipment: TransactionShipmentModel;
  }
  