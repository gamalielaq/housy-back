import { IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpsertSettingsDto {
    @IsUUID()
    familyId!: string;

    @IsOptional()
    @IsString()
    @MaxLength(40)
    defaultFrequency?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    language?: string;

    @IsOptional()
    @IsString()
    @MaxLength(80)
    timezone?: string;

    @IsOptional()
    @IsObject()
    familyConfig?: Record<string, unknown>;
}
