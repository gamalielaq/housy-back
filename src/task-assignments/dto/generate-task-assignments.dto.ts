import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class GenerateTaskAssignmentsDto {
    @IsUUID()
    familyId!: string;

    @IsDateString()
    startDate!: string;

    @IsDateString()
    endDate!: string;

    @IsOptional()
    @IsUUID()
    taskId?: string;
}
