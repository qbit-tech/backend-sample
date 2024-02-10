import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserModel } from './user.entity';
import { UserController } from './user.controller';
import { RoleModel, RoleService } from '@qbit-tech/libs-role';
import { ConfigModule } from '@nestjs/config';
import { AuthSessionModule } from '../authUser/authUser.module';
import { MulterModule } from '@nestjs/platform-express';
import { SessionModule } from '@qbit-tech/libs-session';
import { UploaderModule } from '@qbit-tech/libs-uploader';
import {
  UPLOADER_OPTIONS,
  generateMulterOptions,
} from '../../../config/uploader';

@Module({
  imports: [
    AuthSessionModule,
    SessionModule,
    SequelizeModule.forFeature([UserModel, RoleModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    UploaderModule.forRoot(UPLOADER_OPTIONS),
    MulterModule.register(generateMulterOptions('user')),
  ],
  providers: [UserService, RoleService],
  controllers: [UserController],
  exports: [UserService, RoleService],
})
export class UserModule {}
