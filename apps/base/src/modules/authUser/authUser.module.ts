import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../user/user.entity';
import { AuthSessionService } from './authUser.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [AuthSessionService],
  controllers: [],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}
