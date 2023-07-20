import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequest {
    @ApiProperty()
    userId: string;
    
    @ApiProperty()
	email: string;
    
    @ApiProperty()
	password: string;
}

export class RegisterResponse {
	userId: string;
	email: string;
	isVerified: boolean;

	isPasswordExpired: boolean;
	passwordExpiredAt?: Date;

	isBlocked: boolean;
	blockedAt?: Date;
}

export class SignInRequest {
    @ApiProperty()
	email: string;

    @ApiProperty()
	password: string;
}

export class SignInResponse {
	token: string;
	isVerified: boolean;

	isPasswordExpired: boolean;
	passwordExpiredAt?: Date;

	isBlocked: boolean;
	blockedAt?: Date;
}

export class CheckEmailExistRequest {
    @ApiProperty()
	email: string;
}

export class CheckEmailExistResponse {
	isExist: boolean;
}

export class ForgotPasswordRequest {
    @ApiProperty()
	email: string;
}

export class ChangePasswordAfterForgotPasswordRequest {
    @ApiProperty()
	newPassword: string;
}

export class ChangePasswordRequest {
    @ApiProperty()
	newPassword: string;
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


export enum ESessionAction {
	// Before verify
	REQUEST_OTP_EMAIL = 'REQUEST_OTP_EMAIL',
	REQUEST_OTP_PHONE = 'REQUEST_OTP_PHONE',
  
	// After verify success
	VERIFIED_OTP_EMAIL = 'VERIFIED_OTP_EMAIL',
	VERIFIED_OTP_PHONE = 'VERIFIED_OTP_PHONE',
  
	// After confirmation link
	VERIFIED_LINK_EMAIL = 'VERIFIED_LINK_EMAIL',
	VERIFIED_LINK_EMAIL_CONFIRMATION = 'VERIFIED_LINK_EMAIL_CONFIRMATION',
  }