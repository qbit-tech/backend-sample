import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors} from '@nestjs/common';
import { BannerService } from "./banner.service";
import { BannerModel } from "./banner.entity";
import { CreateBannerDto } from "./dto/create.banner.dto";
import {
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiHeader,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';


@Controller("banners")
@ApiTags("Banner")
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @ApiOperation({ summary: "get banner by Id" })
    @Get(":bannerId")
    async getBannerById(
        @Param('bannerId') bannerId: string
    ): Promise<BannerModel> {
        try {
            const banner = await this.bannerService.getBannerById(
                bannerId
            );
            return banner;
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: "get all banner" })
    @Get()
    async getAllBanner(): Promise<BannerModel[]> {
        try {
            const banner = await this.bannerService.getAllBanner();
            return banner;
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: "get requested amount of latest banner sorted" })
    @Get("latest/:amount")
    async getLatestBanner(
        @Param('amount') amount: number
    ): Promise<BannerModel[]> {
        try {
            const banner = await this.bannerService.getLatestBanner(amount);
            return banner;
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: "create new banner" })
    @Post()
    @ApiBody({
        type: CreateBannerDto,
    })
    async createBanner(
        @Body() body: CreateBannerDto
    ): Promise<BannerModel> {
        try {
            const banners = await this.bannerService.createBanner(
                body
            );
            return banners;
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: "update banner" })
    @Patch(":bannerId")
    @ApiBody({
        type: CreateBannerDto,
      })
    async updateBanner(
        @Param('bannerId') bannerId: string,
        @Body() body: CreateBannerDto
    ): Promise<BannerModel> {
        try {
            const banner = await this.bannerService.updateBanner(
                bannerId,
                body.title,
                body.bannerImage,
                body.bannerLink
            );
            return banner;
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: "delete banner by Id" })
    @Delete(":bannerId")
    async deleteBanner(
        @Param('bannerId') bannerId: string,
    ): Promise<BannerModel> {
        try {
            const banner = await this.bannerService.deleteBanner(
                bannerId
            );
            return banner;
        } catch (error) {
            throw new HttpException(
                error,
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
}
