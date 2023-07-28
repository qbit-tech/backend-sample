import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionModule, SessionService } from '@qbit-tech/authv3/session/src';
import { UserModel } from '../user/user.entity';
import { AuthSessionService } from './authUser.service';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([UserModel])],
  providers: [AuthSessionService, SessionService],
  controllers: [],
  exports: [AuthSessionService, SessionService],
})
export class AuthSessionModule {}
