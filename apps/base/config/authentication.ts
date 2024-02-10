import { AuthOption } from '@qbit-tech/libs-authv3/dist/authentication.helper';

export const authenticationOptions: AuthOption[] = [
  {
    name: 'email',
    setting: {},
  },
  {
    name: 'apple',
    setting: {
      clientId: process.env.APPLE_CLIENT_ID,
    },
  },
  {
    name: 'google',
    setting: {
      appId: process.env.GOOGLE_CLIENT_ID.split(','),
      appSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // {
  //   name: 'fb',
  //   setting: {
  //     appId: process.env.FACEBOOK_CLIENT_ID,
  //     appSecret: process.env.FACEBOOK_CLIENT_SECRET,
  //     baseUrl: process.env.FACEBOOK_BASE_URL,
  //   },
  // },
  {
    name: 'phone',
    setting: {},
  },
];