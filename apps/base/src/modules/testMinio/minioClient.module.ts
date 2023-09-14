import { Module } from '@nestjs/common';
import { MinioClientService } from './minioClient.service';
import { MinioModule } from 'nestjs-minio-client';
import { MinioConfig } from './config';

import * as MulterS3 from 'multer-s3';
import { Endpoint, S3 } from 'aws-sdk';
import { S3Downloader } from '@qbit-tech/libs-uploader/dist/downloader-implementation/s3';

@Module({
    imports: [
        MinioModule.register({
            endPoint: MinioConfig.MINIO_ENDPOINT,
            port: MinioConfig.MINIO_PORT,
            useSSL: false,
            accessKey: MinioConfig.MINIO_ACCESSKEY,
            secretKey: MinioConfig.MINIO_SECRETKEY,
        }),
        MulterModule.register({
            storage: MulterS3({
                  s3: new S3({
                    endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
                    accessKeyId: process.env.STORAGE_KEY_ID,
                    secretAccessKey: process.env.STORAGE_SECRET_KEY,
                    region: 'ap-southeast-1',
                    s3ForcePathStyle: true
                  }),
                  acl: 'public-read',
                  bucket: process.env.STORAGE_BUCKET,
                    metadata: function(req, file, cb) {
                    cb(null, { fieldname: file.fieldname });
                  },
                  key: function(req, file, cb) {
                    cb(null, `backend-template/images/${Date.now()}.png`);
                  },
                }),
          }),
    ],
    providers: [MinioClientService],
    exports: [MinioClientService]
})
export class MinioClientModule { }
