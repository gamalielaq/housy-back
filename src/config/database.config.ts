import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskAssignmentLog } from '../task-assignments/entities/task-assignment-log.entity';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';
import { TaskCategory } from '../task-categories/entities/task-category.entity';
import { TaskRotationMember } from '../task-rotations/entities/task-rotation-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

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
    User,
    TaskCategory,
    Task,
    TaskRotationMember,
    TaskAssignment,
    TaskAssignmentLog,
  ],
  synchronize: false,
  logging: configService.get<boolean>('DB_LOGGING', false),
  migrationsRun: false,
});
