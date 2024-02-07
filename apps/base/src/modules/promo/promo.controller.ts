import {
    Body,
    Controller,
    Put,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Req,
    UseGuards,
    Get,
    Query,
    Delete,
    Param,
    Patch,
    Logger,
    Post,
    HttpException,
    HttpStatus,
    ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppRequest, SimpleResponse } from '@qbit-tech/libs-utils';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBody,
    ApiConsumes,
    ApiHeader,
} from '@nestjs/swagger';
import { PromoModel } from './promo.entity';
import { PromoProperties, RespondPromoProperties, UpdatePromoProperties } from './promo.contract';
// import { AuthService } from '../auth/auth.service';
import { async as crypt } from 'crypto-random-string';
import { AuthService } from '@qbit-tech/libs-authv3';
import { cleanPhoneNumber, getErrorStatusCode } from '@qbit-tech/libs-utils';
import {
    FEATURE_PERMISSIONS,
    AuthPermissionGuardV2,
    SessionService,
} from '@qbit-tech/libs-session';
import { NotificationService } from '@qbit-tech/libs-notification';
import { EAuthMethod } from '@qbit-tech/libs-authv3/dist/authentication.entity';
import { FileProperties, UploaderService } from '@qbit-tech/libs-uploader';
import { PromoService } from './promo.service';

@ApiTags('Promotion')
@Controller('promotions')
export class PromoController {
    constructor(
        private promoService: PromoService,
        private uploaderService: UploaderService,
    ) { }

    @Get()
    @UseGuards()
    async findAll(): Promise<any> {
        try {
            const promos = (await this.promoService.findAll())

            const newList: RespondPromoProperties[] = await Promise.all(promos.map(async (item) => (
                    {
                        ...item,
                        image: await this.uploaderService.fileSearchByTable(
                            'promos',
                            [item.promoId]
                        )
                    }
                )
            ))

            console.log(newList);

            // return {
            //     results: newList
            // }
            return {
                results: promos
            }
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':promoId')
    async findById(@Param('promoId') promoId: string): Promise<any> {
        try {
            const promo = await this.promoService.findById(promoId)
            const fileSearchResult = await this.uploaderService.fileSearchByTable(
                'promos',
                [promoId]
            );
            console.log(fileSearchResult.get(promoId));

            return {
                ...promo,
                imgUrl: fileSearchResult.get(promoId)
            }
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post()
    @ApiBearerAuth()
    async createPromo(
        @Body() body: PromoProperties,
    ): Promise<any> {
        try {
            const promo = await this.promoService.createPromo(body);

            return promo.promoId
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Patch(':promoId')
    @ApiBearerAuth()
    async updatePromo(
        @Param('promoId') promoId: string,
        @Body() body: UpdatePromoProperties
    ) {
        try {
            const promo = await this.promoService.updatePromo(promoId, body)
            return promo
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiBearerAuth()
    @Delete(':promoId')
    async deletePromo(@Param('promoId') promoId: string): Promise<Object> {
        if (!promoId) {
            return "please input id"
        }
        try {
            const message = await this.promoService.deleteById(promoId)

            return message
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Put('/upload-image/:promoId')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @Param('promoId') promoId: string,
        @UploadedFile() file
    ): Promise<any> {
        try {
            const fileSearchResult = await this.uploaderService.fileSearchByTable(
                'promos',
                [promoId],
            );

            console.log(file);


            console.log(fileSearchResult);

            if (fileSearchResult.has(promoId)) {
                await this.uploaderService.deleteFileById(
                    fileSearchResult.get(promoId)[0].fileId,
                );
            }


            const uploadResult = await this.uploaderService.fileUploaded({
                tableName: 'promos',
                tableId: promoId,
                filePath: file['key'],
                metadata: {}
            })

            return { isSuccess: true, payload: uploadResult };
        } catch (error) {
            console.log('err_promo: ', error);
            return { isSuccess: false, payload: null };
        }
    }

    @Get('/get-image/:promoId')
    async getImage(@Param('promoId') promoId: string) {
        const fileSearchResult = await this.uploaderService.fileSearchByTable(
            'promos',
            [promoId],
        );
        return fileSearchResult.get(promoId)
    }


}