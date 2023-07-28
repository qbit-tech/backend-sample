import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserModel } from './user.entity';
import { UserController } from './user.controller';
// import { RoleModel } from '../role/role.entity';
import { RoleModel } from 'libs/role/src/role.entity';
import { RoleService } from 'libs/role/src/role.service';
import { UserRoleService } from '../user/userRole.service';
import { UserRoleModel } from '../user/userRole.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthSessionModule } from '../authUser/authUser.module';
import { MulterModule } from '@nestjs/platform-express';
import multer = require('multer');
import path = require('path');
// import { RoleService } from '../role/role.service';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthSessionModule,
    SequelizeModule.forFeature([
      UserModel,
      RoleModel,
      UserRoleModel
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
    MulterModule.register({
      limits: {
        files: 1,
        fileSize: 10*1024*1024,
        fieldSize: 10*1024*1024,
      },
      storage:multer.diskStorage({
        destination:"images",
        filename: function (req, file, cb) {cb(null, file.fieldname+'_'+Date.now()+ path.extname(file.originalname) );},
        
      })
    }),
    // forwardRef(() => AuthModule),
    SequelizeModule.forFeature([UserModel, RoleModel, UserRoleModel]),
  ],
  providers: [UserService, UserRoleService, RoleService],
  controllers: [UserController],
  exports: [UserService, UserRoleService, RoleService],
})
export class UserModule {}
