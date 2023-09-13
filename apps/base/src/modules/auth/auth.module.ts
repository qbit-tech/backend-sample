import { Module } from '@nestjs/common';
// import { Authv3Service } from './authv3.service';
import { AuthenticationModule } from '@qbit-tech/libs-authv3';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { GoogleAuthenticatorService } from '@qbit-tech/libs-authv3';
import { SessionService } from '@qbit-tech/libs-authv3';
import { GoogleOption } from '@qbit-tech/libs-authv3';
import { FacebookOption } from '@qbit-tech/libs-authv3';
// import { AuthService } from '@qbit-tech/libs-authv3';
import { AuthEmailOTPController } from './authEmailOTP.controller';

@Module({
  imports: [AuthenticationModule, UserModule],
  // providers: [Authv3Service],
  controllers: [AuthEmailOTPController, AuthController],
  // exports: [Authv3Service],
})
export class AuthModule {}
