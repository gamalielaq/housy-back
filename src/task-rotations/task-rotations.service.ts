import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
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
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async setRotation(
    taskId: string,
    setTaskRotationDto: SetTaskRotationDto,
  ): Promise<TaskRotationMember[]> {
    await this.ensureTaskExists(taskId);
    this.ensureUniqueMembers(setTaskRotationDto);
    this.ensureUniquePositions(setTaskRotationDto);
    await this.ensureUsersExist(
      setTaskRotationDto.members.map((member) => member.userId),
    );

    return this.dataSource.transaction(async (manager) => {
      await manager.delete(TaskRotationMember, { taskId });

      const rotationMembers = setTaskRotationDto.members.map((member) =>
        manager.create(TaskRotationMember, {
          taskId,
          userId: member.userId,
          position: member.position,
          isActive: true,
        }),
      );

      await manager.save(TaskRotationMember, rotationMembers);

      return manager.find(TaskRotationMember, {
        where: { taskId },
        relations: { user: true },
        order: { position: 'ASC' },
      });
    });
  }

  async findByTask(taskId: string): Promise<TaskRotationMember[]> {
    await this.ensureTaskExists(taskId);

    return this.taskRotationMembersRepository.find({
      where: { taskId },
      relations: { user: true },
      order: { position: 'ASC' },
    });
  }

  async removeMember(taskId: string, userId: string): Promise<void> {
    await this.ensureTaskExists(taskId);

    const result = await this.taskRotationMembersRepository.delete({
      taskId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException(
        `User with id ${userId} is not part of the task rotation`,
      );
    }
  }

  private async ensureTaskExists(taskId: string): Promise<void> {
    const exists = await this.tasksRepository.exists({ where: { id: taskId } });

    if (!exists) {
      throw new NotFoundException(`Task with id ${taskId} was not found`);
    }
  }

  private async ensureUsersExist(userIds: string[]): Promise<void> {
    const users = await this.usersRepository.find({
      where: { id: In(userIds), isActive: true },
      select: { id: true },
    });
    const existingUserIds = new Set(users.map((user) => user.id));
    const missingUserIds = userIds.filter(
      (userId) => !existingUserIds.has(userId),
    );

    if (missingUserIds.length > 0) {
      throw new NotFoundException(
        `Users were not found or are inactive: ${missingUserIds.join(', ')}`,
      );
    }
  }

  private ensureUniqueMembers(setTaskRotationDto: SetTaskRotationDto): void {
    const userIds = setTaskRotationDto.members.map((member) => member.userId);
    const uniqueUserIds = new Set(userIds);

    if (uniqueUserIds.size !== userIds.length) {
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
