import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1781802374016 implements MigrationInterface {
    name = 'InitialSchema1781802374016';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`task_categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(120) NOT NULL, \`description\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_314405f9b5865b703de1d7617c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`family_members\` (\`id\` varchar(36) NOT NULL, \`identity_user_id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`display_name\` varchar(120) NOT NULL, \`role\` enum ('owner', 'admin', 'member') NOT NULL DEFAULT 'member', \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_family_members_family_identity\` (\`family_id\`, \`identity_user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_rotation_members\` (\`id\` varchar(36) NOT NULL, \`task_id\` varchar(36) NOT NULL, \`family_member_id\` varchar(36) NOT NULL, \`position\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e938156aab1b43b06fa74ca385\` (\`task_id\`, \`position\`), UNIQUE INDEX \`IDX_rotation_task_family_member\` (\`task_id\`, \`family_member_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`category_id\` varchar(36) NULL, \`title\` varchar(160) NOT NULL, \`description\` text NULL, \`recurrence_type\` enum ('weekly') NOT NULL DEFAULT 'weekly', \`day_of_week\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_assignments\` (\`id\` varchar(36) NOT NULL, \`task_id\` varchar(36) NOT NULL, \`assigned_family_member_id\` varchar(36) NOT NULL, \`scheduled_for\` date NOT NULL, \`status\` enum ('pending', 'completed', 'skipped', 'expired') NOT NULL DEFAULT 'pending', \`completed_at\` timestamp NULL, \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e070ab7ed191cd653abdd592dc\` (\`task_id\`, \`scheduled_for\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_assignment_logs\` (\`id\` varchar(36) NOT NULL, \`assignment_id\` varchar(36) NOT NULL, \`changed_by_family_member_id\` varchar(36) NULL, \`from_status\` enum ('pending', 'completed', 'skipped', 'expired') NULL, \`to_status\` enum ('pending', 'completed', 'skipped', 'expired') NOT NULL, \`message\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_rotation_members\` ADD CONSTRAINT \`FK_09f45186e5c496de522975e07f3\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_rotation_members\` ADD CONSTRAINT \`FK_rotation_family_member\` FOREIGN KEY (\`family_member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_d94d89c9ec19bc4470e3368c905\` FOREIGN KEY (\`category_id\`) REFERENCES \`task_categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignments\` ADD CONSTRAINT \`FK_b389f4488d0a8241c3c98273966\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignments\` ADD CONSTRAINT \`FK_assignment_family_member\` FOREIGN KEY (\`assigned_family_member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignment_logs\` ADD CONSTRAINT \`FK_16c388cfd4d1d12315872083ccc\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`task_assignments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignment_logs\` ADD CONSTRAINT \`FK_assignment_log_family_member\` FOREIGN KEY (\`changed_by_family_member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`task_assignment_logs\` DROP FOREIGN KEY \`FK_assignment_log_family_member\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignment_logs\` DROP FOREIGN KEY \`FK_16c388cfd4d1d12315872083ccc\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignments\` DROP FOREIGN KEY \`FK_assignment_family_member\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignments\` DROP FOREIGN KEY \`FK_b389f4488d0a8241c3c98273966\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_d94d89c9ec19bc4470e3368c905\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_rotation_members\` DROP FOREIGN KEY \`FK_rotation_family_member\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_rotation_members\` DROP FOREIGN KEY \`FK_09f45186e5c496de522975e07f3\``,
        );
        await queryRunner.query(`DROP TABLE \`task_assignment_logs\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_e070ab7ed191cd653abdd592dc\` ON \`task_assignments\``,
        );
        await queryRunner.query(`DROP TABLE \`task_assignments\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_rotation_task_family_member\` ON \`task_rotation_members\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_e938156aab1b43b06fa74ca385\` ON \`task_rotation_members\``,
        );
        await queryRunner.query(`DROP TABLE \`task_rotation_members\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_family_members_family_identity\` ON \`family_members\``,
        );
        await queryRunner.query(`DROP TABLE \`family_members\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_314405f9b5865b703de1d7617c\` ON \`task_categories\``,
        );
        await queryRunner.query(`DROP TABLE \`task_categories\``);
    }
}
