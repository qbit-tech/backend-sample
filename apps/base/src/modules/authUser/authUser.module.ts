import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../user/user.entity';
import { AuthSessionService } from './authUser.service';
import { RoleModule } from '@qbit-tech/libs-role';

@Module({
  imports: [RoleModule, SequelizeModule.forFeature([UserModel])],
  providers: [AuthSessionService],
  controllers: [],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}
