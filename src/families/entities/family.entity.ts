import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FamilyStatus } from '../../common/enums/family-status.enum';
import { FamilyMember } from '../../family-members/entities/family-member.entity';
import { TaskCategory } from '../../task-categories/entities/task-category.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('families')
export class Family {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 120 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({
        type: 'enum',
        enum: FamilyStatus,
        default: FamilyStatus.ACTIVE,
    })
    status!: FamilyStatus;

    @Column({ name: 'created_by', type: 'varchar', length: 36 })
    createdBy!: string;

    @OneToMany(() => FamilyMember, (familyMember) => familyMember.family)
    members!: FamilyMember[];

    @OneToMany(() => Task, (task) => task.family)
    tasks!: Task[];

    @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.family)
    taskCategories!: TaskCategory[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
