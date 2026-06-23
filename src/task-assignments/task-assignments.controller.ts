import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CompleteTaskAssignmentDto } from './dto/complete-task-assignment.dto';
import { GenerateTaskAssignmentsDto } from './dto/generate-task-assignments.dto';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskAssignmentsService } from './task-assignments.service';

@Controller('task-assignments')
export class TaskAssignmentsController {
    constructor(private readonly taskAssignmentsService: TaskAssignmentsService) {}

    @Post('generate')
    async generate(
        @Body() generateTaskAssignmentsDto: GenerateTaskAssignmentsDto,
    ): Promise<{ data: TaskAssignment[] }> {
        const assignments = await this.taskAssignmentsService.generate(
            generateTaskAssignmentsDto,
        );
        return { data: assignments };
    }

    @Get()
    async findAll(): Promise<{ data: TaskAssignment[] }> {
        const assignments = await this.taskAssignmentsService.findAll();
        return { data: assignments };
    }

    @Get('current')
    async findCurrent(): Promise<{ data: TaskAssignment[] }> {
        const assignments = await this.taskAssignmentsService.findCurrent();
        return { data: assignments };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: TaskAssignment }> {
        const assignment = await this.taskAssignmentsService.findOne(id);
        return { data: assignment };
    }

    @Patch(':id/complete')
    async complete(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() completeTaskAssignmentDto: CompleteTaskAssignmentDto,
    ): Promise<{ data: TaskAssignment }> {
        const assignment = await this.taskAssignmentsService.complete(
            id,
            completeTaskAssignmentDto,
        );
        return { data: assignment };
    }
}
