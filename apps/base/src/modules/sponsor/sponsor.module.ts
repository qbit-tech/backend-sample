import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SponsorModel } from './sponsor.entity';
import { ConfigModule } from '@nestjs/config';
// import { EventLogModule } from '../eventLog/eventLog.module';
import { SponsorService } from './sponsor.service';
// import { EventTagModel } from '../event/eventTag.entity';
// import { EventTagService } from '../event/eventTag.service';
import { SponsorController } from './sponsor.controller';
import { AuthSessionModule } from '../authUser/authUser.module';
import { S3Downloader, UploaderModule } from '@qbit-tech/libs-uploader';
import { Endpoint, S3 } from 'aws-sdk';
import { MulterModule } from '@nestjs/platform-express';
import * as MulterS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    AuthSessionModule,
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
    SequelizeModule.forFeature([SponsorModel]),
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
        }),
        acl: 'public-read',
        bucket: process.env.STORAGE_BUCKET,
        metadata: function (req, file, cb) {
          cb(null, { fieldname: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `${process.env.PROJECT_ID}/sponsors/${uuidv4()}`);
        },
      }),
    }),
  ],
  providers: [SponsorService],
  controllers: [SponsorController],
  exports: [SponsorService],
})
export class SponsorModule {}
