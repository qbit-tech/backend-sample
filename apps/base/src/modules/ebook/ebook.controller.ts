import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimpleResponse, getErrorStatusCode } from '@qbit-tech/libs-utils';
import { EBOOKS, IEbook } from './ebook.data';

@ApiTags('Ebook')
@Controller('ebooks')
export class InitDataController {
  private readonly logger = new Logger(InitDataController.name);
  constructor() {
    //
  }

  @Get()
  async fetchList(): Promise<{ results: IEbook[] }> {
    try {
      return { results: EBOOKS };
    } catch (err) {
      throw new HttpException(err, getErrorStatusCode(err));
    }
  }
}
