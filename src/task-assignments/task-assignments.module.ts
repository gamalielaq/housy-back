import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMembersModule } from '../family-members/family-members.module';
import { TaskHistory } from '../task-history/entities/task-history.entity';
import { TaskRotationMember } from '../task-rotations/entities/task-rotation-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskAssignmentsController } from './task-assignments.controller';
import { TaskAssignmentsService } from './task-assignments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TaskAssignment,
            TaskHistory,
            Task,
            TaskRotationMember,
        ]),
        FamilyMembersModule,
    ],
    controllers: [TaskAssignmentsController],
    providers: [TaskAssignmentsService],
    exports: [TaskAssignmentsService],
})
export class TaskAssignmentsModule {}
