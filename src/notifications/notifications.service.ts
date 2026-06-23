import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
    ) {}

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        const notification = this.notificationsRepository.create({
            ...createNotificationDto,
            read: false,
        });

        return this.notificationsRepository.save(notification);
    }

    findAll(): Promise<Notification[]> {
        return this.notificationsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: string): Promise<Notification> {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException(`Notification with id ${id} was not found`);
        }

        notification.read = true;
        return this.notificationsRepository.save(notification);
    }
}
