import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CrawlJob } from '../entities/crawl-job.entity';
import { CrawlJobLog } from '../entities/crawl-job-log.entity';
import { CrawlApiRequestLog } from '../entities/crawl-api-request-log.entity';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import {
  SurveyListConfig,
  SurveyListConfigInput,
} from '../entities/survey-list-config.entity';
import { parseSafeDate } from '../../common/utils/date';
import { CrawlJobType } from '../enums/crawl-job-type.enum';
import { CrawlJobStatus } from '../enums/crawl-job-status.enum';
import { CrawlStagingDataSummary } from '../dtos/crawl-staging-data-summary.dto';
import { CrawlSubjectSurveyService } from './crawl-subject-survey.service';
import { CrawlLecturerSurveyService } from './crawl-lecturer-survey.service';
import { CrawlStaffSurveyService } from './crawl-staff-survey.service';
import { AggregatePointsService } from './aggregate-points.service';
import { TransferDataService } from './transfer-data.service';
import { SurveyApiClient } from './survey-api-client';
import { SurveyCrawlHistory } from '../entities/survey-crawl-history.entity';
import { Student } from '../../student/entities/student.entity';
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
    @InjectRepository(CrawlJobLog)
    private readonly crawlJobLogRepo: Repository<CrawlJobLog>,
    @InjectRepository(CrawlApiRequestLog)
    private readonly apiRequestLogRepo: Repository<CrawlApiRequestLog>,
    private readonly apiClient: SurveyApiClient,
    @InjectRepository(SurveyCrawlHistory)
    private readonly surveyCrawlHistoryRepo: Repository<SurveyCrawlHistory>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async onModuleInit() {
    await this.seedSurveyListConfigs();
    await this.recoverOrphanedJobs();
    this.startJobMonitor();
  }

  private async recoverOrphanedJobs() {
    this.logger.log('Checking for orphaned crawl jobs...');
    const orphanedJobs = await this.crawlJobRepo.find({
      where: { status: CrawlJobStatus.RUNNING },
    });

    if (orphanedJobs.length > 0) {
      this.logger.warn(
        `Found ${orphanedJobs.length} orphaned jobs. Marking as FAILED.`,
      );
      for (const job of orphanedJobs) {
        job.status = CrawlJobStatus.FAILED;
        job.completed_at = new Date();
        job.error_message = 'Server restarted or process interrupted.';
        await this.crawlJobRepo.save(job);
      }
    }
  }

  private startJobMonitor() {
    setInterval(async () => {
      try {
        await this.checkTimeouts();
      } catch (error) {
        this.logger.error('Error in job monitor:', error);
      }
    }, 5000); // Check every 5 seconds
  }

  private async checkTimeouts() {
    const timeoutMs = 15000; // 15 seconds (slightly more than 10s to be safe)
    const now = new Date();

    const runningJobs = await this.crawlJobRepo.find({
      where: { status: CrawlJobStatus.RUNNING },
    });

    for (const job of runningJobs) {
      const lastActivity =
        job.last_activity_at || job.started_at || job.created_at;
      if (now.getTime() - lastActivity.getTime() > timeoutMs) {
        this.logger.warn(
          `Job ${job.crawl_job_id} timed out (no activity for >10s). Marking as FAILED.`,
        );
        job.status = CrawlJobStatus.FAILED;
        job.completed_at = now;
        job.error_message =
          'Job timed out: No activity detected for more than 10 seconds.';
        await this.crawlJobRepo.save(job);
      }
    }
  }

  async updateJobProgress(jobId: string, progress: number, total?: number) {
    const updateData: any = {
      progress,
      last_activity_at: new Date(),
    };
    if (total !== undefined) {
      updateData.total_data = total;
    }
    await this.crawlJobRepo.update(jobId, updateData);
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
          title:
            'Phiếu khảo sát về môn học thực hành theo phương thức 1 - Học kỳ 1, năm học 2025-2026',
          type: 'HT1',
          year: '2025-2026',
          semester_type: 'HK1',
          semester_name: 'HK1, 2025-2026',
          survey_type: CrawlJobType.SUBJECT_SURVEY,
        },
        {
          sid: '984749',
          title:
            'Phiếu khảo sát về môn học thực hành theo phương thức 2 - Học kỳ 1, năm học 2025-2026',
          type: 'HT2',
          year: '2025-2026',
          semester_type: 'HK1',
          semester_name: 'HK1, 2025-2026',
          survey_type: CrawlJobType.SUBJECT_SURVEY,
        },
      ];

      const lecturerSurveys = [
        {
          title:
            'Phiếu khảo sát Cán bộ - Giảng viên - Nhân viên về trường ĐH Công nghệ Thông tin năm 2015',
          sid: '689698',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2015',
          semester_name: 'HK2, 2015',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
        {
          title:
            'Phiếu khảo sát Cán bộ - Giảng viên - Nhân viên về trường ĐH Công nghệ Thông tin năm 2016',
          sid: '184988',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2016',
          semester_name: 'HK2, 2016',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
        {
          title:
            'Phiếu khảo sát Cán bộ, Giảng viên, Nhân viên về điều kiện, môi trường làm việc năm 2017',
          sid: '771375',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2017',
          semester_name: 'HK2, 2017',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
        {
          title:
            'Phiếu khảo sát Cán bộ, Giảng viên, Nhân viên về điều kiện, môi trường làm việc năm 2019',
          sid: '674594',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2019',
          semester_name: 'HK2, 2019',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
        {
          title:
            'Phiếu khảo sát mức độ hài lòng của Cán bộ - Giảng viên - Nhân viên năm 2021',
          sid: '821342',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2021',
          semester_name: 'HK2, 2021',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
        {
          title:
            'Phiếu khảo sát mức độ hài lòng của Viên chức - Người lao động năm 2023',
          sid: '219379',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2023',
          semester_name: 'HK2, 2023',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
        {
          title:
            'Phiếu khảo sát mức độ hài lòng của Viên chức, Người lao động năm 2025',
          sid: '257993',
          type: 'CBGV',
          semester_type: 'HK2',
          year: '2025',
          semester_name: 'HK2, 2025',
          survey_type: CrawlJobType.LECTURER_SURVEY,
        },
      ];

      const staffSurveys = [
        { sid: '257993', year: '2025', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '219379', year: '2023', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '821342', year: '2021', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '674594', year: '2019', survey_type: CrawlJobType.STAFF_SURVEY },
        { sid: '771375', year: '2017', survey_type: CrawlJobType.STAFF_SURVEY },
      ];

      await this.surveyListRepo.save([
        ...subjectSurveys,
        ...lecturerSurveys,
        ...staffSurveys,
      ]);
      this.logger.log(
        'Seeded initial survey list configurations successfully.',
      );
    } catch (error: any) {
      if (error.code === '42P01') {
        this.logger.warn(
          'SurveyListConfig table not found yet, skipping seed for now.',
        );
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

  async getCrawlJobLogs(
    jobId: string,
    limit = 50,
    offset = 0,
  ): Promise<CrawlJobLog[]> {
    return this.crawlJobLogRepo.find({
      where: { crawl_job_id: jobId },
      order: { timestamp: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getCrawlApiRequestLogs(
    jobId: string,
    limit = 50,
    offset = 0,
  ): Promise<CrawlApiRequestLog[]> {
    return this.apiRequestLogRepo.find({
      where: { crawl_job_id: jobId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getCrawlApiRequestLog(id: string): Promise<CrawlApiRequestLog | null> {
    return this.apiRequestLogRepo.findOne({ where: { id } });
  }

  async getSurveyCrawlHistory(
    jobId?: string,
    surveyConfigId?: string,
    limit = 50,
    offset = 0,
  ): Promise<SurveyCrawlHistory[]> {
    const where: any = {};
    if (jobId) where.crawl_job_id = jobId;
    if (surveyConfigId) where.survey_list_config_id = surveyConfigId;

    return this.surveyCrawlHistoryRepo.find({
      where,
      order: { started_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getExternalSurveys(
    keyword?: string,
    page = 1,
    limit = 20,
    order = 'startdate',
    direction = 'DESC'
  ): Promise<any> {
    return this.apiClient.getExternalSurveys({ keyword, page, limit, order, direction });
  }

  async getStagingDataSummary(jobId: string): Promise<CrawlStagingDataSummary> {
    const results = await this.stagingRepo
      .createQueryBuilder('s')
      .select('s.data_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('s.crawl_job_id = :jobId', { jobId })
      .groupBy('s.data_type')
      .getRawMany();

    const totalRecords = results.reduce((sum, r) => sum + parseInt(r.count), 0);

    return {
      totalRecords,
      byType: results.map((r) => ({
        type: r.type,
        count: parseInt(r.count),
      })),
    };
  }

  async getCrawlStagingData(
    jobId: string,
    limit: number,
    offset: number,
    dataType?: string,
  ): Promise<CrawlStagingData[]> {
    const where: any = { crawl_job_id: jobId };
    if (dataType) where.data_type = dataType;

    return this.stagingRepo.find({
      where,
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
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
      last_activity_at: new Date(),
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
            job.parameters?.surveyConfigIds,
          );
          break;
        case CrawlJobType.LECTURER_SURVEY:
          result = await this.lecturerSurveyService.crawl(
            job.crawl_job_id,
            job.parameters?.semester,
            job.parameters?.surveyConfigIds,
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

    await this.crawlJobRepo.update(jobId, { status: CrawlJobStatus.ABANDONED });
    return this.crawlJobRepo.findOne({ where: { crawl_job_id: jobId } });
  }

  async stopJob(jobId: string): Promise<CrawlJob> {
    const job = await this.crawlJobRepo.findOne({
      where: { crawl_job_id: jobId },
    });
    if (!job) throw new Error('Job not found');
    if (job.status !== CrawlJobStatus.RUNNING) {
      throw new Error('Only running jobs can be stopped');
    }

    await this.crawlJobRepo.update(jobId, {
      status: CrawlJobStatus.ABANDONED,
      completed_at: new Date(),
    });
    return this.crawlJobRepo.findOne({ where: { crawl_job_id: jobId } });
  }

  async isJobRunning(jobId: string): Promise<boolean> {
    const job = await this.crawlJobRepo.findOne({
      where: { crawl_job_id: jobId },
      select: ['status'],
    });
    return job?.status === CrawlJobStatus.RUNNING;
  }

  // ========================
  // Confirm Helpers
  // ========================

  private async confirmSubjectSurvey(
    queryRunner: any,
    stagingData: CrawlStagingData[],
  ): Promise<void> {
    const cache = new Map<string, string>();
    const pointAverages = new Map<
      string,
      {
        sum: number;
        count: number;
        max_point: number;
        criteria_id: string;
        class_id: string;
      }
    >();

    // 1. First Pass: Ensure semesters exist and identify them for truncation
    const semesterNamesInJob = [
      ...new Set(
        stagingData
          .filter((d) => d.data_type === 'semester')
          .map((d) => d.data.display_name),
      ),
    ];

    for (const semesterName of semesterNamesInJob) {
      const semData = stagingData.find(
        (d) => d.data_type === 'semester' && d.data.display_name === semesterName,
      )?.data;
      if (!semData) continue;

      const existing = await queryRunner.query(
        'SELECT semester_id FROM semester WHERE display_name = $1',
        [semData.display_name],
      );
      if (existing.length === 0) {
        await queryRunner.query(
          'INSERT INTO semester (display_name, type, year, search_string) VALUES ($1, $2, $3, $4)',
          [semData.display_name, semData.type, semData.year, semData.search_string],
        );
      }
    }

    // 2. Perform Truncation for identified semesters
    for (const semesterName of semesterNamesInJob) {
      const semesterRows = await queryRunner.query(
        'SELECT semester_id FROM semester WHERE display_name = $1',
        [semesterName],
      );
      if (semesterRows.length > 0) {
        const semesterId = semesterRows[0].semester_id;
        this.logger.log(
          `Truncating data for semester: ${semesterName} (${semesterId})`,
        );
        await queryRunner.query(
          'DELETE FROM point WHERE class_id IN (SELECT class_id FROM class WHERE semester_id = $1)',
          [semesterId],
        );
        await queryRunner.query(
          'DELETE FROM comment WHERE class_id IN (SELECT class_id FROM class WHERE semester_id = $1)',
          [semesterId],
        );
        await queryRunner.query('DELETE FROM class WHERE semester_id = $1', [
          semesterId,
        ]);
      }
    }

    // 3. Second Pass: Process all staging data sorted by constraints
    const typeOrder: Record<string, number> = {
      semester: 1,
      faculty: 2,
      subject: 3,
      lecturer: 4,
      criteria: 5,
      student: 6,
      class: 7,
      point_answer: 8,
      comment: 9,
    };
    const sortedStagingData = [...stagingData].sort(
      (a, b) => (typeOrder[a.data_type] || 99) - (typeOrder[b.data_type] || 99),
    );

    for (const item of sortedStagingData) {
      const { data_type, data } = item;

      switch (data_type) {
        case 'semester':
          // Already handled in first pass
          break;
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
        case 'student': {
          const studentData = data;

          await queryRunner.query(
            `INSERT INTO student (
              tid, sid, firstname, lastname, email, token, completed_at, usesleft, 
              mssv, khoa, k, hedt, malop, magv, tengv, tenmh, khoaql, nganh, tennganh, semester_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (email) DO UPDATE SET 
              tid = EXCLUDED.tid,
              sid = EXCLUDED.sid,
              firstname = EXCLUDED.firstname,
              lastname = EXCLUDED.lastname,
              token = EXCLUDED.token,
              completed_at = EXCLUDED.completed_at,
              usesleft = EXCLUDED.usesleft,
              mssv = EXCLUDED.mssv,
              khoa = EXCLUDED.khoa,
              k = EXCLUDED.k,
              hedt = EXCLUDED.hedt,
              malop = EXCLUDED.malop,
              magv = EXCLUDED.magv,
              tengv = EXCLUDED.tengv,
              tenmh = EXCLUDED.tenmh,
              khoaql = EXCLUDED.khoaql,
              nganh = EXCLUDED.nganh,
              tennganh = EXCLUDED.tennganh,
              semester_name = EXCLUDED.semester_name`,
            [
              studentData.tid,
              studentData.sid,
              studentData.firstname,
              studentData.lastname,
              studentData.email,
              studentData.token,
              (() => {
                const val = studentData.completed_at;
                if (!val || val === 'N') return null;
                try {
                  const d = new Date(val);
                  if (isNaN(d.getTime()) || d.getFullYear() < 1000) return null;
                  return d;
                } catch (e) {
                  return null;
                }
              })(),
              studentData.usesleft,
              studentData.mssv,
              studentData.khoa,
              studentData.k,
              studentData.hedt,
              studentData.malop,
              studentData.magv,
              studentData.tengv,
              studentData.tenmh,
              studentData.khoaql,
              studentData.nganh,
              studentData.tennganh,
              studentData.semester_name,
            ],
          );
          break;
        }
        case 'class': {
          const semesterRows = await queryRunner.query(
            'SELECT semester_id FROM semester WHERE display_name = $1',
            [data.semester_name],
          );
          const semesterId = semesterRows[0]?.semester_id || null;
          let subjectId = cache.get(`subject:${data.subject_name}`) || null;
          if (!subjectId) {
            const subjName = data.subject_name || 'Khác';
            const existingSubj = await queryRunner.query(
              'SELECT subject_id FROM subject WHERE display_name = $1',
              [subjName],
            );
            if (existingSubj.length === 0) {
              const res = await queryRunner.query(
                'INSERT INTO subject (display_name) VALUES ($1) RETURNING subject_id',
                [subjName],
              );
              subjectId = res[0].subject_id;
            } else {
              subjectId = existingSubj[0].subject_id;
            }
            cache.set(`subject:${subjName}`, subjectId);
          }

          let lecturerId = cache.get(`lecturer:${data.lecturer_name}`) || null;
          if (!lecturerId) {
            const lecName = data.lecturer_name || 'Khác';
            const existingLec = await queryRunner.query(
              'SELECT lecturer_id FROM lecturer WHERE display_name = $1',
              [lecName],
            );
            if (existingLec.length === 0) {
              const res = await queryRunner.query(
                'INSERT INTO lecturer (display_name) VALUES ($1) RETURNING lecturer_id',
                [lecName],
              );
              lecturerId = res[0].lecturer_id;
            } else {
              lecturerId = existingLec[0].lecturer_id;
            }
            cache.set(`lecturer:${lecName}`, lecturerId);
          }


          const existing = await queryRunner.query(
            'SELECT class_id FROM class WHERE display_name = $1 AND semester_id = $2',
            [data.display_name, semesterId],
          );
          if (existing.length === 0) {
            const result = await queryRunner.query(
              `INSERT INTO class (display_name, semester_id, program, class_type, subject_id, lecturer_id, total_student, participating_student) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING class_id`,
              [
                data.display_name,
                semesterId,
                data.program,
                data.class_type,
                subjectId,
                lecturerId,
                data.total_student,
                data.participating_student,
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
          const criteriaId = cache.get(`criteria:${data.criteria_name}`) || null;
          const classId =
            cache.get(`class:${data.class_name}:${data.semester_name}`) || null;

          if (criteriaId && classId) {
            const key = `${criteriaId}:${classId}`;
            const existingAvg = pointAverages.get(key);
            if (existingAvg) {
              existingAvg.sum += data.point;
              existingAvg.count += 1;
            } else {
              pointAverages.set(key, {
                sum: data.point,
                count: 1,
                max_point: data.max_point,
                criteria_id: criteriaId,
                class_id: classId,
              });
            }
          }
          break;
        }
        case 'comment': {
          const classIdForComment =
            cache.get(`class:${data.class_name}:${data.semester_name}`) || null;

          if (classIdForComment) {
            await queryRunner.query(
              'INSERT INTO comment (comment_id, type, content, class_id, type_list, topic) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)',
              [
                data.type,
                data.content,
                classIdForComment,
                [data.type],
                'others',
              ],
            );
          }
          break;
        }
      }
    }

    // 4. Insert Aggregated Points
    for (const avg of pointAverages.values()) {
      const avgPoint = avg.sum / avg.count;
      await queryRunner.query(
        `INSERT INTO point (max_point, criteria_id, class_id, point, point_id) 
         VALUES ($1, $2, $3, $4, uuid_generate_v4())`,
        [avg.max_point, avg.criteria_id, avg.class_id, avgPoint],
      );
    }

    // 5. Finalize Aggregate Student Counts
    const jobSemesterSearchStrings = [
      ...new Set(
        stagingData
          .filter((d) => d.data_type === 'semester')
          .map((d) => d.data.search_string),
      ),
    ];

    for (const searchString of jobSemesterSearchStrings) {
      const stats = await queryRunner.query(
        `SELECT 
          malop, 
          COUNT(*) as total_count,
          COUNT(completed_at) as participating_count
        FROM student 
        WHERE semester_name = (SELECT display_name FROM semester WHERE search_string = $1)
        GROUP BY malop`,
        [searchString],
      );

      for (const row of stats) {
        await queryRunner.query(
          `UPDATE class 
           SET total_student = $1, 
               participating_student = $2 
           WHERE display_name = $3 AND semester_id = (SELECT semester_id FROM semester WHERE search_string = $4)`,
          [
            parseInt(row.total_count),
            parseInt(row.participating_count),
            row.malop,
            searchString,
          ],
        );
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
      'semester',
      'faculty',
      'subject',
      'lecturer',
      'criteria',
      'class',
      'point',
      'comment',
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

  async getSurveyListConfigs(type?: CrawlJobType): Promise<SurveyListConfig[]> {
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
