import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsernameRegisterRequest {
    @ApiProperty()
    userId: string;
    
    @ApiProperty()
	username: string;
    
    @ApiProperty()
	password: string;
}

export class UsernameRegisterResponse {
	userId: string;
	username: string;
	isVerified: boolean;

	isPasswordExpired: boolean;
	passwordExpiredAt?: Date;

	isBlocked: boolean;
	blockedAt?: Date;
}

export class UsernameSignInRequest {
    @ApiProperty()
	username: string;

    @ApiProperty()
	password: string;
}

export class UsernameSignInResponse {
	token: string;
	isVerified: boolean;

	isPasswordExpired: boolean;
	passwordExpiredAt?: Date;

	isBlocked: boolean;
	blockedAt?: Date;
}

export class CheckUsernameExistRequest {
    @ApiProperty()
	username: string;
}

export class CheckUsernameExistResponse {
	isExist: boolean;
}

export class UsernameChangePasswordRequest {
    @ApiProperty()
	newPassword: string;
}

export class ChangeUsernameRequest {
    @ApiProperty()
	newUsername: string;
}

export class SendVerificationLinkToEmailRequest {
    @ApiProperty()
	email: string;
}

export class SendOTPEmail {
	email: string;
}

export class SendEmailOTPResponse {
	@ApiProperty()
	readonly sessionId: string;
  
	@ApiPropertyOptional(
		// {
		// 	description: 'Session id of otp code, otp will only return in development mode.'
		// }
		)
	readonly otp?: string;
}

export class VerifyOTPEmailRequest {
    @ApiProperty()
	email: string;

    @ApiProperty()
	sessionId: string;

    @ApiProperty()
	otp: string;
}

export class VerifyOTPEmailResponse {
	sessionId: string;
}

export class ChangeEmailRequest {
    @ApiProperty()
	newEmail: string;

    @ApiProperty()
	sessionId: string;
}

export class ValidateSessionRequest {
    @ApiProperty()
	sessionId: string;
}

export class ValidationSessionResponse {
	action: string;
	userId?: string;
	otp?: string;
	email?: string;
}
