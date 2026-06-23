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
import { TaskAssignmentStatus } from '../../common/enums/task-assignment-status.enum';
import { FamilyMember } from '../../family-members/entities/family-member.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TaskAssignmentLog } from './task-assignment-log.entity';

@Entity('task_assignments')
@Index(['taskId', 'scheduledFor'], { unique: true })
export class TaskAssignment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'task_id', type: 'varchar', length: 36 })
    taskId!: string;

    @ManyToOne(() => Task, (task) => task.assignments, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'task_id' })
    task!: Task;

    @Column({ name: 'assigned_family_member_id', type: 'varchar', length: 36 })
    assignedFamilyMemberId!: string;

    @ManyToOne(() => FamilyMember, (familyMember) => familyMember.assignments, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'assigned_family_member_id' })
    assignedFamilyMember!: FamilyMember;

    @Column({ name: 'scheduled_for', type: 'date' })
    scheduledFor!: string;

    @Column({
        type: 'enum',
        enum: TaskAssignmentStatus,
        default: TaskAssignmentStatus.PENDING,
    })
    status!: TaskAssignmentStatus;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt!: Date | null;

    @Column({ type: 'text', nullable: true })
    notes!: string | null;

    @OneToMany(() => TaskAssignmentLog, (log) => log.assignment)
    logs!: TaskAssignmentLog[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
