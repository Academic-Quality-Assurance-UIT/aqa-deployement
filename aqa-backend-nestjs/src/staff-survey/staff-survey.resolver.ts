import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueryArgs } from 'src/common/args/query.arg';
import { PointByCategoryDTO } from './dtos/point-by-category.dto';
import { StaffSurveyPointByCategoryAndYearDTO } from './dtos/staff-survey-point-by-category-and-year.dto';
import { PointByCriteriaDTO } from './dtos/point-by-criteria.dto';
import { StaffSurveyPointByYearDTO } from './dtos/staff-survey-point-by-year.dto';
import { StaffSurveyAdditionalCommentDTO } from './dtos/staff-survey-additional-comment.dto';
import { StaffSurveyPointResponseDTO } from './dtos/staff-survey-point.dto';
import { StaffSurveySheetDTO } from './dtos/staff-survey-sheet.dto';
import { StaffSurveyBatch } from './entities/staff-survey-batch.entity';
import { StaffSurveyCriteria } from './entities/staff-survey-criteria.entity';
import { StaffSurveySheet } from './entities/staff-survey-sheet.entity';
import { StaffSurveyService } from './staff-survey.service';

import { CommentQuantity } from 'src/comment/dto/CommentQuantity.dto';
import { CommentStatisticData } from 'src/comment/dto/CommentStatistic.dto';
import { StaffSurveyResolver as StaffSurveyResolverClass } from './staff-survey.resolver';

@Resolver(() => StaffSurveySheet)
export class StaffSurveyResolver {
  constructor(private readonly staffSurveyService: StaffSurveyService) {}

  @Mutation(() => StaffSurveySheet, {
    name: 'addNewStaffSurveyData',
    description: 'Add new staff survey data',
  })
  async create(
    @Args('data', { type: () => StaffSurveySheetDTO })
    data: StaffSurveySheetDTO,
  ) {
    return await this.staffSurveyService.create(data);
  }

  @Mutation(() => [StaffSurveySheet], {
    name: 'addListStaffSurveyData',
    description: 'Add new staff survey data',
  })
  async createList(
    @Args('data', { type: () => [StaffSurveySheetDTO] })
    data: StaffSurveySheetDTO[],
  ) {
    return await Promise.all(
      data.map((item) => this.staffSurveyService.create(item)),
    );
  }

  @Query(() => [StaffSurveyCriteria])
  async getCriteriaList() {
    return await this.staffSurveyService.getCriteriaList();
  }

  @Query(() => [StaffSurveyBatch])
  async getBatchList() {
    return await this.staffSurveyService.getBatchList();
  }

  @Query(() => [String])
  async getSurveySemesterList() {
    return await this.staffSurveyService.getSemesterList();
  }

  @Query(() => [PointByCategoryDTO])
  async getPointsByCategory(
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('showUnit', { type: () => Boolean, nullable: true })
    showUnit?: boolean,
  ) {
    return await this.staffSurveyService.getPointsByCategory(
      semester,
      showUnit,
    );
  }

  @Query(() => [PointByCategoryDTO])
  async getPointsByCategoryDonVi(
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
  ) {
    return await this.staffSurveyService.getPointsByCategoryDonVi(semester);
  }

  @Query(() => [StaffSurveyPointByYearDTO])
  async getStaffSurveyPointsByYear() {
    return await this.staffSurveyService.getStaffSurveyPointsByYear();
  }

  @Query(() => [StaffSurveyPointByCategoryAndYearDTO])
  async getStaffSurveyPointsByCategoryAndYear() {
    return await this.staffSurveyService.getStaffSurveyPointsByCategoryAndYear();
  }

  @Query(() => [PointByCriteriaDTO])
  async getPointsByCriteria(
    @Args('category', { type: () => String, nullable: true }) category?: string,
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('displayName', { type: () => String, nullable: true })
    displayName?: string,
  ) {
    return await this.staffSurveyService.getPointsByCriteria(
      category,
      semester,
      displayName,
    );
  }

  @Query(() => StaffSurveyPointResponseDTO)
  async getPointWithCommentByCriteria(
    @Args() { pagination }: QueryArgs,
    @Args('category', { type: () => String, nullable: true }) category?: string,
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('displayName', { type: () => String, nullable: true })
    displayName?: string,
  ) {
    return await this.staffSurveyService.getPointWithCommentByCriteria(
      category,
      pagination,
      semester,
      displayName,
    );
  }

  @Query(() => Int)
  async getStaffSurveyCommentCount(
    @Args('category', { type: () => String, nullable: true }) category?: string,
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('displayName', { type: () => String, nullable: true })
    displayName?: string,
  ) {
    return await this.staffSurveyService.getPointWithCommentByCriteriaCount(
      category,
      semester,
      displayName,
    );
  }

  @Query(() => StaffSurveyPointResponseDTO)
  async getAllComments(
    @Args() { pagination }: QueryArgs,
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('keyword', { type: () => String, nullable: true }) keyword?: string,
    @Args('type', { type: () => [String], nullable: true }) type?: string[],
    @Args('topic', { type: () => [String], nullable: true }) topic?: string[],
  ) {
    return await this.staffSurveyService.getAllComments(
      pagination,
      semester,
      keyword,
      type,
      topic,
    );
  }

  @Query(() => Int)
  async getAllCommentsCount(
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('keyword', { type: () => String, nullable: true }) keyword?: string,
    @Args('type', { type: () => [String], nullable: true }) type?: string[],
    @Args('topic', { type: () => [String], nullable: true }) topic?: string[],
  ) {
    return await this.staffSurveyService.getAllCommentsCount(semester, keyword, type, topic);
  }

  @Query(() => CommentQuantity, { name: 'staffSurveyCommentQuantity' })
  async getStaffSurveyCommentQuantity(
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('type', { type: () => String, nullable: true }) type?: string,
    @Args('topic', { type: () => String, nullable: true }) topic?: string,
  ) {
    return await this.staffSurveyService.getStaffSurveyCommentQuantity(semester, type, topic);
  }

  @Query(() => [CommentStatisticData], { name: 'staffSurveyCommentStatistics' })
  async getStaffSurveyCommentStatistics(
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
    @Args('type', { type: () => [String], nullable: true }) type?: string[],
    @Args('topic', { type: () => [String], nullable: true }) topic?: string[],
  ) {
    return await this.staffSurveyService.getStaffSurveyCommentStatistics(semester, type, topic);
  }

  @Query(() => [StaffSurveyAdditionalCommentDTO])
  async getAdditionalComments(
    @Args('semester', { type: () => String, nullable: true }) semester?: string,
  ) {
    return await this.staffSurveyService.getAdditionalComments(semester);
  }

  @Mutation(() => StaffSurveyCriteria)
  async updateStaffSurveyCriteria(
    @Args('id', { type: () => String }) id: string,
    @Args('is_shown', { type: () => Boolean }) is_shown: boolean,
  ) {
    return await this.staffSurveyService.updateCriteria(id, is_shown);
  }
}
