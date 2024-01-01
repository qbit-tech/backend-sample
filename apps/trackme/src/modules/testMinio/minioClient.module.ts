import { Module } from '@nestjs/common';
import { MinioClientService } from './minioClient.service';
import { MinioModule } from 'nestjs-minio-client';
import { MinioConfig } from './config';
import { MulterModule } from '@nestjs/platform-express';
import * as MulterS3 from 'multer-s3';
import { Endpoint, S3 } from 'aws-sdk';
import { S3Downloader } from '@qbit-tech/libs-uploader/dist/downloader-implementation/s3';
import { UploaderModule } from '@qbit-tech/libs-uploader';

@Module({
  imports: [
    MinioModule.register({
      endPoint: MinioConfig.MINIO_ENDPOINT,
      useSSL: true,
      accessKey: MinioConfig.MINIO_ACCESSKEY,
      secretKey: MinioConfig.MINIO_SECRETKEY,
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService]
})
export class MinioClientModule { }
