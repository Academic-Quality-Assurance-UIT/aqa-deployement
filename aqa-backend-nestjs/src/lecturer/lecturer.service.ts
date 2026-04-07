import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterArgs } from 'src/common/args/filter.arg';
import { QueryArgs } from 'src/common/args/query.arg';
import { BaseService } from 'src/common/services/BaseService';
import { FilterQueryService } from 'src/common/services/filter-query.service';
import { paginateByQuery } from 'src/common/utils/paginate';
import { FindOptionsRelations, Repository, DataSource } from 'typeorm';
import { Lecturer } from './entities/lecturer.entity';
import { Class } from 'src/class/entities/class.entity';
import {
  LecturerRankingItem,
  LecturerRankingResult,
  LecturerRankingSubject,
} from './dto/LecturerRanking.dto';
import { Semester } from 'src/semester/entities/semester.entity';

@Injectable()
export class LecturerService extends BaseService<Lecturer> {
  private readonly logger = new Logger(LecturerService.name);

  constructor(
    private filterQueryService: FilterQueryService,
    @InjectRepository(Lecturer) private repo: Repository<Lecturer>,
    private dataSource: DataSource,
  ) {
    super();
  }

  relations: FindOptionsRelations<Lecturer> = {
    faculty: true,
  };

  async findAll({ filter, pagination, sort }: QueryArgs) {
    const query = await this.filterQueryService.filterQuery<Lecturer>(
      Lecturer,
      this.repo
        .createQueryBuilder()
        .leftJoin(
          Class,
          'Class',
          'Class.lecturer_id = Lecturer.lecturer_id OR Class.lecturer_1_id = Lecturer.lecturer_id OR Class.lecturer_2_id = Lecturer.lecturer_id',
        )
        .leftJoin('Class.points', 'Point')
        .leftJoin('Class.subject', 'Subject')
        .leftJoin('Subject.faculty', 'Faculty')
        .leftJoin('Class.semester', 'Semester'),
      filter,
      sort,
    );

    return paginateByQuery(
      query
        .select('Lecturer.lecturer_id', 'lecturer_id')
        .addSelect('Lecturer.display_name', 'display_name')
        .addSelect('Lecturer.email', 'email')
        .addSelect('Lecturer.birth_date', 'birth_date')
        .addSelect('Lecturer.faculty_id', 'faculty_id')
        .addSelect('Lecturer.gender', 'gender')
        .addSelect('Lecturer.learning', 'learning')
        .addSelect('Lecturer.learning_position', 'learning_position')
        .addSelect('Lecturer.mscb', 'mscb')
        .addSelect('Lecturer.ngach', 'ngach')
        .addSelect('Lecturer.phone', 'phone')
        .addSelect('Lecturer.position', 'position')
        .addSelect('Lecturer.username', 'username')
        .addSelect('AVG(Point.point / Point.max_point)', 'total_point')
        .andWhere('Point.max_point != 0')
        .addGroupBy('Lecturer.lecturer_id'),
      pagination,
      filter,
      { isRaw: true },
    );
  }

  findOne(id: string): Promise<Lecturer> {
    return this.repo.findOne({ where: { lecturer_id: id } });
  }

  /**
   * Get ranked lecturers data based on avg point.
   * Returns raw rows with lecturer_id, display_name, faculty_id, faculty_name,
   * avg_point, total_subjects, total_classes.
   */
  private async getRankingData(
    filter: FilterArgs,
    minClasses: number,
    limit: number,
    semesterIds?: string[],
  ): Promise<any[]> {
    let query = this.repo
      .createQueryBuilder('Lecturer')
      .innerJoin(
        Class,
        'Class',
        'Class.lecturer_id = Lecturer.lecturer_id OR Class.lecturer_1_id = Lecturer.lecturer_id OR Class.lecturer_2_id = Lecturer.lecturer_id',
      )
      .innerJoin('Class.points', 'Point')
      .innerJoin('Class.subject', 'Subject')
      .innerJoin('Subject.faculty', 'Faculty')
      .innerJoin('Class.semester', 'Semester')
      .where('Point.max_point != 0')
      .andWhere('Faculty.is_displayed = true');

    // Apply filters
    if (filter.faculty_id) {
      query = query.andWhere('Faculty.faculty_id = :faculty_id', {
        faculty_id: filter.faculty_id,
      });
    }

    if (filter.semester_id) {
      query = query.andWhere('Semester.semester_id = :semester_id', {
        semester_id: filter.semester_id,
      });
    } else if (semesterIds && semesterIds.length > 0) {
      query = query.andWhere('Semester.semester_id IN (:...semesterIds)', {
        semesterIds,
      });
    }

    // Apply allowed years filter (same as FilterQueryService)
    const allowedYears = await this.filterQueryService.getAllowedYears();
    if (!filter.semester_id && allowedYears && allowedYears.length > 0) {
      query = query.andWhere('Semester.year IN (:...allowedYears)', {
        allowedYears,
      });
    }

    query = query
      .select('Lecturer.lecturer_id', 'lecturer_id')
      .addSelect('Lecturer.display_name', 'display_name')
      .addSelect('Lecturer.faculty_id', 'faculty_id')
      .addSelect('Faculty.display_name', 'faculty_name')
      .addSelect('4.0 * AVG(Point.point / Point.max_point)', 'avg_point')
      .addSelect('COUNT(DISTINCT Subject.subject_id)', 'total_subjects')
      .addSelect('COUNT(DISTINCT Class.class_id)', 'total_classes')
      .groupBy('Lecturer.lecturer_id')
      .addGroupBy('Faculty.faculty_id')
      .orderBy('avg_point', 'DESC');

    if (minClasses > 0) {
      query = query.having('COUNT(DISTINCT Class.class_id) >= :minClasses', {
        minClasses,
      });
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    return query.getRawMany();
  }

  /**
   * Given a semester_id, find the previous year equivalent semesters.
   * E.g., if semester is HK1 of 2024-2025, return HK1 of 2023-2024.
   * If no specific semester, return all semesters from the previous year.
   */
  private async getPreviousYearSemesterIds(
    semesterId?: string,
  ): Promise<string[]> {
    const semesterRepo = this.dataSource.getRepository(Semester);

    if (semesterId) {
      // Find the specific semester to get its year and type
      const semester = await semesterRepo.findOne({
        where: { semester_id: semesterId },
      });
      if (!semester || !semester.year) return [];

      // Parse year like "2024-2025" -> "2023-2024"
      const yearParts = semester.year.split('-');
      if (yearParts.length === 2) {
        const prevYear = `${parseInt(yearParts[0]) - 1}-${parseInt(yearParts[1]) - 1}`;
        // Find semesters of same type in previous year
        const conditions: any = { year: prevYear };
        if (semester.type) {
          conditions.type = semester.type;
        }
        const prevSemesters = await semesterRepo.find({ where: conditions });
        return prevSemesters.map((s) => s.semester_id);
      }
      return [];
    } else {
      // No specific semester - get the latest year and compare with previous
      const latestYear = await semesterRepo
        .createQueryBuilder('s')
        .select('s.year')
        .groupBy('s.year')
        .orderBy('s.year', 'DESC')
        .limit(1)
        .getRawOne();

      if (!latestYear?.s_year) return [];

      const yearParts = latestYear.s_year.split('-');
      if (yearParts.length === 2) {
        const prevYear = `${parseInt(yearParts[0]) - 1}-${parseInt(yearParts[1]) - 1}`;
        const prevSemesters = await semesterRepo.find({
          where: { year: prevYear },
        });
        return prevSemesters.map((s) => s.semester_id);
      }
      return [];
    }
  }

  /**
   * Get taught subjects for a lecturer within a specific filter context.
   */
  private async getTaughtSubjects(
    lecturerId: string,
    filter: FilterArgs,
  ): Promise<LecturerRankingSubject[]> {
    let query = this.dataSource
      .createQueryBuilder()
      .select('Subject.subject_id', 'subject_id')
      .addSelect('Subject.display_name', 'display_name')
      .from('subject', 'Subject')
      .innerJoin('class', 'Class', 'Class.subject_id = Subject.subject_id')
      .innerJoin('semester', 'Semester', 'Semester.semester_id = Class.semester_id')
      .innerJoin('point', 'Point', 'Point.class_id = Class.class_id')
      .where(
        '(Class.lecturer_id = :lecturerId OR Class.lecturer_1_id = :lecturerId OR Class.lecturer_2_id = :lecturerId)',
        { lecturerId },
      )
      .andWhere('Point.max_point != 0');

    if (filter.semester_id) {
      query = query.andWhere('Semester.semester_id = :semester_id', {
        semester_id: filter.semester_id,
      });
    } else {
      const allowedYears = await this.filterQueryService.getAllowedYears();
      if (allowedYears && allowedYears.length > 0) {
        query = query.andWhere('Semester.year IN (:...allowedYears)', {
          allowedYears,
        });
      }
    }

    if (filter.faculty_id) {
      query = query
        .innerJoin('faculty', 'Faculty', 'Faculty.faculty_id = Subject.faculty_id')
        .andWhere('Faculty.faculty_id = :faculty_id', {
          faculty_id: filter.faculty_id,
        });
    }

    return query
      .groupBy('Subject.subject_id')
      .addGroupBy('Subject.display_name')
      .getRawMany();
  }

  /**
   * Main method: Get lecturer ranking with rank changes.
   */
  async getLecturerRanking(
    filter: FilterArgs,
    minClasses: number = 0,
    limit: number = 10,
  ): Promise<LecturerRankingResult> {
    // Get current ranking data
    const currentData = await this.getRankingData(filter, minClasses, limit);

    // Get previous year ranking for comparison
    const prevSemesterIds = await this.getPreviousYearSemesterIds(
      filter.semester_id,
    );

    let prevRankMap = new Map<string, number>();
    if (prevSemesterIds.length > 0) {
      const prevFilter: FilterArgs = {
        ...filter,
        semester_id: undefined, // Don't filter by specific semester for prev
      };
      // Get all lecturers for previous year (no limit) for accurate ranking
      const prevData = await this.getRankingData(
        prevFilter,
        minClasses,
        0,
        prevSemesterIds,
      );
      prevData.forEach((row, index) => {
        prevRankMap.set(row.lecturer_id, index + 1);
      });
    }

    // Build result with taught subjects
    const items: LecturerRankingItem[] = await Promise.all(
      currentData.map(async (row, index) => {
        const taughtSubjects = await this.getTaughtSubjects(
          row.lecturer_id,
          filter,
        );

        const item = new LecturerRankingItem();
        item.rank = index + 1;
        item.lecturer_id = row.lecturer_id;
        item.display_name = row.display_name;
        item.faculty_id = row.faculty_id;
        item.faculty_name = row.faculty_name;
        item.avg_point = parseFloat(row.avg_point) || 0;
        item.total_subjects = parseInt(row.total_subjects) || 0;
        item.total_classes = parseInt(row.total_classes) || 0;
        item.previous_rank = prevRankMap.get(row.lecturer_id) ?? null;
        item.taught_subjects = taughtSubjects;

        return item;
      }),
    );

    return { items };
  }
}
