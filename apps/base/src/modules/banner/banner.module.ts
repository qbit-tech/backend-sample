import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BannerModel } from './banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { ConfigModule } from '@nestjs/config';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { S3Downloader } from '@qbit-tech/libs-uploader';
import { Endpoint, S3 } from 'aws-sdk';
import { MulterModule } from '@nestjs/platform-express';
import * as MulterS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { SessionModule } from '@qbit-tech/libs-session';
// import { NewsModule } from '../news/news.module';
// import { BankApprovalModule } from '../bank-approval/bank-approval.module';

@Module({
  imports: [
    SessionModule,
    // NewsModule,
    // BankApprovalModule,
    SequelizeModule.forFeature([BannerModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
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
    MulterModule.register({
      storage: MulterS3({
        s3: new S3({
          endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
          accessKeyId: process.env.STORAGE_KEY_ID,
          secretAccessKey: process.env.STORAGE_SECRET_KEY,
        }),
        acl: 'public-read',
        bucket: process.env.STORAGE_BUCKET,
        metadata: function (req, file, cb) {
          cb(null, { fieldname: file.fieldname })
        },
        key: function (req, file, cb) {
          cb(null, `vines/banner/${uuidv4()}`);
        }
      })
    }),
  ],
  providers: [BannerService],
  controllers: [BannerController],
  exports: [BannerService]
})

export class BannerModule { }