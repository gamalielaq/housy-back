import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1781802374016 implements MigrationInterface {
    name = 'InitialSchema1781802374016';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`families\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(120) NOT NULL, \`description\` text NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_by\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`family_members\` (\`id\` varchar(36) NOT NULL, \`identity_user_id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`display_name\` varchar(120) NOT NULL, \`role\` enum ('owner', 'admin', 'member') NOT NULL DEFAULT 'member', \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_family_members_family_identity\` (\`family_id\`, \`identity_user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_categories\` (\`id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`name\` varchar(120) NOT NULL, \`description\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_task_categories_family_name\` (\`family_id\`, \`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`category_id\` varchar(36) NULL, \`title\` varchar(160) NOT NULL, \`description\` text NULL, \`recurrence_type\` enum ('weekly') NOT NULL DEFAULT 'weekly', \`day_of_week\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_rotation_members\` (\`id\` varchar(36) NOT NULL, \`task_id\` varchar(36) NOT NULL, \`family_member_id\` varchar(36) NOT NULL, \`position\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_rotation_task_position\` (\`task_id\`, \`position\`), UNIQUE INDEX \`IDX_rotation_task_family_member\` (\`task_id\`, \`family_member_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_assignments\` (\`id\` varchar(36) NOT NULL, \`task_id\` varchar(36) NOT NULL, \`family_member_id\` varchar(36) NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`status\` enum ('pending', 'completed', 'skipped') NOT NULL DEFAULT 'pending', \`completed_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_assignments_task_member_start\` (\`task_id\`, \`family_member_id\`, \`start_date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`task_history\` (\`id\` varchar(36) NOT NULL, \`task_assignment_id\` varchar(36) NOT NULL, \`completed_by\` varchar(36) NOT NULL, \`completed_at\` timestamp NOT NULL, \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(160) NOT NULL, \`message\` text NOT NULL, \`read\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`settings\` (\`id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`default_frequency\` varchar(40) NOT NULL DEFAULT 'weekly', \`language\` varchar(10) NOT NULL DEFAULT 'es', \`timezone\` varchar(80) NOT NULL DEFAULT 'America/Lima', \`family_config\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_settings_family\` (\`family_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );

        await queryRunner.query(
            `ALTER TABLE \`family_members\` ADD CONSTRAINT \`FK_family_members_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_categories\` ADD CONSTRAINT \`FK_task_categories_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_tasks_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_tasks_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`task_categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_rotation_members\` ADD CONSTRAINT \`FK_rotation_task\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_rotation_members\` ADD CONSTRAINT \`FK_rotation_family_member\` FOREIGN KEY (\`family_member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignments\` ADD CONSTRAINT \`FK_assignments_task\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_assignments\` ADD CONSTRAINT \`FK_assignments_family_member\` FOREIGN KEY (\`family_member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_history\` ADD CONSTRAINT \`FK_task_history_assignment\` FOREIGN KEY (\`task_assignment_id\`) REFERENCES \`task_assignments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`task_history\` ADD CONSTRAINT \`FK_task_history_completed_by\` FOREIGN KEY (\`completed_by\`) REFERENCES \`family_members\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`settings\` ADD CONSTRAINT \`FK_settings_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`settings\` DROP FOREIGN KEY \`FK_settings_family\``);
        await queryRunner.query(`ALTER TABLE \`task_history\` DROP FOREIGN KEY \`FK_task_history_completed_by\``);
        await queryRunner.query(`ALTER TABLE \`task_history\` DROP FOREIGN KEY \`FK_task_history_assignment\``);
        await queryRunner.query(`ALTER TABLE \`task_assignments\` DROP FOREIGN KEY \`FK_assignments_family_member\``);
        await queryRunner.query(`ALTER TABLE \`task_assignments\` DROP FOREIGN KEY \`FK_assignments_task\``);
        await queryRunner.query(`ALTER TABLE \`task_rotation_members\` DROP FOREIGN KEY \`FK_rotation_family_member\``);
        await queryRunner.query(`ALTER TABLE \`task_rotation_members\` DROP FOREIGN KEY \`FK_rotation_task\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_tasks_category\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_tasks_family\``);
        await queryRunner.query(`ALTER TABLE \`task_categories\` DROP FOREIGN KEY \`FK_task_categories_family\``);
        await queryRunner.query(`ALTER TABLE \`family_members\` DROP FOREIGN KEY \`FK_family_members_family\``);

        await queryRunner.query(`DROP INDEX \`IDX_settings_family\` ON \`settings\``);
        await queryRunner.query(`DROP TABLE \`settings\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP TABLE \`task_history\``);
        await queryRunner.query(`DROP INDEX \`IDX_assignments_task_member_start\` ON \`task_assignments\``);
        await queryRunner.query(`DROP TABLE \`task_assignments\``);
        await queryRunner.query(`DROP INDEX \`IDX_rotation_task_family_member\` ON \`task_rotation_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_rotation_task_position\` ON \`task_rotation_members\``);
        await queryRunner.query(`DROP TABLE \`task_rotation_members\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_task_categories_family_name\` ON \`task_categories\``);
        await queryRunner.query(`DROP TABLE \`task_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_family_members_family_identity\` ON \`family_members\``);
        await queryRunner.query(`DROP TABLE \`family_members\``);
        await queryRunner.query(`DROP TABLE \`families\``);
    }
}
