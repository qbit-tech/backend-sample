import {
    Table,
    Model,
    PrimaryKey,
    Column,
    UpdatedAt,
    CreatedAt,
    DataType,
    BelongsTo,
  } from 'sequelize-typescript';
  import { TransactionModel, TransactionProperties } from './transaction.entity';
  
  export type Product = {
    productName: string
  }
  export type TransactionItemProperties = {
    transactionItemId: string;
    transactionId: string;
    productId: string;
    metaProduct: Product;
    qty: number;
    unit: string;
    pricePerUnit: number;
    discountPerUnit?: number;
    additionalFee?: number;
    totalFinalPrice: number;
    includeTax?: boolean;
    createdAt: Date;
    updatedAt: Date;
    transaction: TransactionProperties;
  };
  
  @Table({
    tableName: 'transaction_items',
    timestamps: true,
  })
  export class TransactionItemModel extends Model {
    @PrimaryKey
    @Column
    transactionItemId: string;
  
    @Column
    transactionId: string;
  
    @Column
    productId: string;
  
    @Column({ type: DataType.JSONB })
    metaProduct: Product;
  
    @Column
    qty: number;
  
    @Column
    unit: string;
  
    @Column
    pricePerUnit: number;
  
    @Column
    discountPerUnit?: number;
  
    @Column
    additionalFee?: number;
  
    @Column
    includeTax?: boolean;
  
    @Column
    totalFinalPrice: number;
  
    @UpdatedAt
    updatedAt: Date;
  
    @CreatedAt
    createdAt: Date;
  
    @BelongsTo(() => TransactionModel, 'transactionId')
    transaction: TransactionModel;
  }
  