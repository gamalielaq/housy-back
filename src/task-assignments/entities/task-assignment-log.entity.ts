import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskAssignmentStatus } from '../../common/enums/task-assignment-status.enum';
import { User } from '../../users/entities/user.entity';
import { TaskAssignment } from './task-assignment.entity';

@Entity('task_assignment_logs')
export class TaskAssignmentLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'assignment_id', type: 'varchar', length: 36 })
  assignmentId!: string;

  @ManyToOne(() => TaskAssignment, (assignment) => assignment.logs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment!: TaskAssignment;

  @Column({
    name: 'changed_by_user_id',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  changedByUserId!: string | null;

  @ManyToOne(() => User, (user) => user.assignmentLogs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'changed_by_user_id' })
  changedByUser!: User | null;

  @Column({
    name: 'from_status',
    type: 'enum',
    enum: TaskAssignmentStatus,
    nullable: true,
  })
  fromStatus!: TaskAssignmentStatus | null;

  @Column({
    name: 'to_status',
    type: 'enum',
    enum: TaskAssignmentStatus,
  })
  toStatus!: TaskAssignmentStatus;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
