import { Module } from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';
import { FileUploadController } from './fileUpload.controller';
import { MinioClientModule } from '../minioClient.module'
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { Endpoint, S3 } from 'aws-sdk';
import { S3Downloader } from '@qbit-tech/libs-uploader/dist/downloader-implementation/s3';
import { MulterModule } from '@nestjs/platform-express';
import * as MulterS3 from 'multer-s3';

@Module({
    imports: [
        MinioClientModule,
        UploaderModule.forRoot({
            cacheTimeout: -1,
            defaultMetadata: {
                Bucket: process.env.STORAGE_BUCKET,
            },
            downloader: new S3Downloader({
                endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
                accessKeyId: process.env.STORAGE_KEY_ID,
                secretAccessKey: process.env.STORAGE_SECRET_KEY
            }),
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
                metadata: function (req, file, cb) {
                    cb(null, { fieldname: file.fieldname });
                },
                key: function (req, file, cb) {
                    cb(null, `backend-template/images/${Date.now()}.png`);
                },
            }),
        }),
    ],
    providers: [FileUploadService],
    controllers: [FileUploadController]
})
export class FileUploadModule { }