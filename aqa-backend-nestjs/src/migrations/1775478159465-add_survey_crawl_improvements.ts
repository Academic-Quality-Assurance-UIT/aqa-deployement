import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSurveyCrawlImprovements1775478159465 implements MigrationInterface {
    name = 'AddSurveyCrawlImprovements1775478159465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crawl_staging_data" ADD "key" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_list_config" ADD "last_crawled_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "crawl_staging_data" ADD CONSTRAINT "UQ_crawl_staging_data_key" UNIQUE ("crawl_job_id", "data_type", "key")`);

        await queryRunner.query(`
            CREATE TABLE "crawl_api_request_log" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "crawl_job_id" uuid NOT NULL,
                "request_url" text NOT NULL,
                "request_method" character varying NOT NULL,
                "request_params" jsonb,
                "request_headers" jsonb,
                "response_status_code" integer,
                "response_body" jsonb,
                "response_headers" jsonb,
                "duration_ms" integer,
                "error_message" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_crawl_api_request_log" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "survey_crawl_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "survey_list_config_id" uuid NOT NULL,
                "crawl_job_id" uuid NOT NULL,
                "sid" character varying NOT NULL,
                "status" character varying NOT NULL,
                "records_fetched" integer NOT NULL DEFAULT '0',
                "error_message" text,
                "started_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "completed_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_survey_crawl_history" PRIMARY KEY ("id")
            )
        `);

        // Foreign keys
        await queryRunner.query(`ALTER TABLE "crawl_api_request_log" ADD CONSTRAINT "FK_crawl_api_request_log_crawl_job" FOREIGN KEY ("crawl_job_id") REFERENCES "crawl_job"("crawl_job_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "survey_crawl_history" ADD CONSTRAINT "FK_survey_crawl_history_survey_list_config" FOREIGN KEY ("survey_list_config_id") REFERENCES "survey_list_config"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "survey_crawl_history" ADD CONSTRAINT "FK_survey_crawl_history_crawl_job" FOREIGN KEY ("crawl_job_id") REFERENCES "crawl_job"("crawl_job_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_crawl_history" DROP CONSTRAINT "FK_survey_crawl_history_crawl_job"`);
        await queryRunner.query(`ALTER TABLE "survey_crawl_history" DROP CONSTRAINT "FK_survey_crawl_history_survey_list_config"`);
        await queryRunner.query(`ALTER TABLE "crawl_api_request_log" DROP CONSTRAINT "FK_crawl_api_request_log_crawl_job"`);
        
        await queryRunner.query(`DROP TABLE "survey_crawl_history"`);
        await queryRunner.query(`DROP TABLE "crawl_api_request_log"`);
        
        await queryRunner.query(`ALTER TABLE "crawl_staging_data" DROP CONSTRAINT "UQ_crawl_staging_data_key"`);
        await queryRunner.query(`ALTER TABLE "survey_list_config" DROP COLUMN "last_crawled_at"`);
        await queryRunner.query(`ALTER TABLE "crawl_staging_data" DROP COLUMN "key"`);
    }
}
