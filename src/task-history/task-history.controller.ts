import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TaskHistory } from './entities/task-history.entity';
import { TaskHistoryService } from './task-history.service';

@Controller('task-history')
export class TaskHistoryController {
    constructor(private readonly taskHistoryService: TaskHistoryService) {}

    @Get()
    async findAll(): Promise<{ data: TaskHistory[] }> {
        const history = await this.taskHistoryService.findAll();
        return { data: history };
    }

    @Get('member/:id')
    async findByMember(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: TaskHistory[] }> {
        const history = await this.taskHistoryService.findByMember(id);
        return { data: history };
    }

    @Get('task/:id')
    async findByTask(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ data: TaskHistory[] }> {
        const history = await this.taskHistoryService.findByTask(id);
        return { data: history };
    }
}
