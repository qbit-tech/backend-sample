import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TrackMeModel } from './trackme.entity';
import { ConfigModule } from '@nestjs/config';
import { TrackMeService } from './trackme.service';
import { TrackMeController } from './trackme.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([TrackMeModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  providers: [TrackMeService],
  controllers: [TrackMeController],
  exports: [TrackMeService],
})
export class TrackMeModule {}
