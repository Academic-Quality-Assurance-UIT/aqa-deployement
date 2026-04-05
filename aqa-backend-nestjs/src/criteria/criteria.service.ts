import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryArgs } from 'src/common/args/query.arg';
import { BaseService } from 'src/common/services/BaseService';
import { FilterQueryService } from 'src/common/services/filter-query.service';
import { paginateByQuery } from 'src/common/utils/paginate';
import { Repository } from 'typeorm';
import { Criteria } from './entities/criteria.entity';
import { Class } from 'src/class/entities/class.entity';
import { Lecturer } from 'src/lecturer/entities/lecturer.entity';

@Injectable()
export class CriteriaService extends BaseService<Criteria> {
  private readonly logger = new Logger(CriteriaService.name);

  constructor(
    private filterQueryService: FilterQueryService,
    @InjectRepository(Criteria) private repo: Repository<Criteria>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {
    super();
  }

  relations = { semester: true };

  async findAll({ filter, pagination, sort }: QueryArgs) {
    const query = await this.filterQueryService.filterQuery<Criteria>(
      Criteria,
      this.repo
        .createQueryBuilder()
        .leftJoin('Criteria.points', 'Point')
        .leftJoin('Point.class', 'Class')
        .leftJoin('Class.semester', 'Semester')
        .leftJoin('Class.subject', 'Subject')
        .leftJoin(
          Lecturer,
          'Lecturer',
          'Lecturer.lecturer_id = Class.lecturer_id OR Lecturer.lecturer_id = Class.lecturer_1_id OR Lecturer.lecturer_id = Class.lecturer_2_id',
        )
        .leftJoin('Subject.faculty', 'Faculty')
        .leftJoin('Criteria.mapping', 'Mapping'),
      filter,
      undefined,
    );

    if (sort?.sortField) {
      const {
        sortField: { type },
        isAscending,
      } = sort;

      const direction = isAscending ? 'ASC' : 'DESC';

      if (type === 'point') {
        query.addOrderBy('total_point', direction);
      } else {
        query.addOrderBy(
          'COALESCE(Mapping.display_name, Criteria.display_name)',
          direction,
        );
      }
    }

    return paginateByQuery(
      query
        .select('MAX(Criteria.criteria_id)', 'criteria_id')
        .addSelect('MAX(Criteria.index)', 'index')
        .addSelect('MAX(Criteria.semester_id)', 'semester_id')
        .addSelect(
          'COALESCE(Mapping.display_name, Criteria.display_name)',
          'display_name',
        )
        .groupBy('COALESCE(Mapping.display_name, Criteria.display_name)'),
      pagination,
      filter,
      { isRaw: true },
    );
  }

  findOne(id: string): Promise<Criteria> {
    return this.repo.findOne({
      where: { criteria_id: id },
      relations: this.relations,
    });
  }

  async findClassType(criteria_id: string) {
    const criteriaProperties = await this.classRepo
      .createQueryBuilder()
      .leftJoin('Class.points', 'Point')
      .where('Point.criteria_id = :criteria_id', { criteria_id })
      .select('Class.class_type', 'class_type')
      .addSelect('COUNT(DISTINCT Class.class_id)', 'num')
      .groupBy('Class.class_type')
      .getRawMany();

    return criteriaProperties;
  }
}
