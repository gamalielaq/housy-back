import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskAssignmentStatus } from '../../common/enums/task-assignment-status.enum';
import { FamilyMember } from '../../family-members/entities/family-member.entity';
import { TaskHistory } from '../../task-history/entities/task-history.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('task_assignments')
@Index(['taskId', 'familyMemberId', 'startDate'], { unique: true })
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

    @Column({ name: 'family_member_id', type: 'varchar', length: 36 })
    familyMemberId!: string;

    @ManyToOne(() => FamilyMember, (familyMember) => familyMember.assignments, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'family_member_id' })
    familyMember!: FamilyMember;

    @Column({ name: 'start_date', type: 'date' })
    startDate!: string;

    @Column({ name: 'end_date', type: 'date' })
    endDate!: string;

    @Column({
        type: 'enum',
        enum: TaskAssignmentStatus,
        default: TaskAssignmentStatus.PENDING,
    })
    status!: TaskAssignmentStatus;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt!: Date | null;

    @OneToMany(() => TaskHistory, (history) => history.taskAssignment)
    historyEntries!: TaskHistory[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
