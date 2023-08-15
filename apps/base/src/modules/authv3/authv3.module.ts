import { Module } from '@nestjs/common';
import { Authv3Service } from './authv3.service';
import { AuthenticationModule } from '@qbit-tech/libs-authv3';
import { Authv3Controller } from './authv3.controller';
import { UserModule } from '../user/user.module';
import { GoogleAuthenticatorService } from '@qbit-tech/libs-authv3';
import { SessionService } from '@qbit-tech/libs-authv3';
import { GoogleOption } from '@qbit-tech/libs-authv3';
import { FacebookOption } from '@qbit-tech/libs-authv3';
// import { AuthService } from '@qbit-tech/libs-authv3';
import { Authv3EmailOTPController } from './authv3EmailOTP.controller';

@Module({
  imports: [AuthenticationModule, UserModule],
  providers: [Authv3Service],
  controllers: [Authv3EmailOTPController, Authv3Controller],
  exports: [Authv3Service],
})
export class Authv3Module {}
