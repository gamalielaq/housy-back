import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';
import { TaskAssignmentsModule } from '../task-assignments/task-assignments.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssignment]), TaskAssignmentsModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
