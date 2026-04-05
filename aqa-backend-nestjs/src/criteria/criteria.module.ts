import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterModule } from 'src/semester/semester.module';
import { CriteriaResolver } from './criteria.resolver';
import { CriteriaService } from './criteria.service';
import { Criteria } from './entities/criteria.entity';
import { CriteriaMapping } from './entities/criteria-mapping.entity';
import { StaffSurveyCriteria } from '../staff-survey/entities/staff-survey-criteria.entity';
import { ClassModule } from 'src/class/class.module';
import { CriteriaMappingResolver } from './criteria-mapping.resolver';
import { CriteriaMappingService } from './criteria-mapping.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Criteria, CriteriaMapping, StaffSurveyCriteria]),
    ClassModule,
    forwardRef(() => SemesterModule),
  ],
  providers: [
    CriteriaResolver,
    CriteriaService,
    CriteriaMappingResolver,
    CriteriaMappingService,
  ],
})
export class CriteriaModule {}
