import { Controller, Get, Headers } from '@nestjs/common';
import { TaskAssignment } from '../task-assignments/entities/task-assignment.entity';
import { TaskAssignmentsService } from '../task-assignments/task-assignments.service';

@Controller('my-tasks')
export class MyTasksController {
    constructor(private readonly taskAssignmentsService: TaskAssignmentsService) {}

    @Get()
    async findMine(
        @Headers('x-identity-user-id') identityUserId?: string,
    ): Promise<{ data: TaskAssignment[] }> {
        if (!identityUserId) {
            return { data: [] };
        }

        const assignments = await this.taskAssignmentsService.findPendingForIdentityUser(
            identityUserId,
        );
        return { data: assignments };
    }
}
