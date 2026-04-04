import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CrawlJob } from '../entities/crawl-job.entity';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import { SurveyListConfig, SurveyListConfigInput } from '../entities/survey-list-config.entity';
import { CrawlJobType } from '../enums/crawl-job-type.enum';
import { CrawlJobStatus } from '../enums/crawl-job-status.enum';
import { CrawlStagingDataSummary } from '../dtos/crawl-staging-data-summary.dto';
import { CrawlSubjectSurveyService } from './crawl-subject-survey.service';
import { CrawlLecturerSurveyService } from './crawl-lecturer-survey.service';
import { CrawlStaffSurveyService } from './crawl-staff-survey.service';
import { AggregatePointsService } from './aggregate-points.service';
import { TransferDataService } from './transfer-data.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CrawlDataService implements OnModuleInit {
  private readonly logger = new Logger(CrawlDataService.name);

  constructor(
    @InjectRepository(CrawlJob)
    private readonly crawlJobRepo: Repository<CrawlJob>,
    @InjectRepository(CrawlStagingData)
    private readonly stagingRepo: Repository<CrawlStagingData>,
    @InjectRepository(SurveyListConfig)
    private readonly surveyListRepo: Repository<SurveyListConfig>,
    private readonly dataSource: DataSource,
    private readonly subjectSurveyService: CrawlSubjectSurveyService,
    private readonly lecturerSurveyService: CrawlLecturerSurveyService,
    private readonly staffSurveyService: CrawlStaffSurveyService,
    private readonly aggregatePointsService: AggregatePointsService,
    private readonly transferDataService: TransferDataService,
  ) {}

  async onModuleInit() {
    this.seedSurveyListConfigs();
  }

  private async seedSurveyListConfigs() {
    try {
      const count = await this.surveyListRepo.count();
      if (count > 0) return;

      this.logger.log('Seeding initial survey list configurations...');
      // ... same data ...
      const subjectSurveys = [
        {
          sid: '772945',
          title: 'Phiếu khảo sát về môn học - Học kỳ 1, năm 2025-2026',
          type: 'LT',
          year: '2025-2026',
          semester_type: 'HK1',
          semester_name: 'HK1, 2025-2026',
          survey_type: CrawlJobType.SUBJECT_SURVEY,
        },
        {
          sid: '337468',
          title: 'Phiếu khảo sát về môn học thực hành theo phương thức 1 - Học kỳ 1, năm học 2025-2026',
          type: 'HT1',
          year: '2025-2026',
          semester_type: 'HK1',
          semester_name: 'HK1, 2025-2026',
          survey_type: CrawlJobType.SUBJECT_SURVEY,
        },
        {
          sid: '984749',
          title: 'Phiếu khảo sát về môn học thực hành theo phương thức 2 - Học kỳ 1, năm học 2025-2026',
          type: 'HT2',
          year: '2025-2026',
          semester_type: 'HK1',
          semester_name: 'HK1, 2025-2026',
          survey_type: CrawlJobType.SUBJECT_SURVEY,
        },
      ];

      const lecturerSurveys = [
        { title: 'Phiếu khảo sát Cán bộ - Giảng viên - Nhân viên về trường ĐH Công nghệ Thông tin năm 2015', sid: '689698', type: 'CBGV', semester_type: 'HK2', year: '2015', semester_name: 'HK2, 2015', survey_type: CrawlJobType.LECTURER_SURVEY },
        { title: 'Phiếu khảo sát Cán bộ - Giảng viên - Nhân viên về trường ĐH Công nghệ Thông tin năm 2016', sid: '184988', type: 'CBGV', semester_type: 'HK2', year: '2016', semester_name: 'HK2, 2016', survey_type: CrawlJobType.LECTURER_SURVEY },
        { title: 'Phiếu khảo sát Cán bộ, Giảng viên, Nhân viên về điều kiện, môi trường làm việc năm 2017', sid: '771375', type: 'CBGV', semester_type: 'HK2', year: '2017', semester_name: 'HK2, 2017', survey_type: CrawlJobType.LECTURER_SURVEY },
        { title: 'Phiếu khảo sát Cán bộ, Giảng viên, Nhân viên về điều kiện, môi trường làm việc năm 2019', sid: '674594', type: 'CBGV', semester_type: 'HK2', year: '2019', semester_name: 'HK2, 2019', survey_type: CrawlJobType.LECTURER_SURVEY },
        { title: 'Phiếu khảo sát mức độ hài lòng của Cán bộ - Giảng viên - Nhân viên năm 2021', sid: '821342', type: 'CBGV', semester_type: 'HK2', year: '2021', semester_name: 'HK2, 2021', survey_type: CrawlJobType.LECTURER_SURVEY },
        { title: 'Phiếu khảo sát mức độ hài lòng của Viên chức - Người lao động năm 2023', sid: '219379', type: 'CBGV', semester_type: 'HK2', year: '2023', semester_name: 'HK2, 2023', survey_type: CrawlJobType.LECTURER_SURVEY },
        { title: 'Phiếu khảo sát mức độ hài lòng của Viên chức, Người lao động năm 2025', sid: '257993', type: 'CBGV', semester_type: 'HK2', year: '2025', semester_name: 'HK2, 2025', survey_type: CrawlJobType.LECTURER_SURVEY },
      ];

      const staffSurveys = [
        { sid: '257993', year: '2025', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '219379', year: '2023', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '821342', year: '2021', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '674594', year: '2019', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '771375', year: '2017', survey_type: CrawlJobType.STAFF_SURVEY },
      ];

      await this.surveyListRepo.save([...subjectSurveys, ...lecturerSurveys, ...staffSurveys]);
      this.logger.log('Seeded initial survey list configurations successfully.');
    } catch (error: any) {
      if (error.code === '42P01') {
        this.logger.warn('SurveyListConfig table not found yet, skipping seed for now.');
      } else {
        this.logger.error(`Error during seeding: ${error.message}`);
      }
    }
  }

  // ========================
  // Job Management
  // ========================

  async getCrawlJobs(type?: CrawlJobType): Promise<CrawlJob[]> {
    const query = this.crawlJobRepo
      .createQueryBuilder('j')
      .orderBy('j.created_at', 'DESC');

    if (type) {
      query.where('j.type = :type', { type });
    }

    return query.getMany();
  }

  async getCrawlJob(id: string): Promise<CrawlJob | null> {
    return this.crawlJobRepo.findOne({ where: { crawl_job_id: id } });
  }

  async getStagingDataSummary(
    jobId: string,
  ): Promise<CrawlStagingDataSummary> {
    const results = await this.stagingRepo
      .createQueryBuilder('s')
      .select('s.data_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('s.crawl_job_id = :jobId', { jobId })
      .groupBy('s.data_type')
      .getRawMany();

    const totalRecords = results.reduce(
      (sum, r) => sum + parseInt(r.count),
      0,
    );

    return {
      totalRecords,
      byType: results.map((r) => ({
        type: r.type,
        count: parseInt(r.count),
      })),
    };
  }

  // ========================
  // Run Crawl Jobs
  // ========================

  async runCrawl(
    type: CrawlJobType,
    parameters?: any,
    createdBy?: string,
  ): Promise<CrawlJob> {
    const jobId = uuidv4();
    const job = await this.crawlJobRepo.save({
      crawl_job_id: jobId,
      type,
      status: CrawlJobStatus.RUNNING,
      started_at: new Date(),
      parameters,
      created_by: createdBy,
    });

    // Run async - don't wait for completion
    this.executeCrawl(job).catch((error) => {
      this.logger.error(`Crawl job ${jobId} failed: ${error.message}`);
    });

    return job;
  }

  private async executeCrawl(job: CrawlJob): Promise<void> {
    try {
      let result: { total: number; success: number; failed: number };

      switch (job.type) {
        case CrawlJobType.SUBJECT_SURVEY:
          result = await this.subjectSurveyService.crawl(
            job.crawl_job_id,
            job.parameters?.semester,
          );
          break;
        case CrawlJobType.LECTURER_SURVEY:
          result = await this.lecturerSurveyService.crawl(
            job.crawl_job_id,
            job.parameters?.semester,
          );
          break;
        case CrawlJobType.STAFF_SURVEY:
          result = await this.staffSurveyService.crawl(
            job.crawl_job_id,
            job.parameters?.year,
          );
          break;
        case CrawlJobType.AGGREGATE_POINTS:
          result = await this.aggregatePointsService.aggregate(
            job.crawl_job_id,
          );
          break;
        case CrawlJobType.TRANSFER_DATA:
          result = await this.transferDataService.transfer(
            job.crawl_job_id,
            job.parameters?.sourceConfig,
          );
          break;
        default:
          throw new Error(`Unknown crawl job type: ${job.type}`);
      }

      const completedJob = await this.crawlJobRepo.findOne({
        where: { crawl_job_id: job.crawl_job_id },
      });
      completedJob.status = CrawlJobStatus.COMPLETED;
      completedJob.completed_at = new Date();
      completedJob.summary = result;
      await this.crawlJobRepo.save(completedJob);

      this.logger.log(
        `Crawl job ${job.crawl_job_id} completed: ${JSON.stringify(result)}`,
      );
    } catch (error: any) {
      const failedJob = await this.crawlJobRepo.findOne({
        where: { crawl_job_id: job.crawl_job_id },
      });
      if (failedJob) {
        failedJob.status = CrawlJobStatus.FAILED;
        failedJob.completed_at = new Date();
        failedJob.error_message = error.message;
        await this.crawlJobRepo.save(failedJob);
      }
      throw error;
    }
  }

  // ========================
  // Confirm / Abandon
  // ========================

  async confirmJob(jobId: string): Promise<CrawlJob> {
    const job = await this.crawlJobRepo.findOne({
      where: { crawl_job_id: jobId },
    });
    if (!job) throw new Error('Job not found');
    if (job.status !== CrawlJobStatus.COMPLETED) {
      throw new Error('Only completed jobs can be confirmed');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get all staging data for this job
      const stagingData = await this.stagingRepo.find({
        where: { crawl_job_id: jobId },
        order: { created_at: 'ASC' },
      });

      this.logger.log(
        `Confirming job ${jobId}: ${stagingData.length} staging records`,
      );

      // Process staging data based on job type
      switch (job.type) {
        case CrawlJobType.SUBJECT_SURVEY:
          await this.confirmSubjectSurvey(queryRunner, stagingData);
          break;
        case CrawlJobType.LECTURER_SURVEY:
          await this.confirmLecturerSurvey(queryRunner, stagingData);
          break;
        case CrawlJobType.STAFF_SURVEY:
          // Staff survey data is stored as JSON responses - confirm just updates status
          break;
        case CrawlJobType.AGGREGATE_POINTS:
          await this.confirmAggregatePoints(queryRunner, stagingData);
          break;
        case CrawlJobType.TRANSFER_DATA:
          await this.confirmTransferData(queryRunner, stagingData);
          break;
      }

      await queryRunner.commitTransaction();

      // Update job status
      await this.crawlJobRepo.update(jobId, {
        status: CrawlJobStatus.CONFIRMED,
      });

      // Clean up staging data
      await this.stagingRepo.delete({ crawl_job_id: jobId });

      return this.crawlJobRepo.findOne({ where: { crawl_job_id: jobId } });
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error confirming job ${jobId}: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async abandonJob(jobId: string): Promise<CrawlJob> {
    const job = await this.crawlJobRepo.findOne({
      where: { crawl_job_id: jobId },
    });
    if (!job) throw new Error('Job not found');
    if (
      job.status !== CrawlJobStatus.COMPLETED &&
      job.status !== CrawlJobStatus.FAILED
    ) {
      throw new Error('Only completed or failed jobs can be abandoned');
    }

    // Delete staging data
    await this.stagingRepo.delete({ crawl_job_id: jobId });

    // Update status
    await this.crawlJobRepo.update(jobId, {
      status: CrawlJobStatus.ABANDONED,
    });

    return this.crawlJobRepo.findOne({ where: { crawl_job_id: jobId } });
  }

  // ========================
  // Confirm Helpers
  // ========================

  private async confirmSubjectSurvey(
    queryRunner: any,
    stagingData: CrawlStagingData[],
  ): Promise<void> {
    const cache = new Map<string, string>();

    for (const item of stagingData) {
      const { data_type, data } = item;

      switch (data_type) {
        case 'semester': {
          const existing = await queryRunner.query(
            'SELECT semester_id FROM semester WHERE search_string = $1',
            [data.search_string],
          );
          if (existing.length === 0) {
            await queryRunner.query(
              'INSERT INTO semester (display_name, type, year, search_string) VALUES ($1, $2, $3, $4)',
              [data.display_name, data.type, data.year, data.search_string],
            );
          }
          break;
        }
        case 'faculty': {
          const cacheKey = `faculty:${data.display_name}`;
          if (!cache.has(cacheKey)) {
            const existing = await queryRunner.query(
              'SELECT faculty_id FROM faculty WHERE display_name = $1',
              [data.display_name],
            );
            if (existing.length === 0) {
              const result = await queryRunner.query(
                'INSERT INTO faculty (display_name, full_name, is_displayed) VALUES ($1, $2, $3) RETURNING faculty_id',
                [data.display_name, data.full_name, data.is_displayed],
              );
              cache.set(cacheKey, result[0].faculty_id);
            } else {
              cache.set(cacheKey, existing[0].faculty_id);
            }
          }
          break;
        }
        case 'subject': {
          const cacheKey = `subject:${data.display_name}`;
          if (!cache.has(cacheKey)) {
            const existing = await queryRunner.query(
              'SELECT subject_id FROM subject WHERE display_name = $1',
              [data.display_name],
            );
            if (existing.length === 0) {
              const facultyId = cache.get(`faculty:${data.faculty_name}`) || null;
              const result = await queryRunner.query(
                'INSERT INTO subject (display_name, faculty_id) VALUES ($1, $2) RETURNING subject_id',
                [data.display_name, facultyId],
              );
              cache.set(cacheKey, result[0].subject_id);
            } else {
              cache.set(cacheKey, existing[0].subject_id);
            }
          }
          break;
        }
        case 'lecturer': {
          const cacheKey = `lecturer:${data.display_name}`;
          if (!cache.has(cacheKey)) {
            const existing = await queryRunner.query(
              'SELECT lecturer_id FROM lecturer WHERE display_name = $1',
              [data.display_name],
            );
            if (existing.length === 0) {
              const result = await queryRunner.query(
                'INSERT INTO lecturer (display_name) VALUES ($1) RETURNING lecturer_id',
                [data.display_name],
              );
              cache.set(cacheKey, result[0].lecturer_id);
            } else {
              cache.set(cacheKey, existing[0].lecturer_id);
            }
          }
          break;
        }
        case 'criteria': {
          const cacheKey = `criteria:${data.display_name}`;
          if (!cache.has(cacheKey)) {
            const existing = await queryRunner.query(
              'SELECT criteria_id FROM criteria WHERE display_name = $1',
              [data.display_name],
            );
            if (existing.length === 0) {
              const result = await queryRunner.query(
                'INSERT INTO criteria (display_name, "index", semester_id) VALUES ($1, $2, $3) RETURNING criteria_id',
                [data.display_name, data.index, data.semester_id],
              );
              cache.set(cacheKey, result[0].criteria_id);
            } else {
              cache.set(cacheKey, existing[0].criteria_id);
            }
          }
          break;
        }
        case 'class': {
          const semesterRows = await queryRunner.query(
            'SELECT semester_id FROM semester WHERE display_name = $1',
            [data.semester_name],
          );
          const semesterId = semesterRows[0]?.semester_id || null;
          const subjectId =
            cache.get(`subject:${data.subject_name}`) || null;
          const lecturerId =
            cache.get(`lecturer:${data.lecturer_name}`) || null;

          const existing = await queryRunner.query(
            'SELECT class_id FROM class WHERE display_name = $1 AND semester_id = $2',
            [data.display_name, semesterId],
          );
          if (existing.length === 0) {
            const result = await queryRunner.query(
              `INSERT INTO class (display_name, semester_id, program, class_type, subject_id, lecturer_id, total_student, participating_student) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING class_id`,
              [
                data.display_name, semesterId, data.program, data.class_type,
                subjectId, lecturerId, data.total_student, data.participating_student,
              ],
            );
            cache.set(
              `class:${data.display_name}:${data.semester_name}`,
              result[0].class_id,
            );
          } else {
            cache.set(
              `class:${data.display_name}:${data.semester_name}`,
              existing[0].class_id,
            );
          }
          break;
        }
        case 'point_answer': {
          const criteriaId =
            cache.get(`criteria:${data.criteria_name}`) || null;
          const classId =
            cache.get(
              `class:${data.class_name}:${data.semester_name}`,
            ) || null;

          if (criteriaId && classId) {
            await queryRunner.query(
              `INSERT INTO point (max_point, criteria_id, class_id, point, point_id) 
               VALUES ($1, $2, $3, $4, uuid_generate_v4())`,
              [data.max_point, criteriaId, classId, data.point],
            );
          }
          break;
        }
        case 'comment': {
          const classIdForComment =
            cache.get(
              `class:${data.class_name}:${data.semester_name}`,
            ) || null;

          if (classIdForComment) {
            await queryRunner.query(
              'INSERT INTO comment (type, content, class_id) VALUES ($1, $2, $3)',
              [data.type, data.content, classIdForComment],
            );
          }
          break;
        }
      }
    }
  }

  private async confirmLecturerSurvey(
    queryRunner: any,
    stagingData: CrawlStagingData[],
  ): Promise<void> {
    const cache = new Map<string, string>();

    for (const item of stagingData) {
      const { data_type, data } = item;

      switch (data_type) {
        case 'staff_survey_batch': {
          const cacheKey = `batch:${data.display_name}`;
          if (!cache.has(cacheKey)) {
            const existing = await queryRunner.query(
              'SELECT staff_survey_batch_id FROM staff_survey_batch WHERE display_name = $1',
              [data.display_name],
            );
            if (existing.length === 0) {
              const result = await queryRunner.query(
                'INSERT INTO staff_survey_batch (staff_survey_batch_id, display_name, semester) VALUES (uuid_generate_v4(), $1, $2) RETURNING staff_survey_batch_id',
                [data.display_name, data.semester],
              );
              cache.set(cacheKey, result[0].staff_survey_batch_id);
            } else {
              cache.set(cacheKey, existing[0].staff_survey_batch_id);
            }
          }
          break;
        }
        case 'staff_survey_sheet': {
          const sheetId = uuidv4();
          await queryRunner.query(
            `INSERT INTO staff_survey_sheet (staff_survey_sheet_id, display_name) 
             VALUES ($1, $2)`,
            [sheetId, sheetId],
          );
          cache.set(`last_sheet`, sheetId);
          break;
        }
        case 'staff_survey_criteria': {
          const cacheKey = `criteria:${data.display_name}`;
          if (!cache.has(cacheKey)) {
            const existing = await queryRunner.query(
              'SELECT staff_survey_criteria_id FROM staff_survey_criteria WHERE display_name = $1',
              [data.display_name],
            );
            if (existing.length === 0) {
              const result = await queryRunner.query(
                'INSERT INTO staff_survey_criteria (staff_survey_criteria_id, display_name, category) VALUES (uuid_generate_v4(), $1, $2) RETURNING staff_survey_criteria_id',
                [data.display_name, data.category],
              );
              cache.set(cacheKey, result[0].staff_survey_criteria_id);
            } else {
              cache.set(cacheKey, existing[0].staff_survey_criteria_id);
            }
          }
          break;
        }
        case 'staff_survey_point': {
          const criteriaId =
            cache.get(`criteria:${data.criteria_name}`) || null;
          const sheetId = cache.get('last_sheet') || null;
          if (criteriaId && sheetId) {
            await queryRunner.query(
              `INSERT INTO staff_survey_point (staff_survey_point_id, max_point, point, comment, staff_survey_criteria_id, staff_survey_sheet_id) 
               VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)`,
              [data.max_point, data.point, data.comment, criteriaId, sheetId],
            );
          }
          break;
        }
      }
    }
  }

  private async confirmAggregatePoints(
    queryRunner: any,
    stagingData: CrawlStagingData[],
  ): Promise<void> {
    for (const item of stagingData) {
      if (item.data_type !== 'aggregated_point') continue;
      const { criteria_id, class_id, max_point, avg_point, answer_count } =
        item.data;

      await queryRunner.query(
        `INSERT INTO point (max_point, criteria_id, class_id, point) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (criteria_id, class_id) 
         DO UPDATE SET max_point = EXCLUDED.max_point, point = EXCLUDED.point, created_at = CURRENT_TIMESTAMP`,
        [max_point, criteria_id, class_id, avg_point],
      );

      await queryRunner.query(
        'UPDATE class SET participating_student = $1 WHERE class_id = $2',
        [answer_count, class_id],
      );
    }
  }

  private async confirmTransferData(
    queryRunner: any,
    stagingData: CrawlStagingData[],
  ): Promise<void> {
    // Group by table type
    const byTable = new Map<string, any[]>();
    for (const item of stagingData) {
      const tableName = item.data_type.replace('transfer_', '');
      if (!byTable.has(tableName)) byTable.set(tableName, []);
      byTable.get(tableName).push(item.data);
    }

    const tableOrder = [
      'semester', 'faculty', 'subject', 'lecturer',
      'criteria', 'class', 'point', 'comment',
    ];

    for (const tableName of tableOrder) {
      const rows = byTable.get(tableName);
      if (!rows || rows.length === 0) continue;

      this.logger.log(
        `Confirming transfer for ${tableName}: ${rows.length} rows`,
      );

      for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames = columns.join(', ');

        try {
          await queryRunner.query(
            `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
            values,
          );
        } catch (error: any) {
          this.logger.warn(
            `Error inserting into ${tableName}: ${error.message}`,
          );
        }
      }
    }
  }

  // ========================
  // Survey List Config Management
  // ========================

  async getSurveyListConfigs(
    type?: CrawlJobType,
  ): Promise<SurveyListConfig[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .orderBy('s.created_at', 'DESC');

    if (type) {
      query.where('s.survey_type = :type', { type });
    }

    return query.getMany();
  }

  async addSurveyListConfig(
    input: SurveyListConfigInput,
  ): Promise<SurveyListConfig> {
    return this.surveyListRepo.save(input);
  }

  async updateSurveyListConfig(
    id: string,
    input: Partial<SurveyListConfigInput>,
  ): Promise<SurveyListConfig> {
    await this.surveyListRepo.update(id, input);
    return this.surveyListRepo.findOne({ where: { id } });
  }

  async deleteSurveyListConfig(id: string): Promise<boolean> {
    const result = await this.surveyListRepo.delete(id);
    return result.affected > 0;
  }
}
