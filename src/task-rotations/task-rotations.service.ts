import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { FamilyMemberStatus } from '../common/enums/family-member-status.enum';
import { FamilyMember } from '../family-members/entities/family-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { SetTaskRotationDto } from './dto/set-task-rotation.dto';
import { TaskRotationMember } from './entities/task-rotation-member.entity';

@Injectable()
export class TaskRotationsService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(TaskRotationMember)
        private readonly taskRotationMembersRepository: Repository<TaskRotationMember>,
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        @InjectRepository(FamilyMember)
        private readonly familyMembersRepository: Repository<FamilyMember>,
    ) {}

    async setRotation(
        taskId: string,
        setTaskRotationDto: SetTaskRotationDto,
    ): Promise<TaskRotationMember[]> {
        const task = await this.ensureTaskExists(taskId);
        this.ensureUniqueMembers(setTaskRotationDto);
        this.ensureUniquePositions(setTaskRotationDto);
        await this.ensureFamilyMembersExistInFamily(
            task.familyId,
            setTaskRotationDto.members.map((member) => member.familyMemberId),
        );

        return this.dataSource.transaction(async (manager) => {
            await manager.delete(TaskRotationMember, { taskId });

            const rotationMembers = setTaskRotationDto.members.map((member) =>
                manager.create(TaskRotationMember, {
                    taskId,
                    familyMemberId: member.familyMemberId,
                    position: member.position,
                    isActive: true,
                }),
            );

            await manager.save(TaskRotationMember, rotationMembers);

            return manager.find(TaskRotationMember, {
                where: { taskId },
                relations: { familyMember: true },
                order: { position: 'ASC' },
            });
        });
    }

    async findByTask(taskId: string): Promise<TaskRotationMember[]> {
        await this.ensureTaskExists(taskId);

        return this.taskRotationMembersRepository.find({
            where: { taskId },
            relations: { familyMember: true },
            order: { position: 'ASC' },
        });
    }

    async removeMember(taskId: string, familyMemberId: string): Promise<void> {
        await this.ensureTaskExists(taskId);

        const result = await this.taskRotationMembersRepository.delete({
            taskId,
            familyMemberId,
        });

        if (!result.affected) {
            throw new NotFoundException(
                `Family member with id ${familyMemberId} is not part of the task rotation`,
            );
        }
    }

    private async ensureTaskExists(taskId: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId } });

        if (!task) {
            throw new NotFoundException(`Task with id ${taskId} was not found`);
        }

        return task;
    }

    private async ensureFamilyMembersExistInFamily(
        familyId: string,
        familyMemberIds: string[],
    ): Promise<void> {
        const familyMembers = await this.familyMembersRepository.find({
            where: {
                id: In(familyMemberIds),
                familyId,
                status: FamilyMemberStatus.ACTIVE,
            },
            select: { id: true },
        });
        const existingFamilyMemberIds = new Set(
            familyMembers.map((familyMember) => familyMember.id),
        );
        const missingFamilyMemberIds = familyMemberIds.filter(
            (familyMemberId) => !existingFamilyMemberIds.has(familyMemberId),
        );

        if (missingFamilyMemberIds.length > 0) {
            throw new NotFoundException(
                `Family members were not found, inactive, or outside family ${familyId}: ${missingFamilyMemberIds.join(', ')}`,
            );
        }
    }

    private ensureUniqueMembers(setTaskRotationDto: SetTaskRotationDto): void {
        const familyMemberIds = setTaskRotationDto.members.map(
            (member) => member.familyMemberId,
        );
        const uniqueFamilyMemberIds = new Set(familyMemberIds);

        if (uniqueFamilyMemberIds.size !== familyMemberIds.length) {
            throw new BadRequestException('Rotation members must be unique');
        }
    }

    private ensureUniquePositions(setTaskRotationDto: SetTaskRotationDto): void {
        const positions = setTaskRotationDto.members.map(
            (member) => member.position,
        );
        const uniquePositions = new Set(positions);

        if (uniquePositions.size !== positions.length) {
            throw new BadRequestException('Rotation positions must be unique');
        }
    }
}
