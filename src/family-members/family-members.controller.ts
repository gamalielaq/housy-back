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
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { FamilyMember } from './entities/family-member.entity';
import { FamilyMembersService } from './family-members.service';

@Controller('family-members')
export class FamilyMembersController {
    constructor(private readonly familyMembersService: FamilyMembersService) {}

    @Post()
    async create(
        @Body() createFamilyMemberDto: CreateFamilyMemberDto,
    ): Promise<{ data: FamilyMember }> {
        const familyMember = await this.familyMembersService.create(
            createFamilyMemberDto,
        );
        return { data: familyMember };
    }

    @Get()
    async findAll(): Promise<{ data: FamilyMember[] }> {
        const familyMembers = await this.familyMembersService.findAll();
        return { data: familyMembers };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: FamilyMember }> {
        const familyMember = await this.familyMembersService.findOne(id);
        return { data: familyMember };
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateFamilyMemberDto: UpdateFamilyMemberDto,
    ): Promise<{ data: FamilyMember }> {
        const familyMember = await this.familyMembersService.update(
            id,
            updateFamilyMemberDto,
        );
        return { data: familyMember };
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: FamilyMember; message: string }> {
        const familyMember = await this.familyMembersService.remove(id);
        return {
            data: familyMember,
            message: 'Family member deactivated successfully',
        };
    }
}
