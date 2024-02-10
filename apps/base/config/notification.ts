import { NotificationOption } from '@qbit-tech/libs-notification/dist/notification.helper';

export const notificationOptions: NotificationOption[] = [
  {
    name: 'sendinblue' as any,
    setting: {
      apiKey: process.env.SENDINBLUE_API_KEY || '-',
      from: {
        email: process.env.SENDINBLUE_EMAIL_FROM,
        name: process.env.SENDINBLUE_EMAIL_FROM_NAME,
      },
    },
  },
  {
    name: 'brevo' as any,
    setting: {
      apiKey: process.env.BREVO_API_KEY || '-',
      from: {
        email: process.env.BREVO_EMAIL_FROM,
        name: process.env.BREVO_EMAIL_FROM_NAME,
      },
    },
  },
  {
    name: 'nodemailer' as any,
    setting: {
      apiKey: process.env.NODEMAILER_API_KEY || '-',
      from: {
        email: process.env.NODEMAILER_EMAIL_FROM,
        name: process.env.NODEMAILER_EMAIL_FROM_NAME,
      },
      nodemailer: {
        username: process.env.NODEMAILER_USERNAME,
        password: process.env.NODEMAILER_PASSWORD,
        service: process.env.NODEMAILER_SERVICE,
        host: process.env.NODEMAILER_SMTP_HOST,
        port: process.env.NODEMAILER_SMTP_PORT,
        secure: process.env.NODEMAILER_SMTP_SECURE,
      },
    },
  },
  {
    name: 'goSMSGateway' as any,
    setting: {
      apiKey: process.env.NODE_ENV,
      goSmsGateway: {
        stage: process.env.NODE_ENV,
        username: process.env.GOSMSGATEWAY_USERNAME,
        password: process.env.GOSMSGATEWAY_PASSWORD,
      },
    },
  },
];
