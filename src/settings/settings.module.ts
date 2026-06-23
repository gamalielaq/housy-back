import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { Settings } from './entities/settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
    imports: [TypeOrmModule.forFeature([Settings]), FamiliesModule],
    controllers: [SettingsController],
    providers: [SettingsService],
})
export class SettingsModule {}
