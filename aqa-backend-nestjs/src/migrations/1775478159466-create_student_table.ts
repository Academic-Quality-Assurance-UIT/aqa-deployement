import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudentTable1775478159466 implements MigrationInterface {
    name = 'CreateStudentTable1775478159466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "student" (
                "email" character varying NOT NULL,
                "tid" character varying,
                "sid" integer NOT NULL,
                "firstname" character varying,
                "lastname" character varying,
                "token" character varying,
                "completed_at" TIMESTAMP WITH TIME ZONE,
                "usesleft" integer,
                "mssv" character varying,
                "khoa" character varying,
                "k" character varying,
                "hedt" character varying,
                "malop" character varying,
                "magv" character varying,
                "tengv" character varying,
                "tenmh" character varying,
                "khoaql" character varying,
                "nganh" character varying,
                "tennganh" character varying,
                "semester_name" character varying,
                CONSTRAINT "PK_student" PRIMARY KEY ("email")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_student_tid" ON "student" ("tid")`);
        await queryRunner.query(`CREATE INDEX "IDX_student_sid" ON "student" ("sid")`);
        await queryRunner.query(`CREATE INDEX "IDX_student_mssv" ON "student" ("mssv")`);
        await queryRunner.query(`CREATE INDEX "IDX_student_malop" ON "student" ("malop")`);
        await queryRunner.query(`CREATE INDEX "IDX_student_semester_name" ON "student" ("semester_name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_student_semester_name"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_student_malop"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_student_mssv"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_student_sid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_student_tid"`);
        await queryRunner.query(`DROP TABLE "student"`);
    }
}
