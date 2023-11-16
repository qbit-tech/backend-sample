import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserModel } from './user.entity';
import { UserController } from './user.controller';
import { RoleModel, RoleService } from '@qbit-tech/libs-role';
import { ConfigModule } from '@nestjs/config';
import { AuthSessionModule } from '../authUser/authUser.module';
import { MulterModule } from '@nestjs/platform-express';
import { SessionModule } from '@qbit-tech/libs-session';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import * as MulterS3 from 'multer-s3';
import { Endpoint, S3 } from 'aws-sdk';
import { S3Downloader } from '@qbit-tech/libs-uploader/dist/downloader-implementation/s3';
import multer = require('multer');
import path = require('path');

@Module({
  imports: [
    AuthSessionModule,
    SessionModule,
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
    SequelizeModule.forFeature([UserModel, RoleModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    MulterModule.register({
      storage: MulterS3({
        s3: new S3({
          endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
          accessKeyId: process.env.STORAGE_KEY_ID,
          secretAccessKey: process.env.STORAGE_SECRET_KEY,
          region: 'ap-southeast-1',
          s3ForcePathStyle: true,
        }),
        acl: 'public-read',
        bucket: process.env.STORAGE_BUCKET,
        metadata: function (req, file, cb) {
          cb(null, { fieldname: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `${process.env.PROJECT_ID}/users/${Date.now()}.png`);
        },
      }),
    }),
  ],
  providers: [UserService, RoleService],
  controllers: [UserController],
  exports: [UserService, RoleService],
})
export class UserModule {}
