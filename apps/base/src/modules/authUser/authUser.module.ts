import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionModule } from '@qbit-tech/libs-authv3';
import { UserModel } from '../user/user.entity';
import { AuthSessionService } from './authUser.service';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([UserModel])],
  providers: [AuthSessionService],
  controllers: [],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}
