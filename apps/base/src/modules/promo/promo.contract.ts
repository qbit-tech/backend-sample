import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import multer = require('multer');
import { PromoModel } from './promo.entity';

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
    // image?: Express.Multer.File;

    // @ApiProperty({ type: 'string', format: 'binary' })
    // image: Express.Multer.File;

    @ApiProperty()
    isPublish: Boolean;

    @ApiProperty()
    startedAt: Date;

    @ApiProperty()
    endedAt: Date;
}

export class RespondPromoProperties {
    promoId: string;
    title: string;
    description?: string;
    isPublish: Boolean;
    startedAt: Date;
    endedAt: Date;
    image: Express.Multer.File[];
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

export class UpdatePromoImageProperty {
    readonly bannerId: string;
    readonly file: Express.Multer.File;
}