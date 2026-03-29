import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturerModule } from 'src/lecturer/lecturer.module';
import { PointModule } from 'src/point/point.module';
import { SemesterModule } from 'src/semester/semester.module';
import { SubjectModule } from 'src/subject/subject.module';
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';
import { Class } from './entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    forwardRef(() => LecturerModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => SemesterModule),
    forwardRef(() => PointModule),
  ],
  providers: [ClassResolver, ClassService],
  exports: [TypeOrmModule.forFeature([Class]), ClassService],
})
export class ClassModule {}
