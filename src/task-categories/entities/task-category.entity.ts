import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../families/entities/family.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('task_categories')
@Index(['familyId', 'name'], { unique: true })
export class TaskCategory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'family_id', type: 'varchar', length: 36 })
    familyId!: string;

    @ManyToOne(() => Family, (family) => family.taskCategories, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'family_id' })
    family!: Family;

    @Column({ type: 'varchar', length: 120 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @OneToMany(() => Task, (task) => task.category)
    tasks!: Task[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
