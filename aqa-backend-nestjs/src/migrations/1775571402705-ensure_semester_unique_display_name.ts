import { MigrationInterface, QueryRunner } from "typeorm";

export class EnsureSemesterUniqueDisplayName1775571402705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First delete any potential duplicates (keep only one with min id for each display_name)
        await queryRunner.query(`
            DELETE FROM semester a USING (
                SELECT MIN(semester_id) as min_id, display_name 
                FROM semester 
                GROUP BY display_name 
                HAVING COUNT(*) > 1
            ) b
            WHERE a.display_name = b.display_name 
            AND a.semester_id <> b.min_id
        `);

        // Add unique constraint
        await queryRunner.query(`
            ALTER TABLE "semester" ADD CONSTRAINT "UQ_semester_display_name" UNIQUE ("display_name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "semester" DROP CONSTRAINT "UQ_semester_display_name"
        `);
    }

}
