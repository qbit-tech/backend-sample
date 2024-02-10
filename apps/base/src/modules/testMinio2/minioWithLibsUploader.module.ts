import { Module } from '@nestjs/common';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '@qbit-tech/libs-session';
import { TestMinio2Controller } from './minioWithLibsUploader.controller';
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
    MulterModule.register(generateMulterOptions('test-minio')),
    SessionModule,
  ],
  controllers: [TestMinio2Controller],
})
export class TestMinio2Module {}
