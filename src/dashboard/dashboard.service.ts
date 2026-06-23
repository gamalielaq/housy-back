import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAssignmentStatus } from '../common/enums/task-assignment-status.enum';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';
import { TaskAssignmentsService } from '../task-assignments/task-assignments.service';

export interface DashboardSummary {
    pendingTasks: number;
    completedTasks: number;
    nextTasks: TaskAssignment[];
    topMember: { id: string; displayName: string; completedTasks: number } | null;
    completionPercentage: number;
}

@Injectable()
export class DashboardService {
    constructor(
        private readonly taskAssignmentsService: TaskAssignmentsService,
        @InjectRepository(TaskAssignment)
        private readonly taskAssignmentsRepository: Repository<TaskAssignment>,
    ) {}

    async getSummary(): Promise<DashboardSummary> {
        const [pendingTasks, completedTasks, totalTasks, nextTasks, topMember] =
            await Promise.all([
                this.taskAssignmentsService.countByStatus(TaskAssignmentStatus.PENDING),
                this.taskAssignmentsService.countByStatus(TaskAssignmentStatus.COMPLETED),
                this.taskAssignmentsRepository.count(),
                this.taskAssignmentsService.findNextPending(5),
                this.findTopMember(),
            ]);

        return {
            pendingTasks,
            completedTasks,
            nextTasks,
            topMember,
            completionPercentage:
                totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
        };
    }

    private async findTopMember(): Promise<DashboardSummary['topMember']> {
        const result = await this.taskAssignmentsRepository
            .createQueryBuilder('assignment')
            .leftJoin('assignment.familyMember', 'familyMember')
            .select('familyMember.id', 'id')
            .addSelect('familyMember.display_name', 'displayName')
            .addSelect('COUNT(assignment.id)', 'completedTasks')
            .where('assignment.status = :status', {
                status: TaskAssignmentStatus.COMPLETED,
            })
            .groupBy('familyMember.id')
            .addGroupBy('familyMember.display_name')
            .orderBy('completedTasks', 'DESC')
            .limit(1)
            .getRawOne<{
                id: string;
                displayName: string;
                completedTasks: string;
            }>();

        if (!result) {
            return null;
        }

        return {
            id: result.id,
            displayName: result.displayName,
            completedTasks: Number(result.completedTasks),
        };
    }
}
