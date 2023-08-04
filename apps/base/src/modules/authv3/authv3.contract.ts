import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class ForgotPasswordByLinkRequest {
    @ApiProperty()
    email: string;
  }
  
export class ForgotPasswordByLinkResponse {
    @ApiProperty()
    email: string;

    @ApiProperty()
    isSuccess: boolean;
}

export class ChangePasswordUsingSessionRequest {
    // @ApiProperty()
    // sessionId: string;

    @ApiProperty()
    newPassword: string;
}

export class ChangePasswordUsingSessionResponse {
    @ApiProperty()
    isSuccess: boolean;
}