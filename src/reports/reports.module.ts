import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssignment])],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}
