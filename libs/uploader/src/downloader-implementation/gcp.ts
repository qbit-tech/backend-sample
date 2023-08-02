import { FileDownloader } from "../interfaces/file-downloader";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Storage } = require('@google-cloud/storage');

export type GCPMetadata = {
  Bucket: string;
};

export class GCPDownloader {
  private storage: Storage; 

  constructor(
    private readonly options: { projectId: string; keyFileName: string },
  ) {
      // Creates a client
      this.storage = new Storage({
        projectId: this.options.projectId,
        keyFileName: this.options.keyFileName,
      });
    }

  async getLink(params: {
    metadata: GCPMetadata;
    filePath: string;
    expired: number;
  }): Promise<any> {
    if(params.expired === -1) {
      params.expired =
        Date.now() + 5 * 365 * 3600 * 1000; // default: 5 years
    }
    const options = {
      version: 'v2',
      action: 'read',
      expires: params.expired, 
    };

    // Get a v4 signed URL for uploading file
    const [url] = await this.storage
      .bucket(params.metadata.Bucket)
      .file(params.filePath)
      .getSignedUrl(options);

    console.log(`The generatedSignedUploadUrl for ${params.filePath} is : ${url}`);
    return url;
  }

  // async getFile(params: {
  //   metadata: GCPMetadata;
  //   filePath: string;
  // }): Promise<any> {
  //   return this.storage.getObject({
  //     Bucket: params.metadata.Bucket,
  //     Key: params.filePath,
  //   });
  // }

  async delFile(params: {
    metadata: GCPMetadata;
    filePath: string;
  }): Promise<any> {
    const generationMatchPrecondition = 0;
    const deleteOptions = {
      ifGenerationMatch: generationMatchPrecondition,
    };
    return this.storage
      .bucket(params.metadata.Bucket)
      .file(params.filePath)
      .delete(deleteOptions);
  }

  // async isFileExist(params: {
  //   metadata: GCPMetadata;
  //   filePath: string;
  // }): Promise<boolean> {
  //   try {
  //     await this.storage.headObject({
  //       Bucket: params.metadata.Bucket,
  //       Key: params.filePath,
  //     });

  //     return true;
  //   } catch (err) {
  //     return false;
  //   }
  // }
}