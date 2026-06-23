import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('compliance')
    getCompliance() {
        return this.reportsService.getCompliance();
    }

    @Get('member-performance')
    getMemberPerformance() {
        return this.reportsService.getMemberPerformance();
    }

    @Get('tasks')
    getTasksReport() {
        return this.reportsService.getTasksReport();
    }
}
