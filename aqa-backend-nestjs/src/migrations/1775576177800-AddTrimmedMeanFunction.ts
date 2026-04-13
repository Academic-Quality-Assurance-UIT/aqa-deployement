import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrimmedMeanFunction1775576177800
  implements MigrationInterface
{
  name = 'AddTrimmedMeanFunction1775576177800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create the state transition function for the aggregate
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION trimmed_mean_5_sfunc(double precision[], double precision)
      RETURNS double precision[] AS $$
      BEGIN
          RETURN array_append($1, $2);
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 2. Create the final function to sort, trim, and average
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION trimmed_mean_5_finalfunc(double precision[])
      RETURNS double precision AS $$
      DECLARE
          arr alias for $1;
          len int;
          trim_count int;
      BEGIN
          len := array_length(arr, 1);
          IF len IS NULL OR len = 0 THEN RETURN NULL; END IF;
          
          -- Trim 2.5% from each end (total 5%)
          trim_count := floor(len * 0.025);
          
          RETURN (
              SELECT AVG(v)
              FROM (
                  SELECT v FROM unnest(arr) v
                  ORDER BY v
                  OFFSET trim_count
                  LIMIT (len - 2 * trim_count)
              ) sub
          );
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 3. Create the aggregate function
    // We drop first to ensure clean creation if it partially exists
    await queryRunner.query(`
      DROP AGGREGATE IF EXISTS trimmed_mean_5(double precision);
      CREATE AGGREGATE trimmed_mean_5(double precision) (
          SFUNC = trimmed_mean_5_sfunc,
          STYPE = double precision[],
          FINALFUNC = trimmed_mean_5_finalfunc,
          INITCOND = '{}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP AGGREGATE IF EXISTS trimmed_mean_5(double precision);`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS trimmed_mean_5_finalfunc(double precision[]);`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS trimmed_mean_5_sfunc(double precision[], double precision);`);
  }
}
