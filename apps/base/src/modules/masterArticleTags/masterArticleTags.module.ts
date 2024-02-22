import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MasterArticleTagsModel } from './masterArticleTags.entity';
import { MasterArticleTagsController } from './masterArticleTags.controller';
// import { AuthSessionModule } from '../authUser/authUser.module';
import { SessionModule } from '@qbit-tech/libs-session';
import { MasterArticleTagsService } from './masterArticleTags.service';
import { ArticleTagsModel } from '../article/articleTags.entity';

@Global()
@Module({})
export class MasterArticleTagsModule{
  static forRoot():DynamicModule{
    return{
      global: true,
      module: MasterArticleTagsModule,
      imports: [
        // AuthSessionModule,
        SessionModule,
        SequelizeModule.forFeature([MasterArticleTagsModel, ArticleTagsModel]),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.ENV_PATH,
        }),
      ],
      providers: [MasterArticleTagsService],
      controllers: [MasterArticleTagsController],
      exports: [MasterArticleTagsService]
    }
  }
}

// @Module({
//   imports: [
//     AuthSessionModule,
//     SessionModule,
//     SequelizeModule.forFeature([MasterArticleTagsModel, ArticleTagsModel]),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: process.env.ENV_PATH,
//     }),
//   ],
//   providers: [MasterArticleTagsService],
//   controllers: [MasterArticleTagsController],
//   exports: [MasterArticleTagsService],
// })
// export class MasterArticleTagsModule {}
