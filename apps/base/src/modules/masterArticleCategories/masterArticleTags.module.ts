import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
// import { AuthSessionModule } from '../authUser/authUser.module';
import { SessionModule } from '@qbit-tech/libs-session';
import { MasterArticleCategoriesModel } from './masterArticleTags.entity';
import { MasterArticleCategoriesController } from './masterArticleCategories.controller';
import { MasterArticleCategoriesService } from './masterArticleTags.service';

@Global()
@Module({})
export class MasterArticleCategoriesModule{
  static forRoot():DynamicModule{
    return{
      global: true,
      module: MasterArticleCategoriesModule,
      imports: [
        // AuthSessionModule,
        SessionModule,
        SequelizeModule.forFeature([MasterArticleCategoriesModel]),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.ENV_PATH
        }),
      ],
      providers: [MasterArticleCategoriesService],
      controllers: [MasterArticleCategoriesController],
      exports: [MasterArticleCategoriesService]
    }
  }
}

// @Module({
//   imports: [
//     AuthSessionModule,
//     SessionModule,
//     SequelizeModule.forFeature([MasterArticleCategoriesModel]),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: process.env.ENV_PATH,
//     }),
//   ],
//   providers: [MasterArticleCategoriesService],
//   controllers: [MasterArticleCategoriesController],
//   exports: [MasterArticleCategoriesService],
// })
// export class MasterArticleCategoriesModule {}
