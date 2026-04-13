import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1775576177706 implements MigrationInterface {
  name = 'InitialSchema1775576177706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('semester');
    if (table) return;

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "unaccent"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "btree_gin"`);
    await queryRunner.query(
      `CREATE TABLE "semester" ("semester_id" character varying NOT NULL, "display_name" character varying NOT NULL, "type" character varying, "year" character varying, "search_string" character varying, CONSTRAINT "PK_06f44a368424d5968fb2da79e18" PRIMARY KEY ("semester_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_11a0831f0ecd3229956f6dc8ae" ON "semester" ("year") `,
    );
    await queryRunner.query(
      `CREATE TABLE "staff_survey_criteria" ("staff_survey_criteria_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying NOT NULL, "category" character varying NOT NULL, "index" integer, "semesters" text array NOT NULL DEFAULT '{}', "is_point_aggregated" boolean NOT NULL DEFAULT true, "is_shown" boolean NOT NULL DEFAULT true, "mapping_id" uuid, CONSTRAINT "UQ_4f43324ccb9784d1a65886746bb" UNIQUE ("display_name", "category"), CONSTRAINT "PK_abc4bf576d22aaa80a901998719" PRIMARY KEY ("staff_survey_criteria_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be61053475a544b26b834157d7" ON "staff_survey_criteria" ("is_shown") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aacdf520a3469da27a1d2ad57b" ON "staff_survey_criteria" ("mapping_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "criteria_mapping" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying NOT NULL, "raw_display_names" text array NOT NULL DEFAULT '{}', CONSTRAINT "PK_8508e8fa8d4a97da241351a92e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "criteria" ("criteria_id" character varying NOT NULL, "display_name" character varying NOT NULL, "index" integer, "semester_id" character varying, "is_shown" boolean NOT NULL DEFAULT true, "mapping_id" uuid, CONSTRAINT "PK_affb46f7985a6bec7d3d0f2b0fe" PRIMARY KEY ("criteria_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "point" ("point_id" character varying NOT NULL, "max_point" integer NOT NULL, "point" double precision NOT NULL, "class_id" character varying NOT NULL, "criteria_id" character varying NOT NULL, CONSTRAINT "PK_f900d38873a4023760b39e9132c" PRIMARY KEY ("point_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_62a87c21ffff4b5b2baa0061b2" ON "point" ("max_point") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_308b41e9b0d14fd5da369ee645" ON "point" ("class_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_154e6c0dea87abee2bd48e244c" ON "point" ("criteria_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "subject" ("subject_id" character varying NOT NULL, "display_name" character varying, "faculty_id" character varying NOT NULL, CONSTRAINT "PK_70fbdd4144f3fc91373a93fe04a" PRIMARY KEY ("subject_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5c7c16e41339f8c24e89880383" ON "subject" ("faculty_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "class" ("class_id" character varying NOT NULL, "display_name" character varying NOT NULL, "semester_id" character varying NOT NULL, "program" character varying NOT NULL, "class_type" character varying NOT NULL, "subject_id" character varying NOT NULL, "lecturer_id" character varying NOT NULL, "lecturer_1_id" character varying, "lecturer_2_id" character varying, "total_student" integer NOT NULL, "participating_student" integer NOT NULL, CONSTRAINT "PK_4265c685fe8a9043bd8d400ad58" PRIMARY KEY ("class_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_726337d5368f4cc1c3d83e1f79" ON "class" ("semester_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c2897c87a5839e7c6dfb738af" ON "class" ("subject_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b4b714ce38fee005e386565697" ON "class" ("lecturer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0018d3ea266ada7be365839acf" ON "class" ("lecturer_1_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a65cd8480d1c39f076807f02f2" ON "class" ("lecturer_2_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lecturer" ("lecturer_id" character varying NOT NULL, "display_name" character varying, "mscb" character varying, "faculty_id" character varying, "username" character varying, "learning_position" character varying, "birth_date" TIMESTAMP, "gender" boolean, "learning" character varying, "email" character varying, "phone" character varying, "ngach" character varying, "position" character varying, CONSTRAINT "PK_db3ca2d6ec6a1c0c84d283a0a65" PRIMARY KEY ("lecturer_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "faculty" ("faculty_id" character varying NOT NULL, "display_name" character varying NOT NULL, "full_name" character varying, "is_displayed" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8339473e71533d4789bccccca06" PRIMARY KEY ("faculty_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d08d60854624423378f929d351" ON "faculty" ("is_displayed") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_entity_role_enum" AS ENUM('LECTURER', 'FACULTY', 'FULL_ACCESS', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."user_entity_role_enum" NOT NULL, "displayName" character varying DEFAULT '', "username" character varying NOT NULL, "password" character varying, "lastAccess" TIMESTAMP WITH TIME ZONE DEFAULT '"2026-04-07T15:36:18.026Z"', "lastSendEmail" TIMESTAMP WITH TIME ZONE DEFAULT '"2026-04-07T15:36:18.026Z"', "facultyFacultyId" character varying, "lecturerLecturerId" character varying, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student" ("tid" character varying, "sid" integer NOT NULL, "firstname" character varying, "lastname" character varying, "email" character varying NOT NULL, "token" character varying, "completed_at" TIMESTAMP WITH TIME ZONE, "usesleft" integer, "mssv" character varying, "khoa" character varying, "k" character varying, "hedt" character varying, "malop" character varying, "magv" character varying, "tengv" character varying, "tenmh" character varying, "khoaql" character varying, "nganh" character varying, "tennganh" character varying, "semester_name" character varying, CONSTRAINT "PK_a56c051c91dbe1068ad683f536e" PRIMARY KEY ("email"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c67049ae47f3e7ab23775b5f63" ON "student" ("tid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_11f2842e9b7fc691a2966b280c" ON "student" ("sid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9128b525d923ff221a241ee0e" ON "student" ("mssv") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5e8ce0fdf68ddfe0b5bd65b0c" ON "student" ("malop") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4d49b8ad6531b1a04259e73fb" ON "student" ("semester_name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "staff_survey_batch" ("staff_survey_batch_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying, "semester" character varying, "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_d0cc10edc95b69c09a0f0805f18" UNIQUE ("display_name"), CONSTRAINT "PK_1839f176f895ddcebf8bbb88065" PRIMARY KEY ("staff_survey_batch_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "staff_survey_sheet" ("staff_survey_sheet_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying, "mscb" character varying, "birth" character varying, "gender" boolean, "faculty" character varying, "academic_degree" character varying, "academic_title" character varying, "additional_comment" character varying, "staff_survey_batch_id" uuid, CONSTRAINT "PK_887aacc835bdcd48576140fd225" PRIMARY KEY ("staff_survey_sheet_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "staff_survey_point" ("staff_survey_point_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "max_point" integer NOT NULL, "point" integer NOT NULL, "comment" character varying, "staff_survey_criteria_id" uuid, "staff_survey_sheet_id" uuid, CONSTRAINT "PK_3084b5a496384524f494f868651" PRIMARY KEY ("staff_survey_point_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission_entity" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "lecture_id" character varying NOT NULL, "faculty_id" character varying NOT NULL, CONSTRAINT "PK_57a5504c7abcb1d2a9c82ae6f48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_list_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "survey_type" character varying NOT NULL, "sid" character varying NOT NULL, "title" character varying, "type" character varying, "year" character varying, "semester_type" character varying, "semester_name" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_crawled_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5b4ba08862cceb39ca0b2b55851" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crawl_job" ("crawl_job_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "started_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "error_message" text, "summary" jsonb, "parameters" jsonb, "created_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "progress" integer NOT NULL DEFAULT '0', "total_data" integer NOT NULL DEFAULT '0', "detail_progress" integer NOT NULL DEFAULT '0', "detail_total" integer NOT NULL DEFAULT '0', "last_activity_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_175e9729319a14a0c536ea27143" PRIMARY KEY ("crawl_job_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_crawl_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "survey_list_config_id" uuid NOT NULL, "crawl_job_id" uuid NOT NULL, "sid" character varying NOT NULL, "status" character varying NOT NULL, "records_fetched" integer NOT NULL DEFAULT '0', "error_message" text, "started_at" TIMESTAMP WITH TIME ZONE NOT NULL, "completed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f111402b0a613a18ea05dc1e3cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crawl_staging_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crawl_job_id" uuid NOT NULL, "data_type" character varying NOT NULL, "data" jsonb NOT NULL, "key" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8af6aa1a1e39816a448c0edd4bc" UNIQUE ("crawl_job_id", "data_type", "key"), CONSTRAINT "PK_70df48a2667f2066fab66d8809d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crawl_job_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crawl_job_id" uuid NOT NULL, "service" character varying NOT NULL, "method" character varying NOT NULL, "endpoint" character varying NOT NULL, "status_code" integer, "duration_ms" integer, "error" text, "metadata" jsonb, "api_log_id" uuid, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bdf7786484c3c8e9ee3b7a9932f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crawl_api_request_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crawl_job_id" uuid NOT NULL, "request_url" text NOT NULL, "request_method" character varying NOT NULL, "request_params" jsonb, "request_headers" jsonb, "response_status_code" integer, "response_body" jsonb, "response_headers" jsonb, "duration_ms" integer, "error_message" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5cd5202284d1c2fa4433fa21d28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("comment_id" character varying NOT NULL, "content" character varying NOT NULL, "type" character varying NOT NULL, "type_list" text array DEFAULT '{}', "topic" character varying NOT NULL, "class_id" character varying, CONSTRAINT "PK_6a9f9bf1cf9a09107d3224a0e9a" PRIMARY KEY ("comment_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_setting" ("key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_38693fa7f77d18363aea4ee64e8" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_criteria" ADD CONSTRAINT "FK_aacdf520a3469da27a1d2ad57b0" FOREIGN KEY ("mapping_id") REFERENCES "criteria_mapping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria" ADD CONSTRAINT "FK_2f215cf70be2bf2a47f58e9022c" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria" ADD CONSTRAINT "FK_8508e8fa8d4a97da241351a92e7" FOREIGN KEY ("mapping_id") REFERENCES "criteria_mapping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "point" ADD CONSTRAINT "FK_308b41e9b0d14fd5da369ee6450" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "point" ADD CONSTRAINT "FK_154e6c0dea87abee2bd48e244cb" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("criteria_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject" ADD CONSTRAINT "FK_5c7c16e41339f8c24e898803831" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("faculty_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_726337d5368f4cc1c3d83e1f79f" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_2c2897c87a5839e7c6dfb738af3" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_b4b714ce38fee005e3865656974" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer"("lecturer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_0018d3ea266ada7be365839acf5" FOREIGN KEY ("lecturer_1_id") REFERENCES "lecturer"("lecturer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_a65cd8480d1c39f076807f02f2e" FOREIGN KEY ("lecturer_2_id") REFERENCES "lecturer"("lecturer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" ADD CONSTRAINT "FK_a9fb35131b3d66ecf1fb25c5cd6" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("faculty_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_0d7e1606d988336ac7c4485b4e3" FOREIGN KEY ("facultyFacultyId") REFERENCES "faculty"("faculty_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_321ec983d872275190a317d6b2a" FOREIGN KEY ("lecturerLecturerId") REFERENCES "lecturer"("lecturer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_sheet" ADD CONSTRAINT "FK_2e048981496cf885c2225ce7f55" FOREIGN KEY ("staff_survey_batch_id") REFERENCES "staff_survey_batch"("staff_survey_batch_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_point" ADD CONSTRAINT "FK_28984ef7d5ca478317beef9adfd" FOREIGN KEY ("staff_survey_criteria_id") REFERENCES "staff_survey_criteria"("staff_survey_criteria_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_point" ADD CONSTRAINT "FK_f8fa973a34a75a1a0c41ba8f3df" FOREIGN KEY ("staff_survey_sheet_id") REFERENCES "staff_survey_sheet"("staff_survey_sheet_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_crawl_history" ADD CONSTRAINT "FK_4de8497e3955db677a2eb7f52e4" FOREIGN KEY ("survey_list_config_id") REFERENCES "survey_list_config"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_crawl_history" ADD CONSTRAINT "FK_1c1c2f6d80b359b8b054ba7f8e4" FOREIGN KEY ("crawl_job_id") REFERENCES "crawl_job"("crawl_job_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crawl_staging_data" ADD CONSTRAINT "FK_ad4797e6243ebf483e707435a97" FOREIGN KEY ("crawl_job_id") REFERENCES "crawl_job"("crawl_job_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crawl_job_log" ADD CONSTRAINT "FK_7ceaee9d84f43f855dbbb63c0d0" FOREIGN KEY ("crawl_job_id") REFERENCES "crawl_job"("crawl_job_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crawl_api_request_log" ADD CONSTRAINT "FK_d58fa9a9dc3f43c033a3a708d27" FOREIGN KEY ("crawl_job_id") REFERENCES "crawl_job"("crawl_job_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_57f58603a2274983ccda5825708" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_57f58603a2274983ccda5825708"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crawl_api_request_log" DROP CONSTRAINT "FK_d58fa9a9dc3f43c033a3a708d27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crawl_job_log" DROP CONSTRAINT "FK_7ceaee9d84f43f855dbbb63c0d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crawl_staging_data" DROP CONSTRAINT "FK_ad4797e6243ebf483e707435a97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_crawl_history" DROP CONSTRAINT "FK_1c1c2f6d80b359b8b054ba7f8e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_crawl_history" DROP CONSTRAINT "FK_4de8497e3955db677a2eb7f52e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_point" DROP CONSTRAINT "FK_f8fa973a34a75a1a0c41ba8f3df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_point" DROP CONSTRAINT "FK_28984ef7d5ca478317beef9adfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_sheet" DROP CONSTRAINT "FK_2e048981496cf885c2225ce7f55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_321ec983d872275190a317d6b2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_0d7e1606d988336ac7c4485b4e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lecturer" DROP CONSTRAINT "FK_a9fb35131b3d66ecf1fb25c5cd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_a65cd8480d1c39f076807f02f2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_0018d3ea266ada7be365839acf5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_b4b714ce38fee005e3865656974"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_2c2897c87a5839e7c6dfb738af3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_726337d5368f4cc1c3d83e1f79f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject" DROP CONSTRAINT "FK_5c7c16e41339f8c24e898803831"`,
    );
    await queryRunner.query(
      `ALTER TABLE "point" DROP CONSTRAINT "FK_154e6c0dea87abee2bd48e244cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "point" DROP CONSTRAINT "FK_308b41e9b0d14fd5da369ee6450"`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria" DROP CONSTRAINT "FK_8508e8fa8d4a97da241351a92e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria" DROP CONSTRAINT "FK_2f215cf70be2bf2a47f58e9022c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_survey_criteria" DROP CONSTRAINT "FK_aacdf520a3469da27a1d2ad57b0"`,
    );
    await queryRunner.query(`DROP TABLE "admin_setting"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "crawl_api_request_log"`);
    await queryRunner.query(`DROP TABLE "crawl_job_log"`);
    await queryRunner.query(`DROP TABLE "crawl_staging_data"`);
    await queryRunner.query(`DROP TABLE "survey_crawl_history"`);
    await queryRunner.query(`DROP TABLE "crawl_job"`);
    await queryRunner.query(`DROP TABLE "survey_list_config"`);
    await queryRunner.query(`DROP TABLE "permission_entity"`);
    await queryRunner.query(`DROP TABLE "staff_survey_point"`);
    await queryRunner.query(`DROP TABLE "staff_survey_sheet"`);
    await queryRunner.query(`DROP TABLE "staff_survey_batch"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d4d49b8ad6531b1a04259e73fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5e8ce0fdf68ddfe0b5bd65b0c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9128b525d923ff221a241ee0e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_11f2842e9b7fc691a2966b280c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c67049ae47f3e7ab23775b5f63"`,
    );
    await queryRunner.query(`DROP TABLE "student"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d08d60854624423378f929d351"`,
    );
    await queryRunner.query(`DROP TABLE "faculty"`);
    await queryRunner.query(`DROP TABLE "lecturer"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a65cd8480d1c39f076807f02f2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0018d3ea266ada7be365839acf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4b714ce38fee005e386565697"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c2897c87a5839e7c6dfb738af"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_726337d5368f4cc1c3d83e1f79"`,
    );
    await queryRunner.query(`DROP TABLE "class"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5c7c16e41339f8c24e89880383"`,
    );
    await queryRunner.query(`DROP TABLE "subject"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_154e6c0dea87abee2bd48e244c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_308b41e9b0d14fd5da369ee645"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_62a87c21ffff4b5b2baa0061b2"`,
    );
    await queryRunner.query(`DROP TABLE "point"`);
    await queryRunner.query(`DROP TABLE "criteria"`);
    await queryRunner.query(`DROP TABLE "criteria_mapping"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aacdf520a3469da27a1d2ad57b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be61053475a544b26b834157d7"`,
    );
    await queryRunner.query(`DROP TABLE "staff_survey_criteria"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_11a0831f0ecd3229956f6dc8ae"`,
    );
    await queryRunner.query(`DROP TABLE "semester"`);
  }
}
