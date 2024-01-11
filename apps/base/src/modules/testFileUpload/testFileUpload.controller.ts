import {
  Controller,
  Put,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploaderService } from '@qbit-tech/libs-uploader';

@ApiTags('Test File Upload')
@Controller('test-file-upload')
export class TestFileUploadController {
  constructor(
    private uploaderService: UploaderService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file): Promise<any> {
    try {
      // const user = await this.userService.findOneByUserId(req.user.userId)
      return file;
    } catch (error) {
      console.info('err_banner: create', error);
      throw new HttpException(
        { code: 400, message: error.toString(), payload: {} },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
