import { S3Downloader } from '@qbit-tech/libs-uploader';
import { Endpoint, S3 } from 'aws-sdk';
import * as MulterS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

export const UPLOADER_OPTIONS = {
  cacheTimeout: -1,
  defaultMetadata: {
    Bucket: process.env.STORAGE_BUCKET,
  },
  downloader: new S3Downloader({
    endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
    accessKeyId: process.env.STORAGE_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
  }),
};

export const generateMulterOptions = (folderPath: string) => {
  return {
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
        cb(
          null,
          `${process.env.PROJECT_ID || 'project_id'}/${folderPath}/${uuidv4()}`,
        );
      },
    }),
  };
};
