import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SponsorModel } from './sponsor.entity';
import { ConfigModule } from '@nestjs/config';
// import { EventLogModule } from '../eventLog/eventLog.module';
import { SponsorService } from './sponsor.service';
// import { EventTagModel } from '../event/eventTag.entity';
// import { EventTagService } from '../event/eventTag.service';
import { SponsorController } from './sponsor.controller';
import { AuthSessionModule } from '../authUser/authUser.module';


@Module({
  imports: [
    AuthSessionModule,
    // EventLogModule,
    SequelizeModule.forFeature([
      SponsorModel,
      // EventTagModel
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  providers: [
    SponsorService,
    // EventTagService
  ],
  controllers: [
    SponsorController,
  ],
  exports: [
    SponsorService,
    // EventTagService
  ]
})

export class SponsorModule { }