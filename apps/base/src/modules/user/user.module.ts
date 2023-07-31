import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserModel } from './user.entity';
import { UserController } from './user.controller';
import { RoleModel, RoleService } from '@qbit-tech/libs-role';
import { ConfigModule } from '@nestjs/config';
import { AuthSessionModule } from '../authUser/authUser.module';
import { MulterModule } from '@nestjs/platform-express';
import multer = require('multer');
import path = require('path');

@Module({
  imports: [
    AuthSessionModule,
    SequelizeModule.forFeature([UserModel, RoleModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    MulterModule.register({
      limits: {
        files: 1,
        fileSize: 10 * 1024 * 1024,
        fieldSize: 10 * 1024 * 1024,
      },
      storage: multer.diskStorage({
        destination: 'images',
        filename: function (req, file, cb) {
          cb(
            null,
            file.fieldname + '_' + Date.now() + path.extname(file.originalname),
          );
        },
      }),
    }),
  ],
  providers: [UserService, RoleService],
  controllers: [UserController],
  exports: [UserService, RoleService],
})
export class UserModule {}
