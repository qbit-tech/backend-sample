import { Module } from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';
import { FileUploadController } from './fileUpload.controller';
import { MinioClientModule } from '../minioClient.module';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { MulterModule } from '@nestjs/platform-express';
import {
  UPLOADER_OPTIONS,
  generateMulterOptions,
} from 'apps/base/config/uploader';

@Module({
  imports: [
    MinioClientModule,
    UploaderModule.forRoot(UPLOADER_OPTIONS),
    MulterModule.register(generateMulterOptions('test-minio')),
  ],
  providers: [FileUploadService],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
