import { ApiProperty } from "@nestjs/swagger";
import { NotificationModel } from "@qbit-tech/libs-notification/dist/notification.entity";
import { DefaultFindAllRequest, PaginationResponse } from "@qbit-tech/libs-utils";

export abstract class NotificationContract {
    abstract findAll(params: NotificationFindAllRequest): Promise<NotificationFindAllResponse>
}

export class NotificationFindAllRequest extends DefaultFindAllRequest { }

export class NotificationFindAllResponse extends PaginationResponse {
    @ApiProperty({ type: [NotificationModel] })
    results: NotificationModel[];
}