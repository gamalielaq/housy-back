import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from './entities/task-history.entity';

@Injectable()
export class TaskHistoryService {
    constructor(
        @InjectRepository(TaskHistory)
        private readonly taskHistoryRepository: Repository<TaskHistory>,
    ) {}

    findAll(): Promise<TaskHistory[]> {
        return this.taskHistoryRepository.find({
            relations: {
                completedByMember: true,
                taskAssignment: { task: true, familyMember: true },
            },
            order: { completedAt: 'DESC' },
        });
    }

    findByMember(memberId: string): Promise<TaskHistory[]> {
        return this.taskHistoryRepository.find({
            where: { completedBy: memberId },
            relations: {
                completedByMember: true,
                taskAssignment: { task: true, familyMember: true },
            },
            order: { completedAt: 'DESC' },
        });
    }

    findByTask(taskId: string): Promise<TaskHistory[]> {
        return this.taskHistoryRepository
            .createQueryBuilder('history')
            .leftJoinAndSelect('history.completedByMember', 'completedByMember')
            .leftJoinAndSelect('history.taskAssignment', 'taskAssignment')
            .leftJoinAndSelect('taskAssignment.task', 'task')
            .leftJoinAndSelect('taskAssignment.familyMember', 'familyMember')
            .where('taskAssignment.task_id = :taskId', { taskId })
            .orderBy('history.completed_at', 'DESC')
            .getMany();
    }
}
