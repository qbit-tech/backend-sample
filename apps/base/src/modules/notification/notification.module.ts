import { Module } from "@nestjs/common";
import { AuthSessionModule } from "../authUser/authUser.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { NotificationModel } from "@qbit-tech/libs-notification/dist/notification.entity";
import { ConfigModule } from "@nestjs/config";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";

@Module({
    imports: [
        AuthSessionModule,
        SequelizeModule.forFeature([
            NotificationModel,
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.ENV_PATH,
        }),
    ],
    providers: [
        NotificationService,
    ],
    controllers: [
        NotificationController,
    ],
    exports: [
        NotificationService,
    ]
})

export class NotificationModule { }