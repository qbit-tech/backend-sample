import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BannerModel } from './banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { ConfigModule } from '@nestjs/config';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { MulterModule } from '@nestjs/platform-express';
import { AuthSessionModule } from '../authUser/authUser.module';
import {
  UPLOADER_OPTIONS,
  generateMulterOptions,
} from '../../../config/uploader';

@Module({
  imports: [
    // SessionModule,
    AuthSessionModule,
    // NewsModule,
    // BankApprovalModule,
    SequelizeModule.forFeature([BannerModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    UploaderModule.forRoot(UPLOADER_OPTIONS),
    MulterModule.register(generateMulterOptions('banner')),
  ],
  providers: [BannerService],
  controllers: [BannerController],
  exports: [BannerService]
})

export class BannerModule { }