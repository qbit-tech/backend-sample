import { Injectable } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { BufferedFile } from './file.model';

@Injectable()
export class FileUploadService {
    constructor(
        private minioClientService: MinioClientService
    ) { }

    async uploadSingle(image: BufferedFile) {

        let uploaded_image = await this.minioClientService.upload(image)

        return {
            image_url: uploaded_image.url,
            message: "Successfully uploaded to MinIO S3"
        }
    }
}