import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { FileUploadService } from './file-upload.service';
import { MinioClientService } from './minio-client.service';
import { MinioConfig } from './minio.config'
import { MinioClientController } from './minio.controller';

@Module({
    imports: [
        MinioModule.register({
            endPoint: MinioConfig.MINIO_ENDPOINT,
            port: MinioConfig.MINIO_PORT,
            useSSL: false,
            accessKey: MinioConfig.MINIO_ACCESSKEY,
            secretKey: MinioConfig.MINIO_SECRETKEY,
        })
    ],
    controllers: [MinioClientController],
    providers: [MinioClientService, FileUploadService],
    exports: [MinioClientService, FileUploadService]
})
export class MinioClientModule { }