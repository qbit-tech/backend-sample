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
    // forwardRef(() => AuthModule),
    SequelizeModule.forFeature([UserModel, RoleModel, UserRoleModel]),
  ],
  providers: [UserService, UserRoleService, RoleService],
  controllers: [UserController],
  exports: [UserService, UserRoleService, RoleService],
})
export class UserModule {}
