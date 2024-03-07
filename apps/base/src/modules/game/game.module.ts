import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameModel } from './entity/game.entity';
import { ConfigModule } from '@nestjs/config';
import { Game_PlayersModel } from './entity/game_players.entity';
import { UserModel } from '../user/user.entity';
import { Game_PlayerHistoriesModel } from './entity/game_player_histories.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([GameModel, Game_PlayersModel, Game_PlayerHistoriesModel, UserModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
