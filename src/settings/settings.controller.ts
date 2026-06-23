import { Body, Controller, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { UpsertSettingsDto } from './dto/upsert-settings.dto';
import { Settings } from './entities/settings.entity';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    async findAll(): Promise<{ data: Settings[] }> {
        const settings = await this.settingsService.findAll();
        return { data: settings };
    }

    @Get('family/:familyId')
    async findByFamily(
        @Param('familyId', ParseUUIDPipe) familyId: string,
    ): Promise<{ data: Settings }> {
        const settings = await this.settingsService.findByFamily(familyId);
        return { data: settings };
    }

    @Put()
    async upsert(
        @Body() upsertSettingsDto: UpsertSettingsDto,
    ): Promise<{ data: Settings }> {
        const settings = await this.settingsService.upsert(upsertSettingsDto);
        return { data: settings };
    }
}
