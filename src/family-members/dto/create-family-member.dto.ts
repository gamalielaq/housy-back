import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { FamilyMemberRole } from '../../common/enums/family-member-role.enum';
import { FamilyMemberStatus } from '../../common/enums/family-member-status.enum';

export class CreateFamilyMemberDto {
    @IsUUID()
    identityUserId!: string;

    @IsUUID()
    familyId!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(120)
    displayName!: string;

    @IsOptional()
    @IsEnum(FamilyMemberRole)
    role?: FamilyMemberRole;

    @IsOptional()
    @IsEnum(FamilyMemberStatus)
    status?: FamilyMemberStatus;
}
