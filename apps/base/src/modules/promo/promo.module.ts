import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromoController } from './promo.controller';
import { PromoModel } from './promo.entity';
import { AuthSessionModule } from '../authUser/authUser.module';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { ConfigModule } from '@nestjs/config';
import { S3Downloader } from '@qbit-tech/libs-uploader';
import { Endpoint, S3 } from 'aws-sdk';

@Module({
    imports: [
        SequelizeModule.forFeature([PromoModel]),
        UploaderModule.forRoot({
            cacheTimeout: -1,
            defaultMetadata: {
              Bucket: process.env.STORAGE_BUCKET,
            },
            downloader: new S3Downloader({
              endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
              accessKeyId: process.env.STORAGE_KEY_ID,
              secretAccessKey: process.env.STORAGE_SECRET_KEY,
            }),
          }),
    ],
    providers: [PromoService],
    controllers: [PromoController],
})
export class PromoModule {}