import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { FamilyStatus } from '../../common/enums/family-status.enum';

export class UpdateFamilyDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string | null;

    @IsOptional()
    @IsEnum(FamilyStatus)
    status?: FamilyStatus;

    @IsOptional()
    @IsUUID()
    createdBy?: string;
}
