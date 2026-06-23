import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import { FamiliesService } from './families.service';

@Controller('families')
export class FamiliesController {
    constructor(private readonly familiesService: FamiliesService) {}

    @Post()
    async create(@Body() createFamilyDto: CreateFamilyDto): Promise<{ data: Family }> {
        const family = await this.familiesService.create(createFamilyDto);
        return { data: family };
    }

    @Get()
    async findAll(): Promise<{ data: Family[] }> {
        const families = await this.familiesService.findAll();
        return { data: families };
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Family }> {
        const family = await this.familiesService.findOne(id);
        return { data: family };
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateFamilyDto: UpdateFamilyDto,
    ): Promise<{ data: Family }> {
        const family = await this.familiesService.update(id, updateFamilyDto);
        return { data: family };
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: Family; message: string }> {
        const family = await this.familiesService.remove(id);
        return { data: family, message: 'Family deactivated successfully' };
    }
}
