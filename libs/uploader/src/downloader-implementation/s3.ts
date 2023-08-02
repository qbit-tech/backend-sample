import { FileDownloader } from "../interfaces/file-downloader";
import { S3, Endpoint } from "aws-sdk";

export type S3Metadata = {
  Bucket: string;
};

export class S3Downloader implements FileDownloader {
  private s3: S3; 

  constructor(
    private readonly options: S3.ClientConfiguration,
  ) { 
    this.s3 = new S3(this.options);
  }

  async getLink(params: {
    metadata: S3Metadata;
    filePath: string;
    expired: number;
  }): Promise<any> {
    if(params.expired === -1) {
      const url = `https://${params.metadata.Bucket}.${(this.options.endpoint as Endpoint).hostname}/${params.filePath}`;
      console.log('url: ', url);
      return url;
    }
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: params.metadata.Bucket,
      Key: params.filePath,
      Expires: params.expired,
    });
  }

  async getFile(params: {
    metadata: S3Metadata;
    filePath: string;
  }): Promise<any> {
    return this.s3.getObject({
      Bucket: params.metadata.Bucket,
      Key: params.filePath,
    });
  }

  async delFile(params: {
    metadata: S3Metadata;
    filePath: string;
  }): Promise<any> {
    return this.s3.deleteObject({
      Bucket: params.metadata.Bucket,
      Key: params.filePath,
    });
  }

  async isFileExist(params: {
    metadata: S3Metadata;
    filePath: string;
  }): Promise<boolean> {
    try {
      await this.s3.headObject({
        Bucket: params.metadata.Bucket,
        Key: params.filePath,
      });

      return true;
    } catch (err) {
      return false;
    }
  }
}