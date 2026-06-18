import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskAssignmentLog } from '../../task-assignments/entities/task-assignment-log.entity';
import { TaskAssignment } from '../../task-assignments/entities/task-assignment.entity';
import { TaskRotationMember } from '../../task-rotations/entities/task-rotation-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 180, nullable: true, unique: true })
  email!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => TaskRotationMember, (rotationMember) => rotationMember.user)
  rotationMemberships!: TaskRotationMember[];

  @OneToMany(() => TaskAssignment, (assignment) => assignment.assignedUser)
  assignments!: TaskAssignment[];

  @OneToMany(() => TaskAssignmentLog, (log) => log.changedByUser)
  assignmentLogs!: TaskAssignmentLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
