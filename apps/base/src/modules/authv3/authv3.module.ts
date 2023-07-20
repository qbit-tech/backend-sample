import { Module, forwardRef } from '@nestjs/common';
import { Authv3Service } from './authv3.service';
import { AuthenticationModule } from 'libs/authv3/src';
import { SessionModule } from 'libs/session/src';
import { NotificationModule } from 'submodule';
import { Authv3EmailOTPController } from './authv3EmailOTP.controller';
// import { Authv2PhoneService } from './service/authv2Phone.service';
// import { Authv2PhoneController } from './authv2Phone.controller';
// import { Authv2EmailOTPService } from './service/authv2EmailOTP.service';
// import { Authv2PhoneOTPService } from './service/authv2PhoneOTP.service';
// import { Authv2PhoneOTPController } from './authv2PhoneOTP.controller';
// import { Authv2Controller } from './authv2.controller';
// import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    SessionModule,
    AuthenticationModule,
    // NotificationModule.forRoot([
    //   {
    //     name: 'sendinblue',
    //     setting: {
    //       apiKey: process.env.SENDINBLUE_API_KEY,
    //       from: {
    //         email: process.env.SENDINBLUE_EMAIL_FROM,
    //         name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
    //       },
    //     },
    //   },
    // ]),
  ],
  providers: [
    // Authv2EmailOTPService,
    // Authv2PhoneService,
    // Authv2PhoneOTPService,
    Authv3Service,
    // AuthService,
  ],
  controllers: [
    Authv3EmailOTPController,
    // Authv2PhoneOTPController,
    // Authv2Controller,
    // Authv2PhoneController,
    // PageAuthController,
  ],
  exports: [
    // Authv2EmailOTPService,
    // Authv2PhoneService,
    // Authv2PhoneOTPService,
    Authv3Service,
    // AuthService,
  ],
})
export class Authv3Module {}
