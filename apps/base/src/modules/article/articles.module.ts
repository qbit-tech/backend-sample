import { DynamicModule, Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { AuthSessionModule } from '../authUser/authUser.module';
import { SessionModule } from '@qbit-tech/libs-session';
import { ArticlesModel } from './articles.entity';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
// import { Endpoint, S3 } from 'aws-sdk';
import { S3Downloader, UploaderModule } from '@qbit-tech/libs-uploader';
import { MulterModule } from '@nestjs/platform-express';
// import * as MulterS3 from 'multer-s3';
import { FileModel } from '@qbit-tech/libs-uploader/dist/uploader.entity';
import { ArticleTagsModel } from './articleTags.entity';
import { SessionOption } from '@qbit-tech/libs-session/dist/session.helper';
import { FileDownloader } from '@qbit-tech/libs-uploader/dist/interfaces/file-downloader';
// import { MasterArticleCategoriesModule } from '../masterArticleCategories/masterArticleTags.module';
import { MasterArticleCategoriesModel } from '../masterArticleCategories/masterArticleTags.entity';
import { MasterArticleCategoriesController } from '../masterArticleCategories/masterArticleCategories.controller';
import { MasterArticleCategoriesService } from '../masterArticleCategories/masterArticleTags.service';
// import { MasterArticleTagsModule } from '../masterArticleTags/masterArticleTags.module';
import { MasterArticleTagsModel } from '../masterArticleTags/masterArticleTags.entity';
import { MasterArticleTagsController } from '../masterArticleTags/masterArticleTags.controller';
import { MasterArticleTagsService } from '../masterArticleTags/masterArticleTags.service';

@Global()
@Module({})
export class ArticlesModule {
  static forRoot(
    sessionOption: SessionOption,
    uploaderOption: {
      cacheTimeout?: number;
      defaultMetadata?: object;
      downloader: FileDownloader | any;
      isMinio?: boolean;
    },
    multerOption: any,
    redisOption: any
  ): DynamicModule{
    return{
      global: true,
      module: ArticlesModule,
      imports:[
        // AuthSessionModule,
        SessionModule,
        SequelizeModule.forFeature([ArticlesModel, FileModel, ArticleTagsModel, MasterArticleCategoriesModel, MasterArticleTagsModel]),
        UploaderModule.forRoot(uploaderOption),
        MulterModule.register(multerOption),
      ],
      providers: [ArticlesService, MasterArticleCategoriesService, MasterArticleTagsService],
      controllers: [ArticlesController, MasterArticleCategoriesController, MasterArticleTagsController],
      exports: [ArticlesService, MasterArticleCategoriesService, MasterArticleCategoriesService],
    }
  }
}

// @Module({
//   imports: [
//     AuthSessionModule,
//     SessionModule,
//     SequelizeModule.forFeature([ArticlesModel, FileModel, ArticleTagsModel]),
//     UploaderModule.forRoot({
//       cacheTimeout: -1,
//       defaultMetadata: {
//         Bucket: process.env.STORAGE_BUCKET,
//       },
//       downloader: new S3Downloader({
//         endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
//         accessKeyId: process.env.STORAGE_KEY_ID,
//         secretAccessKey: process.env.STORAGE_SECRET_KEY,
//       }),
//       isMinio: true,
//     }),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: process.env.ENV_PATH,
//     }),
//     MulterModule.register({
//       storage: MulterS3({
//         s3: new S3({
//           endpoint: new Endpoint(process.env.STORAGE_ENDPOINT),
//           accessKeyId: process.env.STORAGE_KEY_ID,
//           secretAccessKey: process.env.STORAGE_SECRET_KEY,
//           region: 'ap-southeast-1',
//           s3ForcePathStyle: true,
//         }),
//         acl: 'public-read',
//         bucket: process.env.STORAGE_BUCKET,
//         metadata: function (req, file, cb) {
//           cb(null, { fieldname: file.fieldname });
//         },
//         key: function (req, file, cb) {
//           cb(null, `astraland/articles/${Date.now()}.png`);
//         },
//       }),
//     }),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: process.env.ENV_PATH,
//     }),
//   ],
//   providers: [ArticlesService],
//   controllers: [ArticlesController],
//   exports: [ArticlesService],
// })
// export class ArticlesModule {}