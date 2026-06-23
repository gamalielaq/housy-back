import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRecurrenceType } from '../common/enums/task-recurrence-type.enum';
import { FamiliesService } from '../families/families.service';
import { TaskCategoriesService } from '../task-categories/task-categories.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        private readonly familiesService: FamiliesService,
        private readonly taskCategoriesService: TaskCategoriesService,
    ) {}

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        await this.familiesService.ensureExists(createTaskDto.familyId);
        await this.ensureCategoryIsValidForFamily(
            createTaskDto.categoryId,
            createTaskDto.familyId,
        );

        const task = this.tasksRepository.create({
            ...createTaskDto,
            categoryId: createTaskDto.categoryId ?? null,
            description: createTaskDto.description ?? null,
            recurrenceType: createTaskDto.recurrenceType ?? TaskRecurrenceType.WEEKLY,
            dayOfWeek: createTaskDto.dayOfWeek ?? null,
        });

        return this.tasksRepository.save(task);
    }

    findAll(): Promise<Task[]> {
        return this.tasksRepository.find({
            relations: { family: true, category: true },
            order: { title: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: { family: true, category: true, rotationMembers: true },
        });

        if (!task) {
            throw new NotFoundException(`Task with id ${id} was not found`);
        }

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.findOne(id);
        const nextFamilyId = updateTaskDto.familyId ?? task.familyId;

        if (updateTaskDto.familyId) {
            await this.familiesService.ensureExists(updateTaskDto.familyId);
        }

        await this.ensureCategoryIsValidForFamily(
            updateTaskDto.categoryId,
            nextFamilyId,
        );

        Object.assign(task, updateTaskDto);

        return this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<Task> {
        const task = await this.findOne(id);
        task.isActive = false;

        return this.tasksRepository.save(task);
    }

    async ensureExists(id: string): Promise<Task> {
        return this.findOne(id);
    }

    private async ensureCategoryIsValidForFamily(
        categoryId: string | null | undefined,
        familyId: string,
    ): Promise<void> {
        if (!categoryId) {
            return;
        }

        await this.taskCategoriesService.ensureExistsInFamily(categoryId, familyId);
    }
}
