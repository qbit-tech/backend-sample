import { Module, forwardRef } from '@nestjs/common';
import { Authv3Service } from './authv3.service';
import { AuthenticationModule } from '@qbit-tech/libs-authv3';
// import { SessionModule } from 'libs/authv3/src/session/src';
import { Authv3Controller } from './authv3.controller';
import { Authv3EmailOTPController } from './authv3EmailOTP.controller';
import { NotificationModule } from '@qbit-tech/libs-notification';

@Module({
  imports: [
    // SessionModule,
    AuthenticationModule,
    NotificationModule.forRoot([
      {
        name: 'sendinblue',
        setting: {
          apiKey: process.env.SENDINBLUE_API_KEY,
          from: {
            email: process.env.SENDINBLUE_EMAIL_FROM,
            name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
          },
        },
      },
    ]),
  ],
  providers: [Authv3Service],
  controllers: [Authv3EmailOTPController, Authv3Controller],
  exports: [Authv3Service],
})
export class Authv3Module {}
