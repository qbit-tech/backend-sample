import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticleModel } from './article.entity';
import { ArticleController } from './article.controller';
import { AuthSessionModule } from '../authUser/authUser.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ArticleModel]),
    // MulterModule.register({
    //   storage: multer.diskStorage({
    //     destination: 'coverimage',
    //     filename(_, file, callback) {
    //       return callback(null, file.originalname);
    //     },
    //   }),
    // }),
    AuthSessionModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
