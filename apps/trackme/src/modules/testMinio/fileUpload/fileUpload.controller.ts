import { Controller, Post, UseInterceptors, UploadedFile, Logger, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileUploadService } from './fileUpload.service';
import { BufferedFile } from '../file.model';
import { ApiTags } from '@nestjs/swagger';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';

@ApiTags('Test Minio')
@Controller('file-upload')
export class FileUploadController {
    constructor(
        private fileUploadService: FileUploadService,
    ) { }

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    async upload(
        @UploadedFile() image: BufferedFile | any
    ) {
        try {
            return await this.fileUploadService.upload(image)
        } catch (error) {
            Logger.log(error)
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }
}