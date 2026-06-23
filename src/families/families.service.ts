import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyStatus } from '../common/enums/family-status.enum';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';

@Injectable()
export class FamiliesService {
    constructor(
        @InjectRepository(Family)
        private readonly familiesRepository: Repository<Family>,
    ) {}

    async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
        const family = this.familiesRepository.create({
            ...createFamilyDto,
            description: createFamilyDto.description ?? null,
            status: createFamilyDto.status ?? FamilyStatus.ACTIVE,
        });

        return this.familiesRepository.save(family);
    }

    findAll(): Promise<Family[]> {
        return this.familiesRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Family> {
        const family = await this.familiesRepository.findOne({ where: { id } });

        if (!family) {
            throw new NotFoundException(`Family with id ${id} was not found`);
        }

        return family;
    }

    async update(id: string, updateFamilyDto: UpdateFamilyDto): Promise<Family> {
        const family = await this.findOne(id);
        Object.assign(family, updateFamilyDto);

        return this.familiesRepository.save(family);
    }

    async remove(id: string): Promise<Family> {
        const family = await this.findOne(id);
        family.status = FamilyStatus.INACTIVE;

        return this.familiesRepository.save(family);
    }

    async ensureExists(id: string): Promise<void> {
        const exists = await this.familiesRepository.exists({ where: { id } });

        if (!exists) {
            throw new NotFoundException(`Family with id ${id} was not found`);
        }
    }
}
