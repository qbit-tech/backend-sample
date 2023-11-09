import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel } from '@qbit-tech/libs-role';
import { UserModule } from '../user/user.module';
import { InitDataController } from './initData.controller';
import { InitDataService } from './initData.service';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel]), UserModule],
  controllers: [InitDataController],
  providers: [InitDataService],
})
export class InitDataModule {}
