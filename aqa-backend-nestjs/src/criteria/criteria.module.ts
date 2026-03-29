import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterModule } from 'src/semester/semester.module';
import { CriteriaResolver } from './criteria.resolver';
import { CriteriaService } from './criteria.service';
import { Criteria } from './entities/criteria.entity';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Criteria]),
    ClassModule,
    forwardRef(() => SemesterModule),
  ],
  providers: [CriteriaResolver, CriteriaService],
})
export class CriteriaModule {}
