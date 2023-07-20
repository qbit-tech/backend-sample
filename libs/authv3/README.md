# Authentication Lib v2

Enchanced library for authentication

## Importing Service
```ts
import { EmailAuthenticatorService } from '@base/authv2/email/email-authenticator.service';
import { PhoneAuthenticatorService } from '@base/authv2/phone/phone-authenticator.service';
import { SocialAuthenticatorService } from '@base/authv2/social/social-authenticator.service';
import { FBAuthenticatorService } from '@base/authv2/fb/fb-authenticator.service';
import { GoogleAuthenticatorService } from '@base/authv2/google/google-authenticator.service';
```

## Usage

### Email Authenticator

Authentication using email and password

#### Register
```ts
await EmailAuthenticator.register({
	email: string;
	password: string;
	userId: string;
	isConfirmed?: boolean;
})
```

#### Authenticate
```ts
await EmailAuthenticator.authenticate({
	email: string;
	password: string;
})
```
Promise rejection :  return `null` if email not found.

#### Change Password By UserID
```ts
await EmailAuthenticator.changePasswordByUserId(
	userId: string,
	newPassword:string,
)
```

#### Update Data By UserID
```ts
await EmailAuthenticator.updateDataByUserId(
	userId: string,
	newData: {
		email?: string;
		isConfirmed?: string;
	}
)
```
Promise rejection: return `null` if user not found.

#### Delete By UserID
```ts
await EmailAuthenticator.deleteByUserId(
	userId: string
)
```

#### Find One By UserID
```ts
await EmailAuthenticator.findOneByUserId(
	userId: string
);
```

#### Find One By Email
```ts
await EmailAuthenticator.findOneByEmail(
	email: string
);
```

### Phone Authenticator

Authentication using OTP

#### Register
```ts
await PhoneAuthenticator.register({
	phoneNumber: string;
	userId: string;
})
```
Promise rejection :  `null` if not exists.

#### Authenticate
```ts
await PhoneAuthenticator.authenticate({
	phoneNumber: string;
	otp: string;
})
```
Promise rejection :  return `null`.

#### Reloading OTP
```ts
await PhoneAuthenticator.reloadOTP(
	phoneNumber: string
)
```

#### Update Data By UserID
```ts
await PhoneAuthenticator.updateDataByUserId(
	userId: string,
	newData: {
		phoneNumber?: string;
	}
)
```
Promise rejection: return `null` if user not found.

#### Delete By UserID
```ts
await PhoneAuthenticator.deleteByUserId(
	userId: string
)
```
Promise rejection: return `null` if user not found.

#### Find One By UserID
```ts
await PhoneAuthenticator.findOneByUserId(
	userId: string
);
```
Promise rejection: return `null` if user not found.

#### Find One By Phone Number
```ts
await PhoneAuthenticator.findOneByPhoneNumber(
	email: string
);
```
Promise rejection: return `null` if user not found.