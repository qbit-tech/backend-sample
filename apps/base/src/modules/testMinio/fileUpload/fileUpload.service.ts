import { HttpException, Injectable, Logger } from '@nestjs/common';
import { MinioClientService } from '../minioClient.service';
import { BufferedFile } from '../file.model';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { UploaderService } from '@qbit-tech/libs-uploader';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
    constructor(
        private minioClientService: MinioClientService,
        private uploaderService: UploaderService,
    ) { }

    async upload(image: BufferedFile | any) {

        try {
            let uploaded_image = await this.minioClientService.upload(image)

            await this.uploaderService.updateImage(
                'minio',
                uuidv4(),
                image,
            );

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