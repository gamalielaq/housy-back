import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { FamilyMembersModule } from './family-members/family-members.module';
import { TaskCategoriesModule } from './task-categories/task-categories.module';
import { TaskRotationsModule } from './task-rotations/task-rotations.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),
        DatabaseModule,
        FamilyMembersModule,
        TaskCategoriesModule,
        TasksModule,
        TaskRotationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
