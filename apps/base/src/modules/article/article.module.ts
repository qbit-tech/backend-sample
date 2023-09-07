import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticleModel } from './article.entity';
import { ConfigModule } from '@nestjs/config';
// import { EventLogModule } from '../eventLog/eventLog.module';
import { ArticleService } from './article.service';
// import { EventArticleModel } from '../event/eventArticle.entity';
// import { EventArticleService } from '../event/eventArticle.service';
import { ArticleController } from './article.controller';
import { AuthSessionModule } from '../authUser/authUser.module';


@Module({
    imports: [
        AuthSessionModule,
        // EventLogModule,
        SequelizeModule.forFeature([
            ArticleModel,
            // EventArticleModel
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.ENV_PATH,
        }),
    ],
    providers: [
        ArticleService,
        // EventArticleService
    ],
    controllers: [
        ArticleController,
    ],
    exports: [
        ArticleService,
        // EventArticleService
    ]
})

export class ArticleModule { }