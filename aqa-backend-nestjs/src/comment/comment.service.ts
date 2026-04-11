import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterArgs } from 'src/common/args/filter.arg';
import { PaginationArgs } from 'src/common/args/pagination.arg';
import { FilterQueryService } from 'src/common/services/filter-query.service';
import { paginateByQuery } from 'src/common/utils/paginate';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Lecturer } from 'src/lecturer/entities/lecturer.entity';

@Injectable()
export class CommentService {
  constructor(
    private filterQueryService: FilterQueryService,
    @InjectRepository(Comment) private repo: Repository<Comment>,
  ) {}

  async findAll(
    filter: FilterArgs,
    paginationOptions: PaginationArgs,
    type: string[],
    topic: string[],
  ) {
    const query = await this.filterQueryService.filterQuery<Comment>(
      'Comment',
      this.repo
        .createQueryBuilder()
        .innerJoin('Comment.class', 'Class')
        .innerJoin('Class.subject', 'Subject')
        .innerJoin('Subject.faculty', 'Faculty')
        .innerJoin('Class.semester', 'Semester')
        .innerJoin(
          Lecturer,
          'Lecturer',
          'Lecturer.lecturer_id = Class.lecturer_id OR Lecturer.lecturer_id = Class.lecturer_1_id OR Lecturer.lecturer_id = Class.lecturer_2_id',
        ),
      filter,
    );

    return paginateByQuery(
      query
        .andWhere('array_length(Comment.type_list, 1) > 0')
        .andWhere(
          type && !type.includes('all') && type.length > 0
            ? 'Comment.type_list && ARRAY[:...type]'
            : 'true',
          {
            type: type && type.length > 0 ? type : [],
          },
        )
        .andWhere(
          topic && !topic.includes('all') && topic.length > 0
            ? 'Comment.topic IN (:...topic)'
            : 'true',
          {
            topic: topic && topic.length > 0 ? topic : [],
          },
        ),
      paginationOptions,
      filter,
      {
        relations: {
          class: true,
        },
      },
    );
  }

  async getQuantity(filter: FilterArgs, type: string, topic: string) {
    const query = await this.filterQueryService.filterQuery<Comment>(
      'Comment',
      this.repo
        .createQueryBuilder()
        .innerJoin('Comment.class', 'Class')
        .innerJoin('Class.subject', 'Subject')
        .innerJoin('Subject.faculty', 'Faculty')
        .innerJoin('Class.semester', 'Semester')
        .innerJoin(
          Lecturer,
          'Lecturer',
          'Lecturer.lecturer_id = Class.lecturer_id OR Lecturer.lecturer_id = Class.lecturer_1_id OR Lecturer.lecturer_id = Class.lecturer_2_id',
        ),
      filter,
    );

    return {
      type: type ?? 'all',
      quantity:
        (await query
          .andWhere('array_length(Comment.type_list, 1) > 0')
          .andWhere(
            type && type != 'all' ? ':type = ANY(Comment.type_list) ' : 'true',
            {
              type,
            },
          )
          .andWhere(
            topic && topic != 'all' ? 'Comment.topic = :topic' : 'true',
            {
              topic,
            },
          )
          .getCount()) || 0,
    };
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { comment_id: id }, relations: {} });
  }

  async getCommentStatistics(
    filter: FilterArgs,
    groupBy: 'semester' | 'year' = 'semester',
    type?: string[],
    topic?: string[],
  ) {
    const groupField =
      groupBy === 'semester' ? 'Semester.display_name' : 'Semester.year';

    const baseQuery = await this.filterQueryService.filterQuery<Comment>(
      'Comment',
      this.repo
        .createQueryBuilder('Comment')
        .innerJoin('Comment.class', 'Class')
        .innerJoin('Class.subject', 'Subject')
        .innerJoin('Subject.faculty', 'Faculty')
        .innerJoin('Class.semester', 'Semester')
        .innerJoin(
          Lecturer,
          'Lecturer',
          'Lecturer.lecturer_id = Class.lecturer_id OR Lecturer.lecturer_id = Class.lecturer_1_id OR Lecturer.lecturer_id = Class.lecturer_2_id',
        ),
      filter,
    );

    baseQuery.andWhere('array_length(Comment.type_list, 1) > 0');

    if (type && !type.includes('all') && type.length > 0) {
      baseQuery.andWhere('Comment.type_list && ARRAY[:...type]', { type });
    }

    if (topic && !topic.includes('all') && topic.length > 0) {
      baseQuery.andWhere('Comment.topic IN (:...topic)', { topic });
    }

    const totals = await baseQuery
      .clone()
      .select(`${groupField}`, 'label')
      .addSelect('COUNT(DISTINCT Comment.comment_id)', 'total')
      .groupBy(`${groupField}`)
      .addGroupBy('Semester.year')
      .orderBy('Semester.year', 'ASC')
      .addOrderBy(`${groupField}`, 'ASC')
      .getRawMany();

    const sentiments = await baseQuery
      .clone()
      .select(`${groupField}`, 'label')
      .addSelect('unnest(Comment.type_list)', 'sentiment')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`${groupField}`)
      .addGroupBy('Semester.year')
      .addGroupBy('sentiment')
      .orderBy('Semester.year', 'ASC')
      .addOrderBy(`${groupField}`, 'ASC')
      .getRawMany();

    const topics = await baseQuery
      .clone()
      .select(`${groupField}`, 'label')
      .addSelect('Comment.topic', 'topic')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`${groupField}`)
      .addGroupBy('Semester.year')
      .addGroupBy('Comment.topic')
      .orderBy('Semester.year', 'ASC')
      .addOrderBy(`${groupField}`, 'ASC')
      .getRawMany();

    const result = totals.map((t) => ({
      label: t.label,
      total: parseInt(t.total, 10),
      sentiments: {},
      topics: {},
    }));

    sentiments.forEach((s) => {
      const entry = result.find((r) => r.label === s.label);
      if (entry) {
        entry.sentiments[s.sentiment] = parseInt(s.count, 10);
      }
    });

    topics.forEach((t) => {
      const entry = result.find((r) => r.label === t.label);
      if (entry) {
        entry.topics[t.topic || 'Unknown'] = parseInt(t.count, 10);
      }
    });

    return result;
  }
}
