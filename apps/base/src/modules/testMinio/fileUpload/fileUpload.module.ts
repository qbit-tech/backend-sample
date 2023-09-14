import { Module } from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';
import { FileUploadController } from './fileUpload.controller';
import { MinioClientModule } from '../minioClient.module'

@Module({
    imports: [
        MinioClientModule
    ],
    providers: [FileUploadService],
    controllers: [FileUploadController]
})
export class FileUploadModule { }