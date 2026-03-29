import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffSurveySheet } from './entities/staff-survey-sheet.entity';
import { StaffSurveyCriteria } from './entities/staff-survey-criteria.entity';
import { StaffSurveyPoint } from './entities/staff-survey-point.entity';
import { StaffSurveyResolver } from './staff-survey.resolver';
import { StaffSurveyService } from './staff-survey.service';
import { StaffSurveyBatch } from './entities/staff-survey-batch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffSurveyBatch,
      StaffSurveySheet,
      StaffSurveyCriteria,
      StaffSurveyPoint,
    ]),
  ],
  providers: [StaffSurveyResolver, StaffSurveyService],
  exports: [],
})
export class StaffSurveyModule {}
