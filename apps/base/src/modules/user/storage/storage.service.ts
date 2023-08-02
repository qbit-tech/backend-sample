import { Injectable, Logger } from '@nestjs/common';
import { S3, Endpoint } from 'aws-sdk';
import { extname } from 'path';
import * as randomString from 'randomstring';
import * as moment from 'moment';

@Injectable()
export class StorageService {
  async uplaod(file) {
    const { originalname } = file;
    const bucketS3 = process.env.STORAGE_BUCKET;
    const identifier = randomString.generate({
      length: 5,
      charset: 'alphanumeric',
      capitalization: 'lowercase',
    });

    const fileName = `${
      process.env.NODE_ENV
    }/user_upload/profile_pic_${moment().format(
      'YYYYMMDD_HHmmssSS',
    )}_${identifier + extname(originalname)}`;

    await this.uploadS3(file.buffer, bucketS3, fileName);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  private getS3() {
    const spaceEndpoint = new Endpoint(process.env.STORAGE_ENDPOINT);
    return new S3({
      endpoint: spaceEndpoint,
      accessKeyId: process.env.STORAGE_KEY_ID,
      secretAccessKey: process.env.STORAGE_SECRET_KEY,
    });
  }
}
