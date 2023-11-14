import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { EBOOKS, IEbook } from './ebook.data';

@ApiTags('Ebook')
@Controller('ebooks')
export class EbookController {
  private readonly logger = new Logger(EbookController.name);
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
