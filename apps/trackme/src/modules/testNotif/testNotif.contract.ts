import { ApiProperty } from '@nestjs/swagger';

export class TestNotificationEmailRequest {
  @ApiProperty()
  readonly email: string;
}

export class TestNotificationSmsRequest {
  @ApiProperty()
  readonly phoneNumber: string;

  @ApiProperty()
  readonly message?: string;
}
