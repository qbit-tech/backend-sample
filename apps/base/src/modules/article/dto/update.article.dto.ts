import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}
