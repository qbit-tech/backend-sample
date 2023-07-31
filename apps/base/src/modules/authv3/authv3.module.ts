import { Module } from '@nestjs/common';
import { Authv3Service } from './authv3.service';
import { AuthenticationModule } from '@qbit-tech/libs-authv3';
import { Authv3Controller } from './authv3.controller';
import { Authv3EmailOTPController } from './authv3EmailOTP.controller';

@Module({
  imports: [AuthenticationModule],
  providers: [Authv3Service],
  controllers: [Authv3EmailOTPController, Authv3Controller],
  exports: [Authv3Service],
})
export class Authv3Module {}
