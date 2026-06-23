import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { FamiliesModule } from './families/families.module';
import { FamilyMembersModule } from './family-members/family-members.module';
import { MyTasksModule } from './my-tasks/my-tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { TaskAssignmentsModule } from './task-assignments/task-assignments.module';
import { TaskCategoriesModule } from './task-categories/task-categories.module';
import { TaskHistoryModule } from './task-history/task-history.module';
import { TaskRotationsModule } from './task-rotations/task-rotations.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),
        DatabaseModule,
        FamiliesModule,
        FamilyMembersModule,
        TaskCategoriesModule,
        TasksModule,
        TaskRotationsModule,
        TaskAssignmentsModule,
        TaskHistoryModule,
        MyTasksModule,
        DashboardModule,
        ReportsModule,
        NotificationsModule,
        SettingsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
