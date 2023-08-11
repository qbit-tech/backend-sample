import {
    Body,
    Controller,
    UseGuards,
    Get,
    Query,
    Delete,
    Param,
    Patch,
    Logger,
    Post,
    HttpException,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { 
    AppRequest, 
    getErrorStatusCode,
    isAdmin,
    cleanPhoneNumber 
} from '@qbit-tech/libs-utils';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import {
  ETransactionStatus,
  TransactionModel,
  TransactionProperties,
} from './entity/transaction.entity';
import { TransactionService } from './service/transaction.service';
import {
  CalculatePointFromTransactionRequest,
  CreateTransactionExternalRequest,
  CreateTransactionRequest,
  CreditCardData,
  HandleNotificationMidtransRequest,
  HandleNotificationResponse,
  ShippingServiceOptionRequest,
  TransactionFindAllRequest,
  TransactionFindAllResponse,
  UpdateTransactionStatusRequest,
} from './transaction.contract';
import { ERoles } from '../../core/roles';
import { convertSortQuery } from '@qbit-tech/libs-utils';
import axios from 'axios';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  
  constructor(
    private transactionService: TransactionService,
  ) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthPermissionGuard())
  @ApiOperation({ summary: 'Find All Transactions' })
  async findAll(
    @Query() query: TransactionFindAllRequest,
    @Req() req: AppRequest,
  ): Promise<TransactionFindAllResponse> {
    this.logger.log(' -- FIND ALL -');
    this.logger.log('query: ' + JSON.stringify(query));

    if (!isAdmin(req.user.userType, ERoles)) {
      query = {
        ...query,
        buyerId: req.user.userId,
      };
    }

    try {
      const res = await this.transactionService.findAll({
        ...query,
        sort: convertSortQuery(query.sort),
      });
      return res;
    } catch (err) {
      this.logger.error('ERROR FIND ALL');
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }
 
  @ApiBearerAuth()
  @Get('/:transactionId')
  @UseGuards(AuthPermissionGuard())
  @ApiOperation({ summary: 'Find One Transaction' })
  async findOne(
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionProperties> {
    this.logger.log('-- FIND ONE --');
    this.logger.log('transactionId: ' + transactionId);

    try {
      const res = await this.transactionService.findOne(transactionId);
      return res;
    } catch (err) {
      this.logger.error('ERROR FIND ONE');
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthPermissionGuard())
  @ApiOperation({ summary: 'Create new transaction' })
  async create(
    @Body() body: CreateTransactionRequest,
    @Req() req: AppRequest,
  ): Promise<TransactionProperties> {
    this.logger.log('-- CREATE --');
    this.logger.log('body: ' + JSON.stringify(body));

    try {
      const res = await this.transactionService.create(body, req);
      return res;
    } catch (err) {
      this.logger.error('ERROR CREATE');
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  @ApiBearerAuth()
  @Post('shipping-service-option')
  @UseGuards(AuthPermissionGuard())
  async shippingServiceOption(
    @Body() body: ShippingServiceOptionRequest,
  ): Promise<any> {
    this.logger.log('-- SHIPPING SERVICE OPTION --');
    this.logger.log('body: ' + JSON.stringify(body));

    try {
      const res = await this.transactionService.shippingServiceOption({
        ...body,
      });

      return res;
    } catch (err) {
      this.logger.error('ERROR shipping service option');
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }

  
  @ApiBearerAuth()
  @Post('calculate')
  @UseGuards(AuthPermissionGuard())
  async calculate(
    @Body() body: CreateTransactionRequest,
  ): Promise<TransactionProperties> {
    this.logger.log('-- CALCULATE --');
    this.logger.log('body: ' + JSON.stringify(body));

    try {
      const res = await this.transactionService.calculate({
        ...body,
      });
      return res;
    } catch (err) {
      this.logger.error('ERROR CALCULATE');
      this.logger.error(err);
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }
}