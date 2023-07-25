import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { RoleModel } from './role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { UserRoleModel } from 'apps/base/src/modules/user/userRole.entity';
import { UserRoleService } from 'apps/base/src/modules/user/userRole.service';
import { AuthSessionModule } from 'apps/base/src/modules/authUser/authUser.module';
import { UserModel } from 'apps/base/src/modules/user/user.entity';

@Module({
    imports: [
      AuthSessionModule,
      SequelizeModule.forFeature([
        RoleModel,
        UserModel,
        UserRoleModel
      ]),
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: process.env.ENV_PATH,
      }),
    ],
    providers: [
      RoleService,
      UserRoleService
    ],
    controllers: [RoleController],
    exports: [
      RoleService,
      UserRoleService
    ],
  })
  export class RoleModule {}