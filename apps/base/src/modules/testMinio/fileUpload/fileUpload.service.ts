import { HttpException, Injectable, Logger } from '@nestjs/common';
import { MinioClientService } from '../minioClient.service';
import { BufferedFile } from '../file.model';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';

@Injectable()
export class FileUploadService {
    constructor(
        private minioClientService: MinioClientService
    ) { }

    async upload(image: BufferedFile) {

        try {
            let uploaded_image = await this.minioClientService.upload(image)

            return {
                image_url: uploaded_image.url,
                message: "Successfully uploaded to MinIO S3"
            }

        } catch (error) {
            Logger.log(error)
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }
}