import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { MulterModule } from '@nestjs/platform-express';
import { TestFileUploadController } from './testFileUpload.controller';
import {
  UPLOADER_OPTIONS,
  generateMulterOptions,
} from '../../../config/uploader';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    UploaderModule.forRoot(UPLOADER_OPTIONS),
    MulterModule.register(generateMulterOptions('test-file-upload')),
  ],
  providers: [],
  controllers: [TestFileUploadController],
  exports: [],
})
export class TestFileUploadModule {}
