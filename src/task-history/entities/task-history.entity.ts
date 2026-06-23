import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { FamilyMember } from '../../family-members/entities/family-member.entity';
import { TaskAssignment } from '../../task-assignments/entities/task-assignment.entity';

@Entity('task_history')
export class TaskHistory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'task_assignment_id', type: 'varchar', length: 36 })
    taskAssignmentId!: string;

    @ManyToOne(() => TaskAssignment, (assignment) => assignment.historyEntries, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'task_assignment_id' })
    taskAssignment!: TaskAssignment;

    @Column({ name: 'completed_by', type: 'varchar', length: 36 })
    completedBy!: string;

    @ManyToOne(() => FamilyMember, (familyMember) => familyMember.historyEntries, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'completed_by' })
    completedByMember!: FamilyMember;

    @Column({ name: 'completed_at', type: 'timestamp' })
    completedAt!: Date;

    @Column({ type: 'text', nullable: true })
    notes!: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
