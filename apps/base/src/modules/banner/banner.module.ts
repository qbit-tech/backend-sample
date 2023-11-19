import { Module } from "@nestjs/common";
import { BannerController } from "./banner.controller";
import { BannerService } from "./banner.service";
import { BannerModel } from "./banner.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { MulterModule } from "@nestjs/platform-express";


@Module({
    imports: [
        SequelizeModule.forFeature([BannerModel]),
        MulterModule.register({
            dest: './images', // Set the destination folder for uploaded files
          }),
    ],
    providers: [BannerService],
    controllers: [BannerController],
})
export class BannerModule { }