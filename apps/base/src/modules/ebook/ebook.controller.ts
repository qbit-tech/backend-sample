import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getErrorStatusCode } from '@qbit-tech/libs-utils';
import { EBOOKS, IEbook } from './ebook.data';
// import * as pdf2html from 'pdf2html';

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

  // @Get('pdf-to-html')
  // async pdfToHTML(): Promise<{ results: IEbook[] }> {
  //   try {
  //     const html = await pdf2html.html(
  //       '/Users/user/Documents/projects/backend-sample-new/apps/base/src/modules/ebook/file-example_PDF_1MB.pdf',
  //     );
  //     console.log(html);

  //     return { results: html };
  //   } catch (err) {
  //     this.logger.error(err);
  //     throw new HttpException(err, getErrorStatusCode(err));
  //   }
  // }
}
