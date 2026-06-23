import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    @MinLength(2)
    @MaxLength(160)
    title!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(1000)
    message!: string;
}
