/* eslint-disable @typescript-eslint/class-name-casing */
import { IsNotEmpty, IsNumber, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  ETransactionStatus,
  TransactionProperties,
} from './entity/transaction.entity';
import { PaginationResponse, DefaultFindAllRequest } from '@qbit-tech/libs-utils';
import { ECourierVendor } from './entity/transactionShipment.entity';

export class TransactionFindAllRequest extends DefaultFindAllRequest {
  @ApiPropertyOptional()
  buyerId?: string;

  @ApiPropertyOptional({ description: 'example fieldName:ACS|DESC' })
  sort?: string;

  @ApiPropertyOptional()
  transactionStatus?: string;

  @ApiPropertyOptional()
  shipmentType?: string;

  @ApiPropertyOptional()
  startAt?: string;

  @ApiPropertyOptional()
  endAt?: string;
}

export class TransactionFindAllResponse extends PaginationResponse {
  @ApiProperty()
  results: TransactionProperties[];
}

export class ShippingAddressData {
  @ApiProperty()
  province: string;

  @ApiProperty()
  regency: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  postalCode: number;

  @ApiProperty()
  destinationCode: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  additionalInfo: string;

  @ApiPropertyOptional()
  receiverName: string;

  @ApiPropertyOptional()
  receiverPhone: string;
}

export class CostServiceData {
  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  value: number;

  @ApiProperty()
  etd: string;

  @ApiPropertyOptional()
  note: string;
}

export class CourierServiceData {
  @ApiProperty()
  service: string;

  @ApiProperty()
  serviceCode: string;

  @ApiProperty()
  cost: CostServiceData;
}

export class ShippingData {
  @ApiProperty()
  shippingAddress: ShippingAddressData;

  @ApiProperty({ example: 'JNE/RPX/REX/INTERNAL' })
  selectShipping: ECourierVendor;

  @ApiPropertyOptional()
  serviceCode: string;

  @ApiPropertyOptional()
  courirService: CourierServiceData;
}

export class ProductItem {
  @ApiPropertyOptional()
  productId: string;

  @ApiPropertyOptional()
  promoId: string;

  @ApiPropertyOptional()
  redeemProductId: string;

  @ApiProperty()
  qty: number;

  @ApiProperty({ description: 'if isRedeem pricePerUnit value is Point' })
  pricePerUnit: number;
}

export class CreditCardData {
  @ApiProperty()
  @IsString()
  card_number: string;

  @ApiProperty()
  @IsString()
  card_exp_month: string;

  @ApiProperty()
  @IsString()
  card_exp_year: string;

  @ApiProperty()
  @IsString()
  card_cvv: string;
}

export class CreateTransactionRequest {
  @ApiProperty({ type: [ProductItem] })
  products: ProductItem[];

  // @ApiProperty()
  // shipping: ShippingData;
}

export class UpdateTransactionStatusRequest {
  @ApiProperty({
    enum: ETransactionStatus,
    enumName: 'ETransactionStatus',
    example: ETransactionStatus.done,
  })
  transactionStatus: ETransactionStatus;
}

export class TransactionItemRequest {
  @ApiProperty()
  metaProduct: any;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  unitOfMeasure: string;

  @ApiProperty()
  pricePerUnit: number;
}

export class CalculatePointFromTransactionRequest {
  @ApiProperty({ type: [TransactionItemRequest] })
  transactionItems: TransactionItemRequest[];
}

export class CreateTransactionExternalRequest extends CalculatePointFromTransactionRequest {
  @ApiPropertyOptional({ example: { phone: '628xxxxxxxxxx' } })
  userPhoneCountryCode: string;

  @ApiPropertyOptional({ example: { phone: '628xxxxxxxxxx' } })
  userPhone: string;
}

export class ShippingServiceOptionRequest {
  @ApiProperty({ example: 'CGK10000' })
  originCode: string;

  @ApiProperty({ example: 'BDO10000' })
  destinationCode: string;

  @ApiProperty()
  weight: number;
}

export class HandleNotificationMidtransRequest {
  @ApiProperty()
  status_code: string;

  @ApiProperty()
  status_message: string;

  @ApiProperty()
  transaction_id: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty()
  gross_amount: string;

//   @ApiProperty()
//   payment_type: EPaymentTypeMidTrans;

  @ApiProperty()
  transaction_time: string;

//   @ApiProperty()
//   transaction_status: EMidtransTransactionStatus;

//   @ApiProperty()
//   fraud_status: EFraudStatus;

  @ApiPropertyOptional()
  permata_va_number?: string;

  @ApiPropertyOptional()
  signature_key?: string;

  @ApiPropertyOptional()
  channel_response_code?: string;

  @ApiPropertyOptional()
  channel_response_message?: string;
}

export class HandleNotificationResponse {
  status_code: number;
  status_message: string;
}
