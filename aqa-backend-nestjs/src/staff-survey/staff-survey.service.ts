import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { StaffSurveySheetDTO } from './dtos/staff-survey-sheet.dto';
import { StaffSurveyBatch } from './entities/staff-survey-batch.entity';
import { StaffSurveyCriteria } from './entities/staff-survey-criteria.entity';
import { StaffSurveyPoint } from './entities/staff-survey-point.entity';
import { StaffSurveySheet } from './entities/staff-survey-sheet.entity';
import { PaginationArgs } from 'src/common/args/pagination.arg';
import { StaffSurveyAdditionalCommentDTO } from './dtos/staff-survey-additional-comment.dto';

@Injectable()
export class StaffSurveyService {
  constructor(
    @InjectRepository(StaffSurveySheet)
    private repo: Repository<StaffSurveySheet>,
    @InjectRepository(StaffSurveyBatch)
    private staffSurveyBatchRepo: Repository<StaffSurveyBatch>,
    @InjectRepository(StaffSurveyCriteria)
    private staffSurveyCriteriaRepo: Repository<StaffSurveyCriteria>,
    @InjectRepository(StaffSurveyPoint)
    private staffSurveyPointRepo: Repository<StaffSurveyPoint>,
  ) {}

  async create(inputData: StaffSurveySheetDTO) {
    const { survey_name: surveyName, points, ...data } = inputData;

    const batch = await this.getBatch(surveyName, inputData.semester);

    const surveySheet = (
      await this.repo.insert({
        ...data,
        batch: {
          staff_survey_batch_id: batch.staff_survey_batch_id,
        },
      })
    ).identifiers[0] as StaffSurveySheet;

    await Promise.all(
      points.map(async (_point) => {
        const point = { ..._point };
        const criteria = await this.getCriteria({
          ...point,
          semester: inputData.semester,
        });

        return await this.staffSurveyPointRepo.insert({
          ...point,
          sheet: {
            staff_survey_sheet_id: surveySheet.staff_survey_sheet_id,
          },
          criteria,
        });
      }),
    );

    return surveySheet;
  }

  async getCriteriaList() {
    return await this.staffSurveyCriteriaRepo.find({});
  }

  async getBatchList() {
    return await this.staffSurveyBatchRepo.find({});
  }

  async getSemesterList(): Promise<string[]> {
    const result = await this.staffSurveyBatchRepo
      .createQueryBuilder('batch')
      .select('DISTINCT batch.display_name', 'semester')
      .where('batch.display_name IS NOT NULL')
      .orderBy('batch.display_name', 'DESC')
      .getRawMany();
    return result.map((r) => r.semester);
  }

  async getPointsByCategory(semester?: string, showUnit?: boolean) {
    const params: any[] = [];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let selectField = 'criteria.category';
    let groupByField = 'criteria.category';
    let unitCondition = "AND criteria.category != 'ĐƠN VỊ'";
    const isUnitField = "criteria.category = 'ĐƠN VỊ'";

    if (showUnit) {
      unitCondition = '';
      selectField = `CASE WHEN criteria.category = 'ĐƠN VỊ' THEN COALESCE(cm.display_name, criteria.display_name) ELSE criteria.category END`;
      groupByField = `CASE WHEN criteria.category = 'ĐƠN VỊ' THEN COALESCE(cm.display_name, criteria.display_name) ELSE criteria.category END`;
    }

    return await this.staffSurveyPointRepo.query(
      `
      SELECT
        ${selectField} AS category,
        AVG(point.point) AS avg_point,
        (${isUnitField}) AS is_unit
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      LEFT JOIN criteria_mapping AS cm
        ON criteria.mapping_id = cm.id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.is_shown = true ${unitCondition} ${semesterCondition}
      GROUP BY ${groupByField}, (${isUnitField})
    `,
      params,
    );
  }

  async getPointsByCategoryDonVi(semester?: string) {
    const params: any[] = [];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    return await this.staffSurveyPointRepo.query(
      `
      SELECT
        COALESCE(cm.display_name, criteria.display_name) AS category,
        AVG(point.point) AS avg_point
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      LEFT JOIN criteria_mapping AS cm
        ON criteria.mapping_id = cm.id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.category = 'ĐƠN VỊ' AND criteria.is_shown = true ${semesterCondition}
      GROUP BY COALESCE(cm.display_name, criteria.display_name), criteria.index
      ORDER BY criteria.index
    `,
      params,
    );
  }

  async getPointsByCriteria(
    category: string,
    semester?: string,
    displayName?: string,
  ) {
    const params: any[] = [category];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let displayNameCondition = '';
    if (displayName) {
      params.push(displayName);
      displayNameCondition = `AND criteria.display_name = $${params.length}`;
    }

    return await this.staffSurveyPointRepo.query(
      `
      SELECT
        COALESCE(cm.display_name, criteria.display_name) AS criteria,
        criteria.index AS index,
        AVG(point.point) AS avg_point
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      LEFT JOIN criteria_mapping AS cm
        ON criteria.mapping_id = cm.id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.category = $1 AND criteria.is_shown = true ${semesterCondition} ${displayNameCondition}
      GROUP BY COALESCE(cm.display_name, criteria.display_name), criteria.index
      ORDER BY criteria.index
    `,
      params,
    );
  }

  async getStaffSurveyPointsByYear() {
    return await this.staffSurveyPointRepo.query(
      `
      SELECT
        batch.display_name AS year,
        AVG(point.point) AS avg_point
      FROM staff_survey_point AS point
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      WHERE criteria.is_shown = true
      GROUP BY batch.display_name
      ORDER BY batch.display_name DESC
    `,
    );
  }

  async getStaffSurveyPointsByCategoryAndYear() {
    return await this.staffSurveyPointRepo.query(
      `
      SELECT
        criteria.category AS category,
        batch.display_name AS year,
        AVG(point.point) AS avg_point
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.category != 'ĐƠN VỊ' AND criteria.is_shown = true
      GROUP BY criteria.category, batch.display_name
      ORDER BY batch.display_name DESC, criteria.category
    `,
    );
  }

  async getPointWithCommentByCriteria(
    category: string,
    pagination: PaginationArgs,
    semester?: string,
    displayName?: string,
  ) {
    const params: any[] = [category];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let displayNameCondition = '';
    if (displayName) {
      params.push(displayName);
      displayNameCondition = `AND criteria.display_name = $${params.length}`;
    }

    const limitParamIndex = params.length + 1;
    const offsetParamIndex = params.length + 2;
    params.push(pagination.size, pagination.page * pagination.size);

    const data = await this.staffSurveyPointRepo.query(
      `
      SELECT
        COALESCE(cm.display_name, criteria.display_name) AS criteria,
        criteria.index AS index,
        point.point,
        point.comment,
        point.topic,
        point.sentiment
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      LEFT JOIN criteria_mapping AS cm
        ON criteria.mapping_id = cm.id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.category = $1 AND criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${displayNameCondition}
      ORDER BY criteria.index
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
    `,
      params,
    );

    const metaParams: any[] = [category];
    let metaSemesterCondition = '';
    if (semester) {
      metaParams.push(semester);
      metaSemesterCondition = `AND batch.display_name = $${metaParams.length}`;
    }

    let metaDisplayNameCondition = '';
    if (displayName) {
      metaParams.push(displayName);
      metaDisplayNameCondition = `AND criteria.display_name = $${metaParams.length}`;
    }

    const meta = await this.staffSurveyPointRepo.query(
      `
      SELECT
        COUNT(*) AS total_item
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.category = $1 AND criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${metaSemesterCondition} ${metaDisplayNameCondition}
    `,
      metaParams,
    );

    return {
      data,
      meta: {
        hasNext:
          pagination.page < Math.ceil(meta[0].total_item / pagination.size) - 1,
        hasPrev: pagination.page > 0,
        page: pagination.page,
        size: pagination.size,
        total_item: meta[0].total_item,
        total_page: Math.ceil(meta[0].total_item / pagination.size),
      },
    };
  }

  async getAllComments(
    pagination: PaginationArgs,
    semester?: string,
    keyword?: string,
    type?: string[],
    topic?: string[],
  ) {
    // Recalculate params for the whole query
    const queryParams: any[] = [];
    let qSemesterCondition = '';
    if (semester) {
      queryParams.push(semester);
      qSemesterCondition = `AND batch.display_name = $${queryParams.length}`;
    }

    let qKeywordCondition = '';
    let qSheetKeywordCondition = '';
    if (keyword) {
      queryParams.push(`%${keyword}%`);
      qKeywordCondition = `AND point.comment ILIKE $${queryParams.length}`;
      qSheetKeywordCondition = `AND sheet.additional_comment ILIKE $${queryParams.length}`;
    }

    let qTypeCondition = '';
    let qSheetTypeCondition = '';
    if (type && !type.includes('all') && type.length > 0) {
      const typeList = type.map(t => {
        if (t === 'positive') return 'tích cực';
        if (t === 'negative') return 'tiêu cực';
        if (t === 'neutral') return 'trung lập';
        return t;
      });
      queryParams.push(typeList);
      qTypeCondition = `AND point.sentiment = ANY($${queryParams.length})`;
      qSheetTypeCondition = `AND sheet.sentiment = ANY($${queryParams.length})`;
    }

    let qTopicCondition = '';
    let qSheetTopicCondition = '';
    if (topic && !topic.includes('all') && topic.length > 0) {
      if (topic.includes('ĐƠN VỊ')) {
        const topicsWithoutUnit = topic.filter(t => t !== 'ĐƠN VỊ');
        if (topicsWithoutUnit.length > 0) {
          queryParams.push(topicsWithoutUnit);
          qTopicCondition = `AND (point.topic = ANY($${queryParams.length}) OR criteria.category = 'ĐƠN VỊ')`;
          qSheetTopicCondition = `AND sheet.topic = ANY($${queryParams.length})`;
        } else {
          qTopicCondition = `AND criteria.category = 'ĐƠN VỊ'`;
          qSheetTopicCondition = `AND false`;
        }
      } else {
        queryParams.push(topic);
        qTopicCondition = `AND point.topic = ANY($${queryParams.length})`;
        qSheetTopicCondition = `AND sheet.topic = ANY($${queryParams.length})`;
      }
    }

    const limitParamIndex = queryParams.length + 1;
    const offsetParamIndex = queryParams.length + 2;
    queryParams.push(pagination.size, (pagination.page || 0) * pagination.size);

    const data = await this.staffSurveyPointRepo.query(
      `
      SELECT * FROM (
        SELECT
          COALESCE(cm.display_name, criteria.display_name) AS criteria,
          criteria.index AS index,
          point.point AS point,
          point.comment AS comment,
          point.topic AS topic,
          point.sentiment AS sentiment
        FROM staff_survey_point AS point
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        LEFT JOIN criteria_mapping AS cm
          ON criteria.mapping_id = cm.id
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${qSemesterCondition} ${qKeywordCondition} ${qTypeCondition} ${qTopicCondition}
        
        UNION ALL
        
        SELECT
          'Ý kiến khác' AS criteria,
          999 AS index,
          0 AS point,
          sheet.additional_comment AS comment,
          sheet.topic AS topic,
          sheet.sentiment AS sentiment
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${qSemesterCondition} ${qSheetKeywordCondition} ${qSheetTypeCondition} ${qSheetTopicCondition}
      ) AS combined
      ORDER BY index
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
    `,
      queryParams,
    );

    const metaParams: any[] = [];
    let mSemesterCondition = '';
    if (semester) {
      metaParams.push(semester);
      mSemesterCondition = `AND batch.display_name = $${metaParams.length}`;
    }

    let mKeywordCondition = '';
    let mSheetKeywordCondition = '';
    if (keyword) {
      metaParams.push(`%${keyword}%`);
      mKeywordCondition = `AND point.comment ILIKE $${metaParams.length}`;
      mSheetKeywordCondition = `AND sheet.additional_comment ILIKE $${metaParams.length}`;
    }

    let mTypeCondition = '';
    let mSheetTypeCondition = '';
    if (type && !type.includes('all') && type.length > 0) {
      const typeList = type.map(t => {
        if (t === 'positive') return 'tích cực';
        if (t === 'negative') return 'tiêu cực';
        if (t === 'neutral') return 'trung lập';
        return t;
      });
      metaParams.push(typeList);
      mTypeCondition = `AND point.sentiment = ANY($${metaParams.length})`;
      mSheetTypeCondition = `AND sheet.sentiment = ANY($${metaParams.length})`;
    }

    let mTopicCondition = '';
    let mSheetTopicCondition = '';
    if (topic && !topic.includes('all') && topic.length > 0) {
      if (topic.includes('ĐƠN VỊ')) {
        const topicsWithoutUnit = topic.filter(t => t !== 'ĐƠN VỊ');
        if (topicsWithoutUnit.length > 0) {
          metaParams.push(topicsWithoutUnit);
          mTopicCondition = `AND (point.topic = ANY($${metaParams.length}) OR criteria.category = 'ĐƠN VỊ')`;
          mSheetTopicCondition = `AND sheet.topic = ANY($${metaParams.length})`;
        } else {
          mTopicCondition = `AND criteria.category = 'ĐƠN VỊ'`;
          mSheetTopicCondition = `AND false`;
        }
      } else {
        metaParams.push(topic);
        mTopicCondition = `AND point.topic = ANY($${metaParams.length})`;
        mSheetTopicCondition = `AND sheet.topic = ANY($${metaParams.length})`;
      }
    }

    const metaResult = await this.staffSurveyPointRepo.query(
      `
      SELECT SUM(total_item) AS total_item FROM (
        SELECT
          COUNT(*) AS total_item
        FROM staff_survey_point AS point
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${mSemesterCondition} ${mKeywordCondition} ${mTypeCondition} ${mTopicCondition}
        
        UNION ALL
        
        SELECT
          COUNT(*) AS total_item
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${mSemesterCondition} ${mSheetKeywordCondition} ${mSheetTypeCondition} ${mSheetTopicCondition}
      ) AS total_combined
    `,
      metaParams,
    );

    const totalItem = parseInt(metaResult[0].total_item || '0');
    const page = pagination.page || 0;
    const size = pagination.size;
    const totalPage = Math.ceil(totalItem / size);

    return {
      data,
      meta: {
        hasNext: page < totalPage - 1,
        hasPrev: page > 0,
        page,
        size,
        total_item: totalItem,
        total_page: totalPage,
      },
    };
  }

  async getAllCommentsCount(semester?: string, keyword?: string, type?: string[], topic?: string[]) {
    const params: any[] = [];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let keywordCondition = '';
    let sheetKeywordCondition = '';
    if (keyword) {
      params.push(`%${keyword}%`);
      keywordCondition = `AND point.comment ILIKE $${params.length}`;
      sheetKeywordCondition = `AND sheet.additional_comment ILIKE $${params.length}`;
    }

    let typeCondition = '';
    let sheetTypeCondition = '';
    if (type && !type.includes('all') && type.length > 0) {
      const typeList = type.map(t => {
        if (t === 'positive') return 'tích cực';
        if (t === 'negative') return 'tiêu cực';
        if (t === 'neutral') return 'trung lập';
        return t;
      });
      params.push(typeList);
      typeCondition = `AND point.sentiment = ANY($${params.length})`;
      sheetTypeCondition = `AND sheet.sentiment = ANY($${params.length})`;
    }

    let topicCondition = '';
    let sheetTopicCondition = '';
    if (topic && !topic.includes('all') && topic.length > 0) {
      if (topic.includes('ĐƠN VỊ')) {
        const topicsWithoutUnit = topic.filter(t => t !== 'ĐƠN VỊ');
        if (topicsWithoutUnit.length > 0) {
          params.push(topicsWithoutUnit);
          topicCondition = `AND (point.topic = ANY($${params.length}) OR criteria.category = 'ĐƠN VỊ')`;
          sheetTopicCondition = `AND sheet.topic = ANY($${params.length})`;
        } else {
          topicCondition = `AND criteria.category = 'ĐƠN VỊ'`;
          sheetTopicCondition = `AND false`;
        }
      } else {
        params.push(topic);
        topicCondition = `AND point.topic = ANY($${params.length})`;
        sheetTopicCondition = `AND sheet.topic = ANY($${params.length})`;
      }
    }

    const result = await this.staffSurveyPointRepo.query(
      `
      SELECT SUM(total_item) AS total_item FROM (
        SELECT
          COUNT(*) AS total_item
        FROM staff_survey_point AS point
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${keywordCondition} ${typeCondition} ${topicCondition}
        
        UNION ALL
        
        SELECT
          COUNT(*) AS total_item
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${semesterCondition} ${sheetKeywordCondition} ${sheetTypeCondition} ${sheetTopicCondition}
      ) AS total_combined
    `,
      params,
    );

    console.log({ count: parseInt(result[0].total_item || '0') });

    return parseInt(result[0].total_item || '0');
  }

  async getStaffSurveyCommentQuantity(semester?: string, type?: string, topic?: string) {
    const params: any[] = [];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let typeCondition = '';
    let sheetTypeCondition = '';
    if (type && type !== 'all') {
      let mappedType = type;
      if (type === 'positive') mappedType = 'tích cực';
      if (type === 'negative') mappedType = 'tiêu cực';
      if (type === 'neutral') mappedType = 'trung lập';
      params.push(mappedType);
      typeCondition = `AND point.sentiment = $${params.length}`;
      sheetTypeCondition = `AND sheet.sentiment = $${params.length}`;
    }

    let topicCondition = '';
    let sheetTopicCondition = '';
    if (topic && topic !== 'all') {
      if (topic === 'ĐƠN VỊ') {
        topicCondition = `AND criteria.category = 'ĐƠN VỊ'`;
        sheetTopicCondition = `AND false`;
      } else {
        params.push(topic);
        topicCondition = `AND point.topic = $${params.length}`;
        sheetTopicCondition = `AND sheet.topic = $${params.length}`;
      }
    }

    const result = await this.staffSurveyPointRepo.query(
      `
      SELECT SUM(total_item) AS total_item FROM (
        SELECT
          COUNT(*) AS total_item
        FROM staff_survey_point AS point
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${typeCondition} ${topicCondition}
        
        UNION ALL
        
        SELECT
          COUNT(*) AS total_item
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${semesterCondition} ${sheetTypeCondition} ${sheetTopicCondition}
      ) AS total_combined
    `,
      params,
    );

    return {
      type: type || 'all',
      quantity: parseInt(result[0].total_item || '0')
    };
  }

  async getStaffSurveyCommentStatistics(semester?: string, type?: string[], topic?: string[]) {
    const params: any[] = [];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let typeCondition = '';
    let sheetTypeCondition = '';
    if (type && !type.includes('all') && type.length > 0) {
      const typeList = type.map(t => {
        if (t === 'positive') return 'tích cực';
        if (t === 'negative') return 'tiêu cực';
        if (t === 'neutral') return 'trung lập';
        return t;
      });
      params.push(typeList);
      typeCondition = `AND point.sentiment = ANY($${params.length})`;
      sheetTypeCondition = `AND sheet.sentiment = ANY($${params.length})`;
    }

    let topicCondition = '';
    let sheetTopicCondition = '';
    if (topic && !topic.includes('all') && topic.length > 0) {
      if (topic.includes('ĐƠN VỊ')) {
        const topicsWithoutUnit = topic.filter(t => t !== 'ĐƠN VỊ');
        if (topicsWithoutUnit.length > 0) {
          params.push(topicsWithoutUnit);
          topicCondition = `AND (point.topic = ANY($${params.length}) OR criteria.category = 'ĐƠN VỊ')`;
          sheetTopicCondition = `AND sheet.topic = ANY($${params.length})`;
        } else {
          topicCondition = `AND criteria.category = 'ĐƠN VỊ'`;
          sheetTopicCondition = `AND false`;
        }
      } else {
        params.push(topic);
        topicCondition = `AND point.topic = ANY($${params.length})`;
        sheetTopicCondition = `AND sheet.topic = ANY($${params.length})`;
      }
    }

    const totals = await this.staffSurveyPointRepo.query(
      `
      SELECT label, SUM(total) as total FROM (
        SELECT
          batch.display_name as label,
          COUNT(*) AS total
        FROM staff_survey_point AS point
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${typeCondition} ${topicCondition}
        GROUP BY batch.display_name
        
        UNION ALL
        
        SELECT
          batch.display_name as label,
          COUNT(*) AS total
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${semesterCondition} ${sheetTypeCondition} ${sheetTopicCondition}
        GROUP BY batch.display_name
      ) as combined
      GROUP BY label
      ORDER BY label ASC
      `, params
    );

    const sentiments = await this.staffSurveyPointRepo.query(
      `
      SELECT label, sentiment, SUM(count) as count FROM (
        SELECT
          batch.display_name as label,
          point.sentiment as sentiment,
          COUNT(*) AS count
        FROM staff_survey_point AS point
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${typeCondition} ${topicCondition} AND point.sentiment IS NOT NULL
        GROUP BY batch.display_name, point.sentiment
        
        UNION ALL
        
        SELECT
          batch.display_name as label,
          sheet.sentiment as sentiment,
          COUNT(*) AS count
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${semesterCondition} ${sheetTypeCondition} ${sheetTopicCondition} AND sheet.sentiment IS NOT NULL
        GROUP BY batch.display_name, sheet.sentiment
      ) as combined
      GROUP BY label, sentiment
      ORDER BY label ASC
      `, params
    );

    const topics = await this.staffSurveyPointRepo.query(
      `
      SELECT label, topic, SUM(count) as count FROM (
        SELECT
          batch.display_name as label,
          point.topic as topic,
          COUNT(*) AS count
        FROM staff_survey_point AS point
        JOIN staff_survey_sheet AS sheet
          ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        JOIN staff_survey_criteria AS criteria
          ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
        WHERE criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${typeCondition} ${topicCondition} AND point.topic IS NOT NULL
        GROUP BY batch.display_name, point.topic
        
        UNION ALL
        
        SELECT
          batch.display_name as label,
          sheet.topic as topic,
          COUNT(*) AS count
        FROM staff_survey_sheet AS sheet
        JOIN staff_survey_batch AS batch
          ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
        WHERE sheet.additional_comment IS NOT NULL AND sheet.additional_comment != '' ${semesterCondition} ${sheetTypeCondition} ${sheetTopicCondition} AND sheet.topic IS NOT NULL
        GROUP BY batch.display_name, sheet.topic
      ) as combined
      GROUP BY label, topic
      ORDER BY label ASC
      `, params
    );

    const result = totals.map((t: any) => ({
      label: t.label,
      total: parseInt(t.total, 10),
      sentiments: {} as any,
      topics: {} as any,
    }));

    sentiments.forEach((s: any) => {
      let mappedSentiment = 'neutral';
      if (s.sentiment === 'tích cực') mappedSentiment = 'positive';
      if (s.sentiment === 'tiêu cực') mappedSentiment = 'negative';
      
      const entry = result.find((r) => r.label === s.label);
      if (entry) {
        entry.sentiments[mappedSentiment] = parseInt(s.count, 10);
      }
    });

    topics.forEach((t: any) => {
      const entry = result.find((r) => r.label === t.label);
      if (entry) {
        entry.topics[t.topic || 'Unknown'] = parseInt(t.count, 10);
      }
    });

    return result;
  }

  async getPointWithCommentByCriteriaCount(
    category: string,
    semester?: string,
    displayName?: string,
  ) {
    const params: any[] = [category];
    let semesterCondition = '';
    if (semester) {
      params.push(semester);
      semesterCondition = `AND batch.display_name = $${params.length}`;
    }

    let displayNameCondition = '';
    if (displayName) {
      params.push(displayName);
      displayNameCondition = `AND criteria.display_name = $${params.length}`;
    }

    const result = await this.staffSurveyPointRepo.query(
      `
      SELECT
        COUNT(*) AS total_item
      FROM staff_survey_point AS point
      JOIN staff_survey_criteria AS criteria
        ON point.staff_survey_criteria_id = criteria.staff_survey_criteria_id
      JOIN staff_survey_sheet AS sheet
        ON point.staff_survey_sheet_id = sheet.staff_survey_sheet_id
      JOIN staff_survey_batch AS batch
        ON sheet.staff_survey_batch_id = batch.staff_survey_batch_id
      WHERE criteria.category = $1 AND criteria.is_shown = true AND point.comment IS NOT NULL AND point.comment != '' ${semesterCondition} ${displayNameCondition}
    `,
      params,
    );

    return parseInt(result[0].total_item);
  }

  async getAdditionalComments(
    semester?: string,
  ): Promise<StaffSurveyAdditionalCommentDTO[]> {
    const query = this.repo
      .createQueryBuilder('sheet')
      .leftJoin('sheet.batch', 'batch')
      .select([
        'sheet.display_name',
        'sheet.faculty',
        'sheet.additional_comment',
        'sheet.topic',
        'sheet.sentiment',
      ])
      .where(
        "sheet.additional_comment IS NOT NULL AND sheet.additional_comment != ''",
      );

    if (semester) {
      query.andWhere('batch.display_name = :semester', { semester });
    }

    return await query.getMany();
  }

  async getCriteria({
    criteria_name,
    criteria_category,
    criteria_index,
    semester,
  }: {
    criteria_name: string;
    criteria_category: string;
    criteria_index: number;
    semester?: string;
  }) {
    let criteria = await this.staffSurveyCriteriaRepo.findOne({
      where: {
        display_name: criteria_name,
        category: criteria_category,
      },
    });

    if (!criteria) {
      const criteriaData = this.staffSurveyCriteriaRepo.create({
        display_name: criteria_name,
        category: criteria_category,
        index: criteria_index,
        semesters: semester ? [semester] : [],
      });

      try {
        criteria = await this.staffSurveyCriteriaRepo.save(criteriaData);
      } catch (error) {
        console.error('Error saving criteria:', error);
        return await this.staffSurveyCriteriaRepo.findOne({
          where: {
            display_name: criteria_name,
            category: criteria_category,
          },
        });
      }
    } else {
      if (semester) {
        try {
          await this.staffSurveyCriteriaRepo.update(
            {
              staff_survey_criteria_id: criteria.staff_survey_criteria_id,
            },
            {
              semesters: Array.from(
                new Set([...(criteria.semesters ?? []), semester]),
              ),
            },
          );

          criteria = await this.staffSurveyCriteriaRepo.findOne({
            where: {
              display_name: criteria_name,
              category: criteria_category,
            },
          });
        } catch (error) {
          console.error('Error updating criteria:', error);
        }
      }
    }

    return criteria;
  }

  async getBatch(surveyName: string, semester?: string) {
    const batchName =
      surveyName ||
      `Khảo sát CBNV (Upload ${moment().format('HH:mm, DD-MM-YYYY')})`;

    let batch = await this.staffSurveyBatchRepo.findOne({
      where: {
        display_name: batchName,
      },
    });

    if (!batch) {
      const batchData = this.staffSurveyBatchRepo.create({
        display_name: batchName,
        semester,
        updated_at: new Date(),
      });
      try {
        batch = await this.staffSurveyBatchRepo.save(batchData);
      } catch (error) {
        return await this.staffSurveyBatchRepo.findOne({
          where: {
            display_name: batchName,
          },
        });
      }
    }

    return batch;
  }

  async updateCriteria(id: string, is_shown: boolean) {
    await this.staffSurveyCriteriaRepo.update(id, { is_shown });
    return this.staffSurveyCriteriaRepo.findOne({
      where: { staff_survey_criteria_id: id },
    });
  }
}
