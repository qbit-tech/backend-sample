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
//   import {
//     cnoteProperties,
//     historyProperties,
//   } from 'libs/jne/src/types/getRequest.type';
  
  export enum ECourierVendor {
    JNE = 'JNE',
    RPX = 'RPX',
    REX = 'REX',
    INTERNAL = 'INTERNAL',
  }
  
  export enum EShipmentStatus {
    CREATED = 'CREATED',
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN PROGRESS',
    DELIVERED = 'DELIVERED',
  }

  export type ShipmentProgress= {
    date: string;
    desc: string;
    code: string;
  }
  
  export type ShipToAddress = {
    province: string;
    regency: string;
    district: string;
    postalCode: number;
    destinationCode: string;
    address: string;
    additionalInfo: string;
    receiverName: string;
    receiverPhone: string;
  };
  
  export type courierServiceProperties = {
    service: string;
    serviceCode: string;
    cost: {
      currency: string;
      value: number;
      etd: string;
      note: string;
    };
  };
  
  export type TransactionShipmentProperties = {
    transactionShipmentId: string;
    transactionId: string;
    courierVendor: ECourierVendor;
    courirService: courierServiceProperties;
    shipToAdress: ShipToAddress;
    weightInGram: number;
    volumeInCM: number;
    waybill?: string;
    shipmentProgress?: ShipmentProgress[];
    shipmentDetail?: any;
    shipmentType?: string; // pickup or drop
    shipmentDate?: string;
    shipmentTime?: string;
    jneResponse?: any;
    lastJNEStatus?: number;
    cost?: number;
    shipmentStatus?: EShipmentStatus;
    createdAt: Date;
    updatedAt: Date;
    transaction: TransactionProperties;
  };
  
  @Table({
    tableName: 'transaction_shipments',
    timestamps: true,
  })
  export class TransactionShipmentModel extends Model {
    @PrimaryKey
    @Column
    transactionShipmentId: string;
  
    @Column
    transactionId: string;
  
    @Column({
      type: DataType.ENUM,
      values: Object.values(ECourierVendor),
    })
    courierVendor: ECourierVendor;
  
    @Column({ type: DataType.JSONB })
    courirService: any;
  
    @Column({ type: DataType.JSONB })
    shipToAdress: ShipToAddress;
  
    @Column
    weightInGram: number;
  
    @Column
    volumeInCM: number;
  
    @Column
    waybill?: string;

    @Column({ type: DataType.JSONB })
    shipmentProgress?: ShipmentProgress[];

    @Column({ type: DataType.JSONB })
    shipmentDetail?: any;

    @Column
    shipmentType?: string;

    @Column
    shipmentDate?: string;

    @Column
    shipmentTime?: string;

    @Column({ type: DataType.JSONB })
    jneResponse?: any;

    @Column
    lastJNEStatus?: number;

    @Column
    cost?: number;
  
    @Column({
      type: DataType.ENUM,
      values: Object.values(EShipmentStatus),
    })
    shipmentStatus?: EShipmentStatus;
  
    @UpdatedAt
    updatedAt: Date;
  
    @CreatedAt
    createdAt: Date;
  
    @BelongsTo(() => TransactionModel, 'transactionId')
    transaction: TransactionModel;
  }
  