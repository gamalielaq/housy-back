import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CompleteTaskAssignmentDto {
    @IsUUID()
    completedBy!: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    notes?: string;
}
