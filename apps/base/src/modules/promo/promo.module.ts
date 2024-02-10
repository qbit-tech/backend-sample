import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromoController } from './promo.controller';
import { PromoModel } from './promo.entity';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import {
  UPLOADER_OPTIONS,
  generateMulterOptions,
} from '../../../config/uploader';

@Module({
  imports: [
    SequelizeModule.forFeature([PromoModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    UploaderModule.forRoot(UPLOADER_OPTIONS),
    MulterModule.register(generateMulterOptions('promo')),
  ],
  providers: [PromoService],
  controllers: [PromoController],
})
export class PromoModule {}