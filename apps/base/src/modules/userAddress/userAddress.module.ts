import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthSessionModule } from '../authUser/authUser.module';
import { UserAddressController } from './userAddress.controller';
import { UserAddressModel } from './userAddress.entity';
import { UserAddressService } from './userAddress.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserAddressModel,
    ]),
    AuthSessionModule,
  ],
  controllers: [UserAddressController],
  providers: [UserAddressService]
})
export class UserAddressModule { }