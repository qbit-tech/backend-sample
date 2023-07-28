import { DynamicModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileDownloader } from './interfaces/file-downloader';
import { FileModel } from './uploader.entity';
import { UploaderService } from './uploader.service';

@Module({})
export class UploaderModule {
  static forRoot(options: {
    cacheTimeout?: number;
    defaultMetadata?: object,
    downloader: FileDownloader | any,
  }): DynamicModule {
    return {
      module: UploaderModule,
      imports: [
        SequelizeModule.forFeature([FileModel]),
      ],
      providers: [
        UploaderService, {
          provide: 'FILE_DOWNLOADER',
          useValue: options.downloader,
        }, {
          provide: 'FILE_OPTIONS',
          useValue: {
            cacheTimeout: options.cacheTimeout || -1,
            defaultMetadata: options.defaultMetadata || {},
          }, 
        }
      ],
      exports: [
        UploaderService,
      ],
    }
  }
}
