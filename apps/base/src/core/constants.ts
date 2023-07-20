require('dotenv').config({
  path: process.env.ENV_PATH,
});

export const DEFAULT_HASH_TOKEN = '58n4984u0n98ur3';

export enum EEmailVerificationMethod {
  OTP = 'OTP',
  CONFIRMATION_LINK = 'CONFIRMATION_LINK',
}

export enum EPlatform {
  CMS = 'CMS',
  MOBILE_APP = 'MOBILE_APP',
}

export const AUTH_SETTING = {
  CMS: {
    emailVerificationMethod: EEmailVerificationMethod.CONFIRMATION_LINK,
    emailVerificationUrl: process.env.BASE_URL_API + '/page/auth/verify-email',
    emailResetPasswordMethod: EEmailVerificationMethod.CONFIRMATION_LINK,
    emailResetPasswordUrl: process.env.BASE_URL_CMS + '/reset-password',
  },
  MOBILE_APP: {
    emailVerificationMethod: EEmailVerificationMethod.OTP,
    emailVerificationUrl: null,
    emailResetPasswordMethod: EEmailVerificationMethod.OTP,
    emailResetPasswordUrl: null,
  },
};

console.info('AUTH_SETTING', AUTH_SETTING);