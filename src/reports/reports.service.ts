import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAssignmentStatus } from '../common/enums/task-assignment-status.enum';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(TaskAssignment)
        private readonly taskAssignmentsRepository: Repository<TaskAssignment>,
    ) {}

    async getCompliance(): Promise<{
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        skippedTasks: number;
        completionPercentage: number;
    }> {
        const [totalTasks, completedTasks, pendingTasks, skippedTasks] =
            await Promise.all([
                this.taskAssignmentsRepository.count(),
                this.taskAssignmentsRepository.count({
                    where: { status: TaskAssignmentStatus.COMPLETED },
                }),
                this.taskAssignmentsRepository.count({
                    where: { status: TaskAssignmentStatus.PENDING },
                }),
                this.taskAssignmentsRepository.count({
                    where: { status: TaskAssignmentStatus.SKIPPED },
                }),
            ]);

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            skippedTasks,
            completionPercentage:
                totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
        };
    }

    async getMemberPerformance(): Promise<
        Array<{
            familyMemberId: string;
            displayName: string;
            completedTasks: number;
            pendingTasks: number;
            skippedTasks: number;
        }>
    > {
        const rows = await this.taskAssignmentsRepository
            .createQueryBuilder('assignment')
            .leftJoin('assignment.familyMember', 'familyMember')
            .select('familyMember.id', 'familyMemberId')
            .addSelect('familyMember.display_name', 'displayName')
            .addSelect(
                `SUM(CASE WHEN assignment.status = '${TaskAssignmentStatus.COMPLETED}' THEN 1 ELSE 0 END)`,
                'completedTasks',
            )
            .addSelect(
                `SUM(CASE WHEN assignment.status = '${TaskAssignmentStatus.PENDING}' THEN 1 ELSE 0 END)`,
                'pendingTasks',
            )
            .addSelect(
                `SUM(CASE WHEN assignment.status = '${TaskAssignmentStatus.SKIPPED}' THEN 1 ELSE 0 END)`,
                'skippedTasks',
            )
            .groupBy('familyMember.id')
            .addGroupBy('familyMember.display_name')
            .orderBy('completedTasks', 'DESC')
            .getRawMany<{
                familyMemberId: string;
                displayName: string;
                completedTasks: string;
                pendingTasks: string;
                skippedTasks: string;
            }>();

        return rows.map((row) => ({
            familyMemberId: row.familyMemberId,
            displayName: row.displayName,
            completedTasks: Number(row.completedTasks),
            pendingTasks: Number(row.pendingTasks),
            skippedTasks: Number(row.skippedTasks),
        }));
    }

    async getTasksReport(): Promise<
        Array<{
            taskId: string;
            title: string;
            completedTasks: number;
            pendingTasks: number;
            skippedTasks: number;
        }>
    > {
        const rows = await this.taskAssignmentsRepository
            .createQueryBuilder('assignment')
            .leftJoin('assignment.task', 'task')
            .select('task.id', 'taskId')
            .addSelect('task.title', 'title')
            .addSelect(
                `SUM(CASE WHEN assignment.status = '${TaskAssignmentStatus.COMPLETED}' THEN 1 ELSE 0 END)`,
                'completedTasks',
            )
            .addSelect(
                `SUM(CASE WHEN assignment.status = '${TaskAssignmentStatus.PENDING}' THEN 1 ELSE 0 END)`,
                'pendingTasks',
            )
            .addSelect(
                `SUM(CASE WHEN assignment.status = '${TaskAssignmentStatus.SKIPPED}' THEN 1 ELSE 0 END)`,
                'skippedTasks',
            )
            .groupBy('task.id')
            .addGroupBy('task.title')
            .orderBy('task.title', 'ASC')
            .getRawMany<{
                taskId: string;
                title: string;
                completedTasks: string;
                pendingTasks: string;
                skippedTasks: string;
            }>();

        return rows.map((row) => ({
            taskId: row.taskId,
            title: row.title,
            completedTasks: Number(row.completedTasks),
            pendingTasks: Number(row.pendingTasks),
            skippedTasks: Number(row.skippedTasks),
        }));
    }
}
