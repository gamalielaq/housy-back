import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamiliesService } from '../families/families.service';
import { UpsertSettingsDto } from './dto/upsert-settings.dto';
import { Settings } from './entities/settings.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
        private readonly familiesService: FamiliesService,
    ) {}

    async findAll(): Promise<Settings[]> {
        return this.settingsRepository.find({
            relations: { family: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findByFamily(familyId: string): Promise<Settings> {
        const settings = await this.settingsRepository.findOne({
            where: { familyId },
            relations: { family: true },
        });

        if (!settings) {
            throw new NotFoundException(
                `Settings for family ${familyId} were not found`,
            );
        }

        return settings;
    }

    async upsert(upsertSettingsDto: UpsertSettingsDto): Promise<Settings> {
        await this.familiesService.ensureExists(upsertSettingsDto.familyId);

        const existingSettings = await this.settingsRepository.findOne({
            where: { familyId: upsertSettingsDto.familyId },
        });

        if (existingSettings) {
            Object.assign(existingSettings, upsertSettingsDto);
            return this.settingsRepository.save(existingSettings);
        }

        const settings = this.settingsRepository.create({
            familyId: upsertSettingsDto.familyId,
            defaultFrequency: upsertSettingsDto.defaultFrequency ?? 'weekly',
            language: upsertSettingsDto.language ?? 'es',
            timezone: upsertSettingsDto.timezone ?? 'America/Lima',
            familyConfig: upsertSettingsDto.familyConfig ?? null,
        });

        return this.settingsRepository.save(settings);
    }
}
