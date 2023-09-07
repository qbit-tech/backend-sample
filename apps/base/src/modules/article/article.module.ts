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
import { MulterModule } from '@nestjs/platform-express';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import multer = require('multer');
import path = require('path');

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
        MulterModule.register({
            limits: {
                files: 1,
                fileSize: 10 * 1024 * 1024,
                fieldSize: 10 * 1024 * 1024,
            },
            storage: multer.diskStorage({
                destination: 'images',
                filename: function (req, file, cb) {
                    cb(
                        null,
                        file.fieldname + '_' + Date.now() + path.extname(file.originalname),
                    );
                },
            }),
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