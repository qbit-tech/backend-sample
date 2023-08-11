/* eslint-disable @typescript-eslint/camelcase */
import {
    Column,
    Model,
    PrimaryKey,
    Table,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    DataType,
  } from 'sequelize-typescript';
  import { TransactionModel } from './transaction.entity';
  import { JSONB } from 'sequelize';
  import { TransactionProperties } from './transaction.entity';
  
  export type TransactionLogProperties = {
    transactionId: string;
    dataBefore?: TransactionProperties;
    dataAfter?: TransactionProperties;
    note?: string;
    updatedBy: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  @Table({
    tableName: 'transaction_logs',
    timestamps: true,
  })
  export class TransactionLogModel extends Model {
    @Column
    transactionId: string;
  
    @Column({ type: DataType.JSONB })
    dataBefore: TransactionProperties;
  
    @Column({ type: DataType.JSONB })
    dataAfter: TransactionProperties;
  
    @Column
    note?: string;
  
    @Column
    updatedBy: string;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  
    @BelongsTo(() => TransactionModel, 'transactionId')
    transaction: TransactionModel;
  }
  