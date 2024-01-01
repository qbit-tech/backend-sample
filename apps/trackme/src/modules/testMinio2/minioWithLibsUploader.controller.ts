import {
    Controller,
    HttpException,
    Post,
    UseInterceptors,
    Get,
    Logger,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@qbit-tech/libs-uploader';

@ApiTags('Test Minio 2')
@Controller('test-minio-2')
export class TestMinio2Controller {
    constructor(
        private uploaderService: UploaderService,
    ) { }

    @Get('')
    test() {
        return 'test'
    }

    @Post('')
    @UseInterceptors(FilesInterceptor('image'))
    async createImages(
        @UploadedFile() file,
    ): Promise<any> {
        try {
            await this.uploaderService.updateImage(
                'product-images',
                'test',
                file,
            );
        } catch (error) {
            Logger.log(error)
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }
}
