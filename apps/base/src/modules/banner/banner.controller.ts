import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import {
    BannerApiContract,
    BannerFindAllRequest,
    BannerFindAllResponse,
    BannerCreateRequest,
    BannerCreateResponse,
    BannerFindOneRequest,
    BannerFindOneResponse,
    BannerUpdateRequest,
    BannerUpdateResponse,
    BannerDeleteResponse,
    UpdateImageResponse,
    UpdateImageRequest,
    BannersUpdateQueue,
} from './banner.contract';
import { ApiBearerAuth } from '@nestjs/swagger';

import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { UploaderService } from '@qbit-tech/libs-uploader';
import { convertStringToBoolean } from '@qbit-tech/libs-utils';
import { getAllAdminRoles } from '@qbit-tech/libs-utils';
import { SimpleResponse } from '@qbit-tech/libs-utils';
import { ERoles } from '../../core/roles';
import { AuthPermissionGuard } from '../../core/authPermission.guard';
import { FEATURE_PERMISSIONS } from '../permission/featureAndPermission/featureAndPermission.constant';

@ApiTags('Banner')
@Controller('banners')
export class BannerController implements BannerApiContract {

    constructor(
        private bannerService: BannerService,
        private uploaderService: UploaderService, // private userService: UserService, // private newsService: NewsService, // private bankApprovalService: BankApprovalService,
    ) { }

    @Get()
    @UseGuards(
        AuthPermissionGuard(
            FEATURE_PERMISSIONS.BANNER.__type,
            FEATURE_PERMISSIONS.BANNER.LIST.__type,
        ),
    )
    async findAll(
        @Query() query: BannerFindAllRequest,
    ): Promise<BannerFindAllResponse> {
        Logger.log('--ENTER FIND ALL BANNER CONTROLLER--');

        const res = await this.bannerService.getAllBanner({
            ...query,
            isPublished: convertStringToBoolean(query.isPublished),
        });

        return res;
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(
        AuthPermissionGuard(
            FEATURE_PERMISSIONS.BANNER.__type,
            FEATURE_PERMISSIONS.BANNER.CREATE.__type,
        ),
    )
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() body: BannerCreateRequest,
        @UploadedFile() file,
        @Req()
        req: {
            user: {
                userId: string;
                userType: string;
                name: string;
            };
        },
    ): Promise<BannerCreateResponse> {
        try {

            // const user = await this.userService.findOneByUserId(req.user.userId)
            Logger.log('--ENTER CREATE BANNER CONTROLLER--');
            const createdByUserId = req.user && req.user.userId ? req.user.userId : '';
            const metaCreatedByUser = req.user
                ? {
                    userId: req.user.userId,
                    userType: req.user.userType,
                    name: req.user.name,
                }
                : { userId: '', userType: '', name: '' };

            const banner = await this.bannerService.createBanner({
                ...body,
                createdByUserId,
                metaCreatedByUser,
            });


            if (file) {
                Logger.log('file added: ' + JSON.stringify(body), 'banner.controller');
                const uploadResult = await this.uploaderService.fileUploaded({
                    tableName: 'banners',
                    tableId: banner.bannerId,
                    filePath: file['key'],
                    metadata: {},
                });
                Logger.log(
                    'file uploaded: ' + JSON.stringify(file),
                    'banner.controller',
                );
                Logger.log('--EXIT CREATE VOUCHER CONTROLLER--');
                await this.bannerService.updateBannerImage({
                    bannerId: banner.bannerId,
                    bannerImageUrl: file ? uploadResult.fileLinkCache : null,
                });
            }
            return this.findOne(banner.bannerId);
        } catch (error) {
            console.info('err_banner: create', error);
            throw new HttpException(
                { code: 400, message: error.toString(), payload: {} },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get(':bannerId')
    async findOne(
        @Param('bannerId') bannerId: string,
    ): Promise<BannerFindOneResponse> {
        const res = await this.bannerService.getDetail(bannerId);
        return res;
    }

    @Patch(':bannerId')
    @UseGuards(
        AuthPermissionGuard(
            FEATURE_PERMISSIONS.BANNER.__type,
            FEATURE_PERMISSIONS.BANNER.LIST.__type,
        ),
    )
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('bannerId') bannerId: string,
        @Body() body: Omit<BannerUpdateRequest, 'bannerId'>,
        @Req()
        req: {
            user: {
                userId: string;
                userType: string;
                name: string;
            };
        },
        @UploadedFile() file,
    ): Promise<BannerUpdateResponse> {
        try {
            // const user = await this.userService.findOneByUserId(req.user.userId)

            if (file) {
                const imageResult = await this.updateImage({
                    file,
                    bannerId,
                });
                return this.bannerService.updateBanner({
                    ...body,
                    bannerId,
                    bannerImageUrl: imageResult.payload.fileLinkCache,
                });
            }
            return this.bannerService.updateBanner({
                ...body,
                bannerId,
                metaCreatedByUser: {
                    userId: req.user.userId,
                    userType: req.user.userType,
                    name: req.user.name,
                },
            });
        } catch (error) {
            console.info('err_banner: update', error);
            throw new HttpException(
                { code: 400, message: error.toString(), payload: {} },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Delete(':bannerId')
    // @UseGuards(AuthPermissionGuard('admin'))
    async delete(
        @Param('bannerId') bannerId: string,
    ): Promise<BannerDeleteResponse> {
        const result = await this.bannerService.deleteBanner(bannerId);

        // [NEED TO FIX] Also delete image if image exist

        return {
            results: {
                ...result,
                bannerId: bannerId,
            },
        };
    }



    async updateImage(request: UpdateImageRequest): Promise<UpdateImageResponse> {
        try {
            const fileSearchResult = await this.uploaderService.fileSearchByTable(
                'banners',
                [request.bannerId],
            );

            const uploadResult = await this.uploaderService.fileUploaded({
                tableName: 'banners',
                tableId: request.bannerId,
                filePath: request.file['key'],
                metadata: {},
            });

            if (fileSearchResult.has(request.bannerId)) {
                await this.uploaderService.deleteFileById(
                    fileSearchResult.get(request.bannerId)[0].fileId,
                );
            }

            return { isSuccess: true, payload: uploadResult };
        } catch (err) {
            console.log('err_banner: updateImage', err);
            return { isSuccess: false, payload: null };
        }
    }

    // @ApiBearerAuth()
    @Patch('queue/bulk')
    // @UseGuards(AuthPermissionGuard(getAllAdminRoles(ERoles)))
    async updateQueue(@Body() dto: BannersUpdateQueue): Promise<SimpleResponse> {
        try {
            await this.bannerService.updateQueue(dto.bulk);

            return {
                isSuccess: true,
            };
        } catch (err) {
            throw new HttpException({ message: err.errors }, HttpStatus.BAD_REQUEST);
        }
    }




}