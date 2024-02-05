import {
    Body,
    Controller,
    Put,
    UseInterceptors,
    UploadedFile,
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
import { PromoProperties, UpdatePromoProperties } from './promo.contract';
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
import { UploaderService } from '@qbit-tech/libs-uploader';
import { PromoService } from './promo.service';

@ApiTags('Promo')
@Controller('promo')
export class PromoController {
    constructor(
        private promoService: PromoService,
        private uploaderService: UploaderService
    ) { }

    @Get()
    @UseGuards()
    async findAll(): Promise<PromoModel[]> {
        try {
            const promos = (await this.promoService.findAll())

            return promos
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':promoId')
    async findById(@Param('promoId') promoId: string): Promise<PromoModel> {
        try {
            const promo = await this.promoService.findById(promoId)

            return promo
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // @ApiHeader({
    //     name: 'Content-Type',
    //     description: 'multipart/form-data'
    // })
    // @ApiConsumes('multipart/form-data')
    @Post()
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Content-Type',
        description: 'multipart/form-data',
    })
    @UseInterceptors(FileInterceptor('fileImage'))
    async createPromo(
        @Body() body: PromoProperties,
        // @UploadedFile(
        //     new ParseFilePipeBuilder()
        //       .addFileTypeValidator({
        //         fileType: /(jpg|jpeg|png)$/,
        //       })
        //       .addMaxSizeValidator({
        //         maxSize: 200000,
        //         message: 'Max 2 mb',
        //       })
        //       .build({
        //         fileIsRequired: false,
        //         errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        //       }),
        //   ) fileImage: Express.Multer.File
        @UploadedFile() fileImage: Express.Multer.File
    ): Promise<PromoModel> {
        try {
            // const { fileImage, ...newBody} = body
            const promo = await this.promoService.createPromo(body);

            console.log(fileImage);            

            if (fileImage) {
                Logger.log('file added: ' + JSON.stringify(body), 'promo.controller');
                const uploadResult = await this.uploaderService.fileUploaded({
                    tableName: 'promos',
                    tableId: promo.promoId,
                    filePath: fileImage['key'],
                    metadata: {}
                })
                await this.promoService.updatedPromoImage(promo.promoId, fileImage ? uploadResult.fileLinkCache : null)
            }
            return promo
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
        @Body() body: UpdatePromoProperties,
        @UploadedFile() file
    ) {
        try {
            const promo = await this.promoService.updatePromo(promoId, body)

            if (file) {
                Logger.log('file added: ' + JSON.stringify(body), 'promo.controller');
                const uploadResult = await this.uploaderService.fileUploaded({
                    tableName: 'promos',
                    tableId: promo.promoId,
                    filePath: file['key'],
                    metadata: {}
                })
                await this.promoService.updatedPromoImage(promo.promoId, file ? uploadResult.fileLinkCache : null)
            }

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


}