import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DayOfWeek } from '../common/enums/day-of-week.enum';
import { TaskAssignmentStatus } from '../common/enums/task-assignment-status.enum';
import { FamilyMembersService } from '../family-members/family-members.service';
import { TaskHistory } from '../task-history/entities/task-history.entity';
import { TaskRotationMember } from '../task-rotations/entities/task-rotation-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { CompleteTaskAssignmentDto } from './dto/complete-task-assignment.dto';
import { GenerateTaskAssignmentsDto } from './dto/generate-task-assignments.dto';
import { TaskAssignment } from './entities/task-assignment.entity';

@Injectable()
export class TaskAssignmentsService {
    constructor(
        @InjectRepository(TaskAssignment)
        private readonly taskAssignmentsRepository: Repository<TaskAssignment>,
        @InjectRepository(TaskHistory)
        private readonly taskHistoryRepository: Repository<TaskHistory>,
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        @InjectRepository(TaskRotationMember)
        private readonly taskRotationMembersRepository: Repository<TaskRotationMember>,
        private readonly familyMembersService: FamilyMembersService,
    ) {}

    async generate(
        generateTaskAssignmentsDto: GenerateTaskAssignmentsDto,
    ): Promise<TaskAssignment[]> {
        this.ensureValidRange(
            generateTaskAssignmentsDto.startDate,
            generateTaskAssignmentsDto.endDate,
        );

        const tasks = await this.tasksRepository.find({
            where: {
                familyId: generateTaskAssignmentsDto.familyId,
                isActive: true,
                ...(generateTaskAssignmentsDto.taskId
                    ? { id: generateTaskAssignmentsDto.taskId }
                    : {}),
            },
            relations: { rotationMembers: true },
            order: { title: 'ASC' },
        });

        if (generateTaskAssignmentsDto.taskId && tasks.length === 0) {
            throw new NotFoundException(
                `Task with id ${generateTaskAssignmentsDto.taskId} was not found in family ${generateTaskAssignmentsDto.familyId}`,
            );
        }

        const assignmentsToCreate: TaskAssignment[] = [];

        for (const task of tasks) {
            const rotationMembers = await this.taskRotationMembersRepository.find({
                where: { taskId: task.id, isActive: true },
                order: { position: 'ASC' },
            });

            if (rotationMembers.length === 0) {
                continue;
            }

            const dates = this.getMatchingDates(
                generateTaskAssignmentsDto.startDate,
                generateTaskAssignmentsDto.endDate,
                task.dayOfWeek,
            );

            dates.forEach((date, index) => {
                const rotationMember = rotationMembers[index % rotationMembers.length];
                assignmentsToCreate.push(
                    this.taskAssignmentsRepository.create({
                        taskId: task.id,
                        familyMemberId: rotationMember.familyMemberId,
                        startDate: date,
                        endDate: date,
                        status: TaskAssignmentStatus.PENDING,
                        completedAt: null,
                    }),
                );
            });
        }

        if (assignmentsToCreate.length === 0) {
            return [];
        }

        const savedAssignments: TaskAssignment[] = [];

        for (const assignment of assignmentsToCreate) {
            const exists = await this.taskAssignmentsRepository.exists({
                where: {
                    taskId: assignment.taskId,
                    familyMemberId: assignment.familyMemberId,
                    startDate: assignment.startDate,
                },
            });

            if (!exists) {
                savedAssignments.push(
                    await this.taskAssignmentsRepository.save(assignment),
                );
            }
        }

        return savedAssignments;
    }

    findAll(): Promise<TaskAssignment[]> {
        return this.taskAssignmentsRepository.find({
            relations: { task: true, familyMember: true },
            order: { startDate: 'ASC' },
        });
    }

    findCurrent(): Promise<TaskAssignment[]> {
        const today = this.toDateString(new Date());

        return this.taskAssignmentsRepository.find({
            where: {
                status: TaskAssignmentStatus.PENDING,
                startDate: LessThanOrEqual(today),
                endDate: MoreThanOrEqual(today),
            },
            relations: { task: true, familyMember: true },
            order: { startDate: 'ASC' },
        });
    }

    async findOne(id: string): Promise<TaskAssignment> {
        const assignment = await this.taskAssignmentsRepository.findOne({
            where: { id },
            relations: { task: true, familyMember: true },
        });

        if (!assignment) {
            throw new NotFoundException(`Task assignment with id ${id} was not found`);
        }

        return assignment;
    }

    async findPendingForIdentityUser(identityUserId: string): Promise<TaskAssignment[]> {
        const familyMembers = await this.familyMembersService.findByIdentityUserId(
            identityUserId,
        );
        const memberIds = familyMembers.map((member) => member.id);

        if (memberIds.length === 0) {
            return [];
        }

        return this.taskAssignmentsRepository
            .createQueryBuilder('assignment')
            .leftJoinAndSelect('assignment.task', 'task')
            .leftJoinAndSelect('assignment.familyMember', 'familyMember')
            .where('assignment.family_member_id IN (:...memberIds)', { memberIds })
            .andWhere('assignment.status = :status', {
                status: TaskAssignmentStatus.PENDING,
            })
            .orderBy('assignment.start_date', 'ASC')
            .getMany();
    }

    async complete(
        id: string,
        completeTaskAssignmentDto: CompleteTaskAssignmentDto,
    ): Promise<TaskAssignment> {
        const assignment = await this.findOne(id);

        if (assignment.status === TaskAssignmentStatus.COMPLETED) {
            return assignment;
        }

        await this.familyMembersService.ensureActiveInFamily(
            completeTaskAssignmentDto.completedBy,
            assignment.task.familyId,
        );

        const completedAt = new Date();
        assignment.status = TaskAssignmentStatus.COMPLETED;
        assignment.completedAt = completedAt;

        const savedAssignment = await this.taskAssignmentsRepository.save(assignment);

        const existingHistory = await this.taskHistoryRepository.findOne({
            where: { taskAssignmentId: assignment.id },
        });

        if (!existingHistory) {
            await this.taskHistoryRepository.save(
                this.taskHistoryRepository.create({
                    taskAssignmentId: assignment.id,
                    completedBy: completeTaskAssignmentDto.completedBy,
                    completedAt,
                    notes: completeTaskAssignmentDto.notes ?? null,
                }),
            );
        }

        return savedAssignment;
    }

    async countByStatus(status: TaskAssignmentStatus): Promise<number> {
        return this.taskAssignmentsRepository.count({ where: { status } });
    }

    async findNextPending(limit = 5): Promise<TaskAssignment[]> {
        return this.taskAssignmentsRepository.find({
            where: { status: TaskAssignmentStatus.PENDING },
            relations: { task: true, familyMember: true },
            order: { startDate: 'ASC' },
            take: limit,
        });
    }

    async findCompletedBetween(startDate: string, endDate: string): Promise<TaskAssignment[]> {
        return this.taskAssignmentsRepository.find({
            where: {
                status: TaskAssignmentStatus.COMPLETED,
                startDate: Between(startDate, endDate),
            },
            relations: { task: true, familyMember: true },
            order: { startDate: 'ASC' },
        });
    }

    private ensureValidRange(startDate: string, endDate: string): void {
        if (new Date(startDate) > new Date(endDate)) {
            throw new BadRequestException('startDate must be before or equal to endDate');
        }
    }

    private getMatchingDates(
        startDate: string,
        endDate: string,
        dayOfWeek: DayOfWeek | null,
    ): string[] {
        const dates: string[] = [];
        const current = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        while (current <= end) {
            if (!dayOfWeek || this.getDayOfWeek(current) === dayOfWeek) {
                dates.push(this.toDateString(current));
            }
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

    private getDayOfWeek(date: Date): DayOfWeek {
        const days = [
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY,
        ];

        return days[date.getDay()];
    }

    private toDateString(date: Date): string {
        return date.toISOString().slice(0, 10);
    }
}
