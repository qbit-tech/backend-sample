import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';

@Module({
    imports: [
    ],
    providers: [
    ],
    controllers: [PermissionController],
    exports: [
    ],
  })
  export class PermissionModule {}