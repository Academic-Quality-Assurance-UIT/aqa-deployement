import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';

@Injectable()
export class AggregatePointsService {
  private readonly logger = new Logger(AggregatePointsService.name);

  constructor(
    @InjectRepository(CrawlStagingData)
    private readonly stagingRepo: Repository<CrawlStagingData>,
    private readonly dataSource: DataSource,
  ) {}

  async aggregate(
    crawlJobId: string,
  ): Promise<{ total: number; success: number; failed: number }> {
    this.logger.log('Starting point aggregation...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Check if point_answer table exists and has data
      const totalPointAnswers = await queryRunner.query(
        'SELECT COUNT(*) as count FROM point_answer',
      );
      const count = parseInt(totalPointAnswers[0].count);
      this.logger.log(`Total point_answer records: ${count}`);

      if (count === 0) {
        return { total: 0, success: 0, failed: 0 };
      }

      // Get aggregated data
      const aggregatedData = await queryRunner.query(`
        SELECT 
          criteria_id,
          class_id,
          4 as max_point,
          AVG(point::FLOAT) as avg_point,
          COUNT(*) as answer_count
        FROM point_answer 
        GROUP BY criteria_id, class_id
        ORDER BY class_id, criteria_id
      `);

      this.logger.log(
        `Found ${aggregatedData.length} unique criteria-class combinations`,
      );

      // Store aggregated results in staging
      let successCount = 0;
      let failedCount = 0;

      for (const row of aggregatedData) {
        try {
          await this.stagingRepo.save({
            crawl_job_id: crawlJobId,
            data_type: 'aggregated_point',
            data: {
              criteria_id: row.criteria_id,
              class_id: row.class_id,
              max_point: row.max_point,
              avg_point: parseFloat(row.avg_point),
              answer_count: parseInt(row.answer_count),
            },
          });
          successCount++;
        } catch (error: any) {
          failedCount++;
          this.logger.error(`Error staging aggregated point: ${error.message}`);
        }
      }

      return {
        total: aggregatedData.length,
        success: successCount,
        failed: failedCount,
      };
    } catch (error: any) {
      this.logger.error(`Error during aggregation: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
