import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 160 })
    title!: string;

    @Column({ type: 'text' })
    message!: string;

    @Column({ type: 'boolean', default: false })
    read!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
