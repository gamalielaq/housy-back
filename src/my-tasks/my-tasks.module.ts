import { Module } from '@nestjs/common';
import { TaskAssignmentsModule } from '../task-assignments/task-assignments.module';
import { MyTasksController } from './my-tasks.controller';

@Module({
    imports: [TaskAssignmentsModule],
    controllers: [MyTasksController],
})
export class MyTasksModule {}
