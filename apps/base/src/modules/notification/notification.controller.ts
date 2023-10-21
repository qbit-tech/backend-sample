import { Controller, Get, HttpException, Logger, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { NotificationContract, NotificationFindAllRequest } from "./notification.contract";
import { NotificationService } from "./notification.service";
import { AuthPermissionGuard } from "../../core/authPermission.guard";
import { FEATURE_PERMISSIONS } from "@qbit-tech/libs-session";
import { getErrorStatusCode } from "@qbit-tech/libs-utils";

@ApiTags('Notifications')
@Controller('notifications/find/full')
export class NotificationController implements NotificationContract {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @ApiOperation({ summary: 'Find all notification' })
    // @ApiBearerAuth()
    @Get()
    // @UseGuards(
    //     AuthPermissionGuard(
    //         FEATURE_PERMISSIONS.NOTIFICATION_SCHEDULE.__type,
    //         FEATURE_PERMISSIONS.NOTIFICATION_SCHEDULE.LIST.__type,
    //     )
    // )
    @ApiOkResponse({ type: NotificationFindAllRequest })
    async findAll(
        @Query() params: NotificationFindAllRequest,
    ): Promise<any> {
        try {
            Logger.log('--ENTER FIND ALL NOTIFICATION CONTROLLER--');
            Logger.log('tag : ' + JSON.stringify(params), 'notification.controller');
            return await this.notificationService.findAll(params);
        } catch (error) {
            throw new HttpException(error, getErrorStatusCode(error));
        }
    }
}