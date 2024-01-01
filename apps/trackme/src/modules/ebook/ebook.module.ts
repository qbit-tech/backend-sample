import { Module } from '@nestjs/common';
import { EbookController } from './ebook.controller';

@Module({
  imports: [],
  controllers: [EbookController],
  providers: [],
})
export class EbookModule {}
