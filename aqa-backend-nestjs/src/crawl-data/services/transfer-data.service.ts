import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import { Client } from 'pg';

@Injectable()
export class TransferDataService {
  private readonly logger = new Logger(TransferDataService.name);

  constructor(
    @InjectRepository(CrawlStagingData)
    private readonly stagingRepo: Repository<CrawlStagingData>,
    private readonly configService: ConfigService,
  ) {}

  async transfer(
    crawlJobId: string,
    sourceConfig?: any,
  ): Promise<{ total: number; success: number; failed: number }> {
    const TABLES = [
      'semester',
      'faculty',
      'subject',
      'lecturer',
      'criteria',
      'class',
      'point',
      'comment',
    ];

    const TABLE_COLUMNS: Record<string, string[]> = {
      semester: ['semester_id', 'display_name', 'type', 'year', 'search_string'],
      faculty: ['faculty_id', 'display_name', 'full_name', 'is_displayed'],
      subject: ['subject_id', 'display_name', 'faculty_id'],
      lecturer: [
        'lecturer_id', 'display_name', 'mscb', 'faculty_id', 'username',
        'learning_position', 'birth_date', 'gender', 'learning', 'email',
        'phone', 'ngach', 'position',
      ],
      criteria: ['criteria_id', 'display_name', 'index', 'semester_id'],
      class: [
        'class_id', 'display_name', 'semester_id', 'program', 'class_type',
        'subject_id', 'lecturer_id', 'total_student', 'participating_student',
      ],
      point: ['point_id', 'max_point', 'point', 'criteria_id', 'class_id'],
      comment: ['comment_id', 'class_id', 'content', 'type'],
    };

    // Source DB config from parameters or env
    const source = sourceConfig || {
      host: this.configService.get<string>('TRANSFER_SOURCE_HOST', 'localhost'),
      port: parseInt(
        this.configService.get<string>('TRANSFER_SOURCE_PORT', '5432'),
      ),
      database: this.configService.get<string>(
        'TRANSFER_SOURCE_DATABASE',
        'aqa_survey',
      ),
      user: this.configService.get<string>(
        'TRANSFER_SOURCE_USER',
        'aqa_user',
      ),
      password: this.configService.get<string>(
        'TRANSFER_SOURCE_PASSWORD',
        'aqa_password',
      ),
    };

    const sourceClient = new Client(source);
    let totalRows = 0;
    let successRows = 0;
    let failedRows = 0;

    try {
      await sourceClient.connect();
      this.logger.log('Connected to source database');

      for (const tableName of TABLES) {
        try {
          // Check if source table exists
          const existsResult = await sourceClient.query(
            `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`,
            [tableName],
          );
          if (!existsResult.rows[0].exists) {
            this.logger.warn(`Table ${tableName} not found in source`);
            continue;
          }

          const columns = TABLE_COLUMNS[tableName];
          const sourceColumns = await this.getAvailableColumns(
            sourceClient,
            tableName,
          );
          const validColumns = columns.filter((col) =>
            sourceColumns.includes(col),
          );

          if (validColumns.length === 0) {
            this.logger.warn(`No valid columns for ${tableName}`);
            continue;
          }

          const columnList = validColumns.join(', ');
          const selectQuery = `SELECT ${columnList} FROM ${tableName} ORDER BY ${validColumns[0]}`;
          const sourceResult = await sourceClient.query(selectQuery);

          this.logger.log(
            `Table ${tableName}: ${sourceResult.rows.length} rows`,
          );

          // Store each row as staging data
          for (const row of sourceResult.rows) {
            try {
              await this.stagingRepo.save({
                crawl_job_id: crawlJobId,
                data_type: `transfer_${tableName}`,
                data: row,
              });
              successRows++;
            } catch (error: any) {
              failedRows++;
            }
            totalRows++;
          }
        } catch (error: any) {
          this.logger.error(
            `Error transferring ${tableName}: ${error.message}`,
          );
        }
      }

      return { total: totalRows, success: successRows, failed: failedRows };
    } catch (error: any) {
      this.logger.error(`Transfer error: ${error.message}`);
      throw error;
    } finally {
      await sourceClient.end();
    }
  }

  private async getAvailableColumns(
    client: Client,
    tableName: string,
  ): Promise<string[]> {
    const result = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
      [tableName],
    );
    return result.rows.map((row: any) => row.column_name);
  }
}
