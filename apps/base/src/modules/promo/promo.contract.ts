import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import multer = require('multer');

// export abstract class PromoApiContract {
//     abstract findAll(): Promise<
// }

export class PromoProperties {
    @ApiProperty()
    promoId: string;

    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    description?: string;

    // @ApiPropertyOptional()
    // image?: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    fileImage?: Express.Multer.File;

    @ApiProperty()
    isPublish: Boolean;

    @ApiProperty()
    startedAt: Date;

    @ApiProperty()
    endedAt: Date;
}

export class UpdatePromoProperties {
    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiProperty()
    isPublish: Boolean;

    @ApiProperty()
    startedAt: Date;

    @ApiProperty()
    endedAt: Date;
}