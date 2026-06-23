import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FamilyMemberRole } from '../../common/enums/family-member-role.enum';
import { FamilyMemberStatus } from '../../common/enums/family-member-status.enum';
import { TaskAssignmentLog } from '../../task-assignments/entities/task-assignment-log.entity';
import { TaskAssignment } from '../../task-assignments/entities/task-assignment.entity';
import { TaskRotationMember } from '../../task-rotations/entities/task-rotation-member.entity';

@Entity('family_members')
@Index(['familyId', 'identityUserId'], { unique: true })
export class FamilyMember {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'identity_user_id', type: 'varchar', length: 36 })
    identityUserId!: string;

    @Column({ name: 'family_id', type: 'varchar', length: 36 })
    familyId!: string;

    @Column({ name: 'display_name', type: 'varchar', length: 120 })
    displayName!: string;

    @Column({
        type: 'enum',
        enum: FamilyMemberRole,
        default: FamilyMemberRole.MEMBER,
    })
    role!: FamilyMemberRole;

    @Column({
        type: 'enum',
        enum: FamilyMemberStatus,
        default: FamilyMemberStatus.ACTIVE,
    })
    status!: FamilyMemberStatus;

    @OneToMany(
        () => TaskRotationMember,
        (rotationMember) => rotationMember.familyMember,
    )
    rotationMemberships!: TaskRotationMember[];

    @OneToMany(() => TaskAssignment, (assignment) => assignment.assignedFamilyMember)
    assignments!: TaskAssignment[];

    @OneToMany(() => TaskAssignmentLog, (log) => log.changedByFamilyMember)
    assignmentLogs!: TaskAssignmentLog[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
