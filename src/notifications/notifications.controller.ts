import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    async create(
        @Body() createNotificationDto: CreateNotificationDto,
    ): Promise<{ data: Notification }> {
        const notification = await this.notificationsService.create(
            createNotificationDto,
        );
        return { data: notification };
    }

    @Get()
    async findAll(): Promise<{ data: Notification[] }> {
        const notifications = await this.notificationsService.findAll();
        return { data: notifications };
    }

    @Patch(':id/read')
    async markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: Notification }> {
        const notification = await this.notificationsService.markAsRead(id);
        return { data: notification };
    }
}
