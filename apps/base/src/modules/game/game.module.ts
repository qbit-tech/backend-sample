import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameModel } from './game.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([GameModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
