import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateTaskCategoryDto {
    @IsUUID()
    familyId!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(120)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;
}
