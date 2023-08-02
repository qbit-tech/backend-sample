import { ApiProperty } from '@nestjs/swagger';

export class TestNotificationEmailRequest {
  @ApiProperty()
  readonly email: string;
}
