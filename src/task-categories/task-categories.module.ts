import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { TaskCategory } from './entities/task-category.entity';
import { TaskCategoriesController } from './task-categories.controller';
import { TaskCategoriesService } from './task-categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskCategory]), FamiliesModule],
    controllers: [TaskCategoriesController],
    providers: [TaskCategoriesService],
    exports: [TaskCategoriesService],
})
export class TaskCategoriesModule {}
