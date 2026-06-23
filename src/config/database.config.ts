import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Family } from '../families/entities/family.entity';
import { FamilyMember } from '../family-members/entities/family-member.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Settings } from '../settings/entities/settings.entity';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';
import { TaskCategory } from '../task-categories/entities/task-category.entity';
import { TaskHistory } from '../task-history/entities/task-history.entity';
import { TaskRotationMember } from '../task-rotations/entities/task-rotation-member.entity';
import { Task } from '../tasks/entities/task.entity';

export const getDatabaseConfig = (
    configService: ConfigService,
): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: configService.getOrThrow<string>('DB_HOST'),
    port: Number(configService.getOrThrow<number>('DB_PORT')),
    username: configService.getOrThrow<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.getOrThrow<string>('DB_DATABASE'),
    entities: [
        Family,
        FamilyMember,
        TaskCategory,
        Task,
        TaskRotationMember,
        TaskAssignment,
        TaskHistory,
        Notification,
        Settings,
    ],
    synchronize: false,
    logging: configService.get<boolean>('DB_LOGGING', false),
    migrationsRun: false,
});
