import { Module } from '@nestjs/common';
import { MinioClientService } from './minioClient.service';
import { MinioModule } from 'nestjs-minio-client';
import { MinioConfig } from './config'
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
    providers: [MinioClientService],
    exports: [MinioClientService]
})
export class MinioClientModule { }
