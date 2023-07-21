import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagModel } from './tag.entity';
import { ConfigModule } from '@nestjs/config';
// import { EventLogModule } from '../eventLog/eventLog.module';
import { TagService } from './tag.service';
// import { EventTagModel } from '../event/eventTag.entity';
// import { EventTagService } from '../event/eventTag.service';
import { TagController } from './tag.controller';
// import { AuthSessionModule } from '../authUser/authUser.module';


@Module({
  imports: [
    // AuthSessionModule,
    // EventLogModule,
    SequelizeModule.forFeature([
      TagModel,
      // EventTagModel
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  providers: [
    TagService,
    // EventTagService
  ],
  controllers: [
    TagController,
  ],
  exports: [
    TagService,
    // EventTagService
  ]
})

export class TagModule { }