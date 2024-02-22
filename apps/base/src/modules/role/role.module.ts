import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { RoleModel } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      RoleModel,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_PATH,
    }),
  ],
  providers: [
    RoleService,
  ],
  controllers: [
    RoleController
  ],
  exports: [
    RoleService,
  ],
})
export class RoleModule {}