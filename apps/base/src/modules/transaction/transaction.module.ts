import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { TransactionService } from './service/transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionModel } from './entity/transaction.entity';
import { UserModule } from '../user/user.module';
import { TransactionItemModel } from './entity/transactionItem.entity';
import { TransactionShipmentModel } from './entity/transactionShipment.entity';
import { TransactionLogModel } from './entity/transactionLog.entity';
import { AuthSessionModule } from '../authUser/authUser.module';

@Module({
    imports: [
      SequelizeModule.forFeature([
        TransactionModel,
        TransactionItemModel,
        TransactionShipmentModel,
        TransactionLogModel
      ]),
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: process.env.ENV_PATH,
      }),
      UserModule,
      AuthSessionModule
    ],
    providers: [
      TransactionService,
    ],
    controllers: [TransactionController],
    exports: [TransactionService],
  })
  export class TransactionModule {}
  