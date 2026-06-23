import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamiliesService } from '../families/families.service';
import { CreateTaskCategoryDto } from './dto/create-task-category.dto';
import { UpdateTaskCategoryDto } from './dto/update-task-category.dto';
import { TaskCategory } from './entities/task-category.entity';

@Injectable()
export class TaskCategoriesService {
    constructor(
        @InjectRepository(TaskCategory)
        private readonly taskCategoriesRepository: Repository<TaskCategory>,
        private readonly familiesService: FamiliesService,
    ) {}

    async create(
        createTaskCategoryDto: CreateTaskCategoryDto,
    ): Promise<TaskCategory> {
        await this.familiesService.ensureExists(createTaskCategoryDto.familyId);
        await this.ensureNameIsAvailable(
            createTaskCategoryDto.familyId,
            createTaskCategoryDto.name,
        );

        const taskCategory = this.taskCategoriesRepository.create({
            ...createTaskCategoryDto,
            description: createTaskCategoryDto.description ?? null,
        });

        return this.taskCategoriesRepository.save(taskCategory);
    }

    findAll(): Promise<TaskCategory[]> {
        return this.taskCategoriesRepository.find({
            relations: { family: true },
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<TaskCategory> {
        const taskCategory = await this.taskCategoriesRepository.findOne({
            where: { id },
            relations: { family: true },
        });

        if (!taskCategory) {
            throw new NotFoundException(`Task category with id ${id} was not found`);
        }

        return taskCategory;
    }

    async update(
        id: string,
        updateTaskCategoryDto: UpdateTaskCategoryDto,
    ): Promise<TaskCategory> {
        const taskCategory = await this.findOne(id);
        const nextFamilyId = updateTaskCategoryDto.familyId ?? taskCategory.familyId;
        const nextName = updateTaskCategoryDto.name ?? taskCategory.name;

        if (updateTaskCategoryDto.familyId) {
            await this.familiesService.ensureExists(updateTaskCategoryDto.familyId);
        }

        if (nextFamilyId !== taskCategory.familyId || nextName !== taskCategory.name) {
            await this.ensureNameIsAvailable(nextFamilyId, nextName, id);
        }

        Object.assign(taskCategory, updateTaskCategoryDto);

        return this.taskCategoriesRepository.save(taskCategory);
    }

    async remove(id: string): Promise<void> {
        const taskCategory = await this.findOne(id);
        await this.taskCategoriesRepository.remove(taskCategory);
    }

    async ensureExistsInFamily(categoryId: string, familyId: string): Promise<void> {
        const exists = await this.taskCategoriesRepository.exists({
            where: { id: categoryId, familyId },
        });

        if (!exists) {
            throw new NotFoundException(
                `Task category with id ${categoryId} was not found in family ${familyId}`,
            );
        }
    }

    private async ensureNameIsAvailable(
        familyId: string,
        name: string,
        currentTaskCategoryId?: string,
    ): Promise<void> {
        const existingTaskCategory = await this.taskCategoriesRepository.findOne({
            where: { familyId, name },
        });

        if (
            existingTaskCategory &&
            existingTaskCategory.id !== currentTaskCategoryId
        ) {
            throw new ConflictException(
                `Task category ${name} already exists in family ${familyId}`,
            );
        }
    }
}
