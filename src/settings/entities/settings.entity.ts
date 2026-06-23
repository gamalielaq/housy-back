import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../families/entities/family.entity';

@Entity('settings')
@Index(['familyId'], { unique: true })
export class Settings {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'family_id', type: 'varchar', length: 36 })
    familyId!: string;

    @ManyToOne(() => Family, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'family_id' })
    family!: Family;

    @Column({ name: 'default_frequency', type: 'varchar', length: 40, default: 'weekly' })
    defaultFrequency!: string;

    @Column({ type: 'varchar', length: 10, default: 'es' })
    language!: string;

    @Column({ type: 'varchar', length: 80, default: 'America/Lima' })
    timezone!: string;

    @Column({ name: 'family_config', type: 'json', nullable: true })
    familyConfig!: Record<string, unknown> | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
