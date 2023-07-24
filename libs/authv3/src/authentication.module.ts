import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { FBAuthenticatorService } from './fb/fb-authenticator.service';
import { GoogleAuthenticatorService } from './google/google-authenticator.service';
import { EmailAuthenticatorService } from './email/email-authenticator.service';
import { getAuthSettingToken, AuthOption} from './authentication.helper';
import { SessionService } from './session/src';
// import { PhoneAuthenticatorService } from './phone/phone-authenticator.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
// import { EmailAuthModel } from './email/email-authenticator.entity';
import { AuthModel } from './authv3.entity';

const TokenOptionClassMap = {
  'fb': FBAuthenticatorService,
  'google': GoogleAuthenticatorService,
  'email': EmailAuthenticatorService,
  // 'phone': PhoneAuthenticatorService,
}

@Global()
@Module({})
export class AuthenticationModule {
  static forRoot(options: AuthOption[]): DynamicModule {
    const optionsProviders = options.map((option): Provider => ({
      provide: getAuthSettingToken(option.name),
      useValue: option.setting,
    }));
    const providers = options.map((option): Provider => TokenOptionClassMap[option.name]);

    return {
      global: true,
      module: AuthenticationModule,
      imports: [
        SequelizeModule.forFeature([
          AuthModel
        ]),
        HttpModule.register({
          timeout: 60000,
          maxRedirects: 5,
        }),
      ],
      providers: [
        ...optionsProviders,
        SessionService,
        ...providers,
      ],
      exports: [
        ...providers,
        SessionService
      ],
    };
  }
}
