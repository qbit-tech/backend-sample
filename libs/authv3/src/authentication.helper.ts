import { FacebookOption } from './fb/fb-authenticator.contract';
import { GoogleOption } from './google/google-authenticator.contract';

export type AuthenticatorType = 'fb' | 'google' | 'apple' | 'email' | 'phone';

export type AuthOption = {
  name: AuthenticatorType;
  setting: FacebookOption | GoogleOption | {}
}

export function getAuthSettingToken(name: AuthenticatorType): string {
  return `auth_setting_${name}`;
}
