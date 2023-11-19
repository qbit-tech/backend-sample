import { ApiProperty } from "@nestjs/swagger";

export class CreateBannerDto {
 @ApiProperty()
  title: string;

  @ApiProperty()
  bannerImage: string;

  @ApiProperty()
  bannerLink: string;
}