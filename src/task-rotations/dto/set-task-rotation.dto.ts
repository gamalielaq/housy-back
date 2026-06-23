import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';

export class TaskRotationMemberDto {
    @IsUUID()
    familyMemberId!: string;

    @IsInt()
    @Min(1)
    position!: number;
}

export class SetTaskRotationDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TaskRotationMemberDto)
    members!: TaskRotationMemberDto[];
}
