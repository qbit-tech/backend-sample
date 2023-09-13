import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from './file.model';

@ApiTags('Test Minio')
@Controller('test-minio')
export class MinioClientController {
    constructor(
        private fileUploadService: FileUploadService
    ) { }

    @Post('single-upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadSingle(
        @UploadedFile() image: BufferedFile
    ) {
        return await this.fileUploadService.uploadSingle(image)
    }
}