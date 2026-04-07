import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AdminSetting = {
  __typename?: 'AdminSetting';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type AuthDto = {
  __typename?: 'AuthDto';
  access_token: Scalars['String']['output'];
  user: UserEntity;
};

export type AutoMappingSuggestion = {
  __typename?: 'AutoMappingSuggestion';
  criteriaIds: Array<Scalars['ID']['output']>;
  display_name: Scalars['String']['output'];
  semesters: Array<Scalars['String']['output']>;
  staffSurveyCriteriaIds: Array<Scalars['ID']['output']>;
};

export type AutoMappingSuggestionInput = {
  criteriaIds: Array<Scalars['ID']['input']>;
  display_name: Scalars['String']['input'];
  staffSurveyCriteriaIds: Array<Scalars['ID']['input']>;
};

export type Class = {
  __typename?: 'Class';
  class_id: Scalars['String']['output'];
  class_type: Scalars['String']['output'];
  display_name: Scalars['String']['output'];
  lecturer: Lecturer;
  lecturer_1?: Maybe<Lecturer>;
  lecturer_2?: Maybe<Lecturer>;
  participating_student?: Maybe<Scalars['Int']['output']>;
  points: Array<GroupedPoint>;
  program: Scalars['String']['output'];
  semester: Semester;
  subject: Subject;
  total_student?: Maybe<Scalars['Int']['output']>;
};


export type ClassPointsArgs = {
  class_id?: InputMaybe<Scalars['String']['input']>;
  class_type?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Comment = {
  __typename?: 'Comment';
  class?: Maybe<Class>;
  comment_id: Scalars['String']['output'];
  display_name: Scalars['String']['output'];
  topic: Scalars['String']['output'];
  type: Scalars['String']['output'];
  type_list: Array<Scalars['String']['output']>;
};

export type CommentQuantity = {
  __typename?: 'CommentQuantity';
  quantity: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type CrawlApiRequestLog = {
  __typename?: 'CrawlApiRequestLog';
  crawl_job_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  duration_ms?: Maybe<Scalars['Int']['output']>;
  error_message?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  request_headers?: Maybe<Scalars['JSON']['output']>;
  request_method: Scalars['String']['output'];
  request_params?: Maybe<Scalars['JSON']['output']>;
  request_url: Scalars['String']['output'];
  response_body?: Maybe<Scalars['JSON']['output']>;
  response_headers?: Maybe<Scalars['JSON']['output']>;
  response_status_code?: Maybe<Scalars['Int']['output']>;
};

export type CrawlJob = {
  __typename?: 'CrawlJob';
  completed_at?: Maybe<Scalars['DateTime']['output']>;
  crawl_job_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by?: Maybe<Scalars['String']['output']>;
  detail_progress?: Maybe<Scalars['Int']['output']>;
  detail_total?: Maybe<Scalars['Int']['output']>;
  error_message?: Maybe<Scalars['String']['output']>;
  last_activity_at?: Maybe<Scalars['DateTime']['output']>;
  parameters?: Maybe<Scalars['JSON']['output']>;
  progress?: Maybe<Scalars['Int']['output']>;
  started_at?: Maybe<Scalars['DateTime']['output']>;
  status: CrawlJobStatus;
  summary?: Maybe<Scalars['JSON']['output']>;
  total_data?: Maybe<Scalars['Int']['output']>;
  type: CrawlJobType;
};

export type CrawlJobLog = {
  __typename?: 'CrawlJobLog';
  api_log_id?: Maybe<Scalars['String']['output']>;
  crawl_job_id: Scalars['String']['output'];
  duration_ms?: Maybe<Scalars['Int']['output']>;
  endpoint: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  method: Scalars['String']['output'];
  service: Scalars['String']['output'];
  status_code?: Maybe<Scalars['Int']['output']>;
  timestamp: Scalars['DateTime']['output'];
};

/** Status of a crawl job */
export enum CrawlJobStatus {
  Abandoned = 'ABANDONED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING'
}

/** Type of crawl job */
export enum CrawlJobType {
  AggregatePoints = 'AGGREGATE_POINTS',
  LecturerSurvey = 'LECTURER_SURVEY',
  StaffSurvey = 'STAFF_SURVEY',
  SubjectSurvey = 'SUBJECT_SURVEY',
  TransferData = 'TRANSFER_DATA'
}

export type CrawlStagingData = {
  __typename?: 'CrawlStagingData';
  crawl_job_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  data_type: Scalars['String']['output'];
  id: Scalars['String']['output'];
  key?: Maybe<Scalars['String']['output']>;
};

export type CrawlStagingDataSummary = {
  __typename?: 'CrawlStagingDataSummary';
  byType: Array<StagingDataTypeCount>;
  totalRecords: Scalars['Int']['output'];
};

export type Criteria = {
  __typename?: 'Criteria';
  criteria_id: Scalars['String']['output'];
  display_name: Scalars['String']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  is_shown: Scalars['Boolean']['output'];
  mapping?: Maybe<CriteriaMapping>;
  mapping_id?: Maybe<Scalars['String']['output']>;
  semester: Array<Semester>;
  semester_id?: Maybe<Scalars['String']['output']>;
  type: Array<CriteriaProperty>;
};

export type CriteriaMapping = {
  __typename?: 'CriteriaMapping';
  criteria?: Maybe<Array<Criteria>>;
  display_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  raw_display_names: Array<Scalars['String']['output']>;
  staffSurveyCriteria?: Maybe<Array<StaffSurveyCriteria>>;
};

export type CriteriaProperty = {
  __typename?: 'CriteriaProperty';
  class_type: Scalars['String']['output'];
  num: Scalars['Int']['output'];
};

export type Faculty = {
  __typename?: 'Faculty';
  display_name: Scalars['String']['output'];
  faculty_id: Scalars['String']['output'];
  full_name?: Maybe<Scalars['String']['output']>;
  is_displayed?: Maybe<Scalars['Boolean']['output']>;
  lecturers?: Maybe<PaginatedLecturer>;
  points?: Maybe<PaginatedGroupedPoint>;
  subjects?: Maybe<PaginatedSubject>;
  total_point?: Maybe<GroupedPoint>;
};


export type FacultyLecturersArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type FacultyPointsArgs = {
  class_id?: InputMaybe<Scalars['String']['input']>;
  class_type?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type FacultySubjectsArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type FacultyTotal_PointArgs = {
  class_id?: InputMaybe<Scalars['String']['input']>;
  class_type?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FilterArgs = {
  class_id?: InputMaybe<Scalars['String']['input']>;
  class_type?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GroupedPoint = {
  __typename?: 'GroupedPoint';
  average_point: Scalars['Float']['output'];
  class_num: Scalars['Int']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  max_point?: Maybe<Scalars['Float']['output']>;
  median_point?: Maybe<Scalars['Float']['output']>;
  point?: Maybe<Scalars['Float']['output']>;
  trimmed_mean_point?: Maybe<Scalars['Float']['output']>;
};

export type Lecturer = {
  __typename?: 'Lecturer';
  birth_date?: Maybe<Scalars['DateTime']['output']>;
  classes: PaginatedClass;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  faculty: Faculty;
  faculty_id?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Boolean']['output']>;
  learning?: Maybe<Scalars['String']['output']>;
  learning_position?: Maybe<Scalars['String']['output']>;
  lecturer_id: Scalars['String']['output'];
  mscb?: Maybe<Scalars['Int']['output']>;
  ngach?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  points: Array<GroupedPoint>;
  position?: Maybe<Scalars['String']['output']>;
  total_point?: Maybe<Scalars['Float']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};


export type LecturerClassesArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type LecturerPointsArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};

export type LecturerRankingItem = {
  __typename?: 'LecturerRankingItem';
  avg_point: Scalars['Float']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  faculty_id?: Maybe<Scalars['String']['output']>;
  faculty_name?: Maybe<Scalars['String']['output']>;
  lecturer_id: Scalars['String']['output'];
  previous_rank?: Maybe<Scalars['Int']['output']>;
  rank: Scalars['Int']['output'];
  taught_subjects?: Maybe<Array<LecturerRankingSubject>>;
  total_classes: Scalars['Int']['output'];
  total_subjects: Scalars['Int']['output'];
};

export type LecturerRankingResult = {
  __typename?: 'LecturerRankingResult';
  items: Array<LecturerRankingItem>;
};

export type LecturerRankingSubject = {
  __typename?: 'LecturerRankingSubject';
  display_name?: Maybe<Scalars['String']['output']>;
  subject_id: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Hủy bỏ dữ liệu tạm */
  abandonCrawlJob: CrawlJob;
  /** Add new staff survey data */
  addListStaffSurveyData: Array<StaffSurveySheet>;
  /** Add new staff survey data */
  addNewStaffSurveyData: StaffSurveySheet;
  /** Thêm cấu hình khảo sát mới */
  addSurveyListConfig: SurveyListConfig;
  confirmAutoMapping: Scalars['Boolean']['output'];
  /** Xác nhận dữ liệu → đưa vào database chính */
  confirmCrawlJob: CrawlJob;
  createCriteriaMapping: CriteriaMapping;
  deleteCriteriaMapping: Scalars['Boolean']['output'];
  /** Xóa cấu hình khảo sát */
  deleteSurveyListConfig: Scalars['Boolean']['output'];
  login: AuthDto;
  loginIntegration: AuthDto;
  mapCriteriaToGroup: CriteriaMapping;
  registerUser: UserEntity;
  removeUser: Scalars['Boolean']['output'];
  /** Chạy tổng hợp điểm */
  runAggregatePoints: CrawlJob;
  /** Chạy thu thập KS Giảng viên */
  runCrawlLecturerSurvey: CrawlJob;
  /** Chạy thu thập KS CBNV */
  runCrawlStaffSurvey: CrawlJob;
  /** Chạy thu thập KS Môn học */
  runCrawlSubjectSurvey: CrawlJob;
  /** Chạy chuyển dữ liệu giữa các database */
  runTransferData: CrawlJob;
  stopCrawlJob: CrawlJob;
  unmapCriteria: Scalars['Boolean']['output'];
  updateCriteriaMapping: CriteriaMapping;
  updateSetting: AdminSetting;
  updateStaffSurveyCriteria: StaffSurveyCriteria;
  /** Cập nhật cấu hình khảo sát */
  updateSurveyListConfig: SurveyListConfig;
  updateUser: UserEntity;
};


export type MutationAbandonCrawlJobArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationAddListStaffSurveyDataArgs = {
  data: Array<StaffSurveySheetDto>;
};


export type MutationAddNewStaffSurveyDataArgs = {
  data: StaffSurveySheetDto;
};


export type MutationAddSurveyListConfigArgs = {
  input: SurveyListConfigInput;
};


export type MutationConfirmAutoMappingArgs = {
  suggestions: Array<AutoMappingSuggestionInput>;
};


export type MutationConfirmCrawlJobArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationCreateCriteriaMappingArgs = {
  display_name: Scalars['String']['input'];
};


export type MutationDeleteCriteriaMappingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSurveyListConfigArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationLoginIntegrationArgs = {
  token: Scalars['String']['input'];
};


export type MutationMapCriteriaToGroupArgs = {
  criteriaIds: Array<Scalars['ID']['input']>;
  mappingId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  user: UserDto;
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationRunCrawlLecturerSurveyArgs = {
  semester?: InputMaybe<Scalars['String']['input']>;
  surveyConfigIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationRunCrawlStaffSurveyArgs = {
  year?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRunCrawlSubjectSurveyArgs = {
  semester?: InputMaybe<Scalars['String']['input']>;
  surveyConfigIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationStopCrawlJobArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationUnmapCriteriaArgs = {
  criteriaIds: Array<Scalars['ID']['input']>;
  type: Scalars['String']['input'];
};


export type MutationUpdateCriteriaMappingArgs = {
  display_name: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateSettingArgs = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type MutationUpdateStaffSurveyCriteriaArgs = {
  id: Scalars['String']['input'];
  is_shown: Scalars['Boolean']['input'];
};


export type MutationUpdateSurveyListConfigArgs = {
  id: Scalars['String']['input'];
  input: SurveyListConfigInput;
};


export type MutationUpdateUserArgs = {
  user: UpdateUserDto;
};

export type PaginatedClass = {
  __typename?: 'PaginatedClass';
  data: Array<Class>;
  meta: PaginatedMetaData;
};

export type PaginatedComment = {
  __typename?: 'PaginatedComment';
  data: Array<Comment>;
  meta: PaginatedMetaData;
};

export type PaginatedCriteria = {
  __typename?: 'PaginatedCriteria';
  data: Array<Criteria>;
  meta: PaginatedMetaData;
};

export type PaginatedFaculty = {
  __typename?: 'PaginatedFaculty';
  data: Array<Faculty>;
  meta: PaginatedMetaData;
};

export type PaginatedGroupedPoint = {
  __typename?: 'PaginatedGroupedPoint';
  data: Array<GroupedPoint>;
  meta: PaginatedMetaData;
};

export type PaginatedLecturer = {
  __typename?: 'PaginatedLecturer';
  data: Array<Lecturer>;
  meta: PaginatedMetaData;
};

export type PaginatedMetaData = {
  __typename?: 'PaginatedMetaData';
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  total_item: Scalars['Int']['output'];
  total_page: Scalars['Int']['output'];
};

export type PaginatedSubject = {
  __typename?: 'PaginatedSubject';
  data: Array<Subject>;
  meta: PaginatedMetaData;
};

export type PaginationArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type PointByCategoryDto = {
  __typename?: 'PointByCategoryDTO';
  avg_point: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  is_unit?: Maybe<Scalars['Boolean']['output']>;
};

export type PointByCriteriaDto = {
  __typename?: 'PointByCriteriaDTO';
  avg_point: Scalars['Float']['output'];
  criteria: Scalars['String']['output'];
  index: Scalars['Float']['output'];
};

export type Program = {
  __typename?: 'Program';
  program: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** View particular class information */
  class?: Maybe<Class>;
  /** List all classes */
  classes: PaginatedClass;
  /** View particular comment information */
  comment?: Maybe<Comment>;
  commentQuantity: CommentQuantity;
  /** List all comments */
  comments: PaginatedComment;
  /** Lấy chi tiết một cuộc gọi API qua ID */
  crawlApiRequestLog?: Maybe<CrawlApiRequestLog>;
  /** Lấy log chi tiết cuộc gọi API */
  crawlApiRequestLogs: Array<CrawlApiRequestLog>;
  /** Lấy thông tin chi tiết một job */
  crawlJob?: Maybe<CrawlJob>;
  /** Lấy danh sách log của một job */
  crawlJobLogs: Array<CrawlJobLog>;
  /** Lấy danh sách các job thu thập dữ liệu */
  crawlJobs: Array<CrawlJob>;
  /** Lấy dữ liệu tạm chi tiết */
  crawlStagingData: Array<CrawlStagingData>;
  /** Thông tin tổng hợp dữ liệu tạm */
  crawlStagingDataSummary: CrawlStagingDataSummary;
  criteria?: Maybe<Criteria>;
  criterias: PaginatedCriteria;
  currentUser: UserEntity;
  /** List all faculty available */
  faculties: PaginatedFaculty;
  /** Get detail information of a faculty and its lecturer list */
  faculty?: Maybe<Faculty>;
  getAdditionalComments: Array<StaffSurveyAdditionalCommentDto>;
  getAllComments: StaffSurveyPointResponseDto;
  getAllCommentsCount: Scalars['Int']['output'];
  getAutoMappingSuggestions: Array<AutoMappingSuggestion>;
  getBatchList: Array<StaffSurveyBatch>;
  getCriteriaList: Array<StaffSurveyCriteria>;
  getCriteriaMapping: CriteriaMapping;
  getCriteriaMappings: Array<CriteriaMapping>;
  getPointWithCommentByCriteria: StaffSurveyPointResponseDto;
  getPointsByCategory: Array<PointByCategoryDto>;
  getPointsByCategoryDonVi: Array<PointByCategoryDto>;
  getPointsByCriteria: Array<PointByCriteriaDto>;
  getSetting: AdminSetting;
  getStaffSurveyCommentCount: Scalars['Int']['output'];
  getStaffSurveyPointsByCategoryAndYear: Array<StaffSurveyPointByCategoryAndYearDto>;
  getStaffSurveyPointsByYear: Array<StaffSurveyPointByYearDto>;
  getSurveySemesterList: Array<Scalars['String']['output']>;
  /** List all points, group by a specific entity */
  groupedPoints: PaginatedGroupedPoint;
  /** View detail information of a specific lecturer */
  lecturer?: Maybe<Lecturer>;
  /** Get ranked lecturers by average point with rank change from previous year */
  lecturerRanking: LecturerRankingResult;
  /** List all lecturer */
  lecturers: PaginatedLecturer;
  profile: UserEntity;
  programs: Array<Program>;
  /** Tìm kiếm danh sách survey từ API của trường */
  searchExternalSurveys: Scalars['JSON']['output'];
  /** List all semester */
  semesters?: Maybe<Array<Semester>>;
  subject?: Maybe<Subject>;
  subjects: PaginatedSubject;
  /** Lấy lịch sử crawl của các survey config */
  surveyCrawlHistory: Array<SurveyCrawlHistory>;
  /** Lấy danh sách cấu hình khảo sát */
  surveyListConfigs: Array<SurveyListConfig>;
  users: Array<UserEntity>;
};


export type QueryClassArgs = {
  id: Scalars['String']['input'];
};


export type QueryClassesArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type QueryCommentArgs = {
  id: Scalars['String']['input'];
};


export type QueryCommentQuantityArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
  topic?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCommentsArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
  topic?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryCrawlApiRequestLogArgs = {
  id: Scalars['String']['input'];
};


export type QueryCrawlApiRequestLogsArgs = {
  jobId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryCrawlJobArgs = {
  id: Scalars['String']['input'];
};


export type QueryCrawlJobLogsArgs = {
  jobId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryCrawlJobsArgs = {
  type?: InputMaybe<CrawlJobType>;
};


export type QueryCrawlStagingDataArgs = {
  dataType?: InputMaybe<Scalars['String']['input']>;
  jobId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryCrawlStagingDataSummaryArgs = {
  jobId: Scalars['String']['input'];
};


export type QueryCriteriaArgs = {
  id: Scalars['String']['input'];
};


export type QueryCriteriasArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type QueryFacultiesArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type QueryFacultyArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAdditionalCommentsArgs = {
  semester?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllCommentsArgs = {
  filter?: InputMaybe<FilterArgs>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationArgs>;
  semester?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortArgs>;
};


export type QueryGetAllCommentsCountArgs = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  semester?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCriteriaMappingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPointWithCommentByCriteriaArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  semester?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortArgs>;
};


export type QueryGetPointsByCategoryArgs = {
  semester?: InputMaybe<Scalars['String']['input']>;
  showUnit?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetPointsByCategoryDonViArgs = {
  semester?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetPointsByCriteriaArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  semester?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSettingArgs = {
  key: Scalars['String']['input'];
};


export type QueryGetStaffSurveyCommentCountArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  semester?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGroupedPointsArgs = {
  class_id?: InputMaybe<Scalars['String']['input']>;
  class_type?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  groupEntity?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryLecturerArgs = {
  id: Scalars['String']['input'];
};


export type QueryLecturerRankingArgs = {
  filter?: InputMaybe<FilterArgs>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  minClasses?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLecturersArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type QuerySearchExternalSurveysArgs = {
  direction?: Scalars['String']['input'];
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  order?: Scalars['String']['input'];
  page?: Scalars['Int']['input'];
};


export type QuerySubjectArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubjectsArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};


export type QuerySurveyCrawlHistoryArgs = {
  jobId?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  surveyConfigId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySurveyListConfigsArgs = {
  type?: InputMaybe<CrawlJobType>;
};


export type QueryUsersArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum Role {
  Admin = 'ADMIN',
  Faculty = 'FACULTY',
  FullAccess = 'FULL_ACCESS',
  Lecturer = 'LECTURER'
}

export type Semester = {
  __typename?: 'Semester';
  display_name: Scalars['String']['output'];
  search_string?: Maybe<Scalars['String']['output']>;
  semester_id: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type SortArgs = {
  isAscending?: InputMaybe<Scalars['Boolean']['input']>;
  sortField?: InputMaybe<SortFieldArgs>;
};

export type SortFieldArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  type?: Scalars['String']['input'];
};

export type StaffSurveyAdditionalCommentDto = {
  __typename?: 'StaffSurveyAdditionalCommentDTO';
  additional_comment?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  faculty?: Maybe<Scalars['String']['output']>;
};

export type StaffSurveyBatch = {
  __typename?: 'StaffSurveyBatch';
  display_name?: Maybe<Scalars['String']['output']>;
  semester?: Maybe<Scalars['String']['output']>;
  staff_survey_batch_id: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type StaffSurveyCriteria = {
  __typename?: 'StaffSurveyCriteria';
  category: Scalars['String']['output'];
  display_name: Scalars['String']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  is_point_aggregated: Scalars['Boolean']['output'];
  is_shown: Scalars['Boolean']['output'];
  mapping?: Maybe<CriteriaMapping>;
  mapping_id?: Maybe<Scalars['String']['output']>;
  semesters: Array<Scalars['String']['output']>;
  staff_survey_criteria_id: Scalars['String']['output'];
};

export type StaffSurveyPointByCategoryAndYearDto = {
  __typename?: 'StaffSurveyPointByCategoryAndYearDTO';
  avg_point: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  year: Scalars['String']['output'];
};

export type StaffSurveyPointByYearDto = {
  __typename?: 'StaffSurveyPointByYearDTO';
  avg_point: Scalars['Float']['output'];
  year: Scalars['String']['output'];
};

export type StaffSurveyPointDto = {
  comment?: InputMaybe<Scalars['String']['input']>;
  criteria_category?: InputMaybe<Scalars['String']['input']>;
  criteria_index?: InputMaybe<Scalars['Int']['input']>;
  criteria_name?: InputMaybe<Scalars['String']['input']>;
  max_point: Scalars['Int']['input'];
  point: Scalars['Int']['input'];
};

export type StaffSurveyPointResponseDto = {
  __typename?: 'StaffSurveyPointResponseDTO';
  data: Array<StaffSurveyPointResponseItemDto>;
  meta: PaginatedMetaData;
};

export type StaffSurveyPointResponseItemDto = {
  __typename?: 'StaffSurveyPointResponseItemDTO';
  comment?: Maybe<Scalars['String']['output']>;
  criteria: Scalars['String']['output'];
  index: Scalars['Float']['output'];
  point: Scalars['Int']['output'];
};

export type StaffSurveySheet = {
  __typename?: 'StaffSurveySheet';
  academic_degree?: Maybe<Scalars['String']['output']>;
  academic_title?: Maybe<Scalars['String']['output']>;
  additional_comment?: Maybe<Scalars['String']['output']>;
  batch?: Maybe<StaffSurveyBatch>;
  birth?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  faculty?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Boolean']['output']>;
  mscb?: Maybe<Scalars['String']['output']>;
  staff_survey_sheet_id: Scalars['String']['output'];
};

export type StaffSurveySheetDto = {
  academic_degree?: InputMaybe<Scalars['String']['input']>;
  academic_title?: InputMaybe<Scalars['String']['input']>;
  additional_comment?: InputMaybe<Scalars['String']['input']>;
  birth?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  faculty?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['Boolean']['input']>;
  mscb?: InputMaybe<Scalars['String']['input']>;
  points: Array<StaffSurveyPointDto>;
  semester?: InputMaybe<Scalars['String']['input']>;
  survey_name?: InputMaybe<Scalars['String']['input']>;
};

export type StagingDataTypeCount = {
  __typename?: 'StagingDataTypeCount';
  count: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type Subject = {
  __typename?: 'Subject';
  display_name?: Maybe<Scalars['String']['output']>;
  faculty?: Maybe<Faculty>;
  faculty_id?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Array<GroupedPoint>>;
  subject_id: Scalars['String']['output'];
  total_point?: Maybe<Scalars['Float']['output']>;
};


export type SubjectPointsArgs = {
  filter?: InputMaybe<FilterArgs>;
  pagination?: InputMaybe<PaginationArgs>;
  sort?: InputMaybe<SortArgs>;
};

export type SurveyCrawlHistory = {
  __typename?: 'SurveyCrawlHistory';
  completed_at?: Maybe<Scalars['DateTime']['output']>;
  crawl_job_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  error_message?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  records_fetched: Scalars['Int']['output'];
  sid: Scalars['String']['output'];
  started_at: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  survey_list_config_id: Scalars['String']['output'];
};

export type SurveyListConfig = {
  __typename?: 'SurveyListConfig';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  is_active: Scalars['Boolean']['output'];
  last_crawled_at?: Maybe<Scalars['DateTime']['output']>;
  semester_name?: Maybe<Scalars['String']['output']>;
  semester_type?: Maybe<Scalars['String']['output']>;
  sid: Scalars['String']['output'];
  survey_type: CrawlJobType;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  year?: Maybe<Scalars['String']['output']>;
};

export type SurveyListConfigInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  semester_name?: InputMaybe<Scalars['String']['input']>;
  semester_type?: InputMaybe<Scalars['String']['input']>;
  sid: Scalars['String']['input'];
  survey_type: CrawlJobType;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserDto = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  facultyId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lastAccess?: InputMaybe<Scalars['DateTime']['input']>;
  lecturerId?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserDto = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  facultyId?: InputMaybe<Scalars['String']['input']>;
  lecturerId?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  role: Role;
  username: Scalars['String']['input'];
};

export type UserEntity = {
  __typename?: 'UserEntity';
  displayName: Scalars['String']['output'];
  faculty?: Maybe<Faculty>;
  id: Scalars['String']['output'];
  lastAccess?: Maybe<Scalars['DateTime']['output']>;
  lastSendEmail?: Maybe<Scalars['DateTime']['output']>;
  lecturer?: Maybe<Lecturer>;
  password?: Maybe<Scalars['String']['output']>;
  role: Role;
  username: Scalars['String']['output'];
};

export type GetAdditionalCommentsQueryVariables = Exact<{
  semester?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdditionalCommentsQuery = { __typename?: 'Query', getAdditionalComments: Array<{ __typename?: 'StaffSurveyAdditionalCommentDTO', additional_comment?: string | null, display_name?: string | null, faculty?: string | null }> };

export type GetSettingQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type GetSettingQuery = { __typename?: 'Query', getSetting: { __typename?: 'AdminSetting', key: string, value: string } };

export type UpdateSettingMutationVariables = Exact<{
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;


export type UpdateSettingMutation = { __typename?: 'Mutation', updateSetting: { __typename?: 'AdminSetting', key: string, value: string } };

export type AllClassesQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  sort?: InputMaybe<SortArgs>;
}>;


export type AllClassesQuery = { __typename?: 'Query', classes: { __typename?: 'PaginatedClass', data: Array<{ __typename?: 'Class', class_id: string, class_type: string, display_name: string, participating_student?: number | null, program: string, total_student?: number | null }> } };

export type DetailClassQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DetailClassQuery = { __typename?: 'Query', class?: { __typename?: 'Class', class_id: string, class_type: string, display_name: string, participating_student?: number | null, program: string, total_student?: number | null, lecturer: { __typename?: 'Lecturer', birth_date?: any | null, display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null }, subject: { __typename?: 'Subject', display_name?: string | null, faculty_id?: string | null, subject_id: string, total_point?: number | null, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null } | null }, semester: { __typename?: 'Semester', display_name: string, semester_id: string, type?: string | null, year?: string | null }, points: Array<{ __typename?: 'GroupedPoint', average_point: number, median_point?: number | null, trimmed_mean_point?: number | null, class_num: number, display_name?: string | null, id: string, max_point?: number | null, point?: number | null }> } | null };

export type CommentQuantityQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
}>;


export type CommentQuantityQuery = { __typename?: 'Query', positive: { __typename?: 'CommentQuantity', quantity: number, type: string }, negative: { __typename?: 'CommentQuantity', quantity: number, type: string }, neutral: { __typename?: 'CommentQuantity', quantity: number, type: string }, all: { __typename?: 'CommentQuantity', quantity: number, type: string } };

export type CommentQuantityEachTopicQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  type: Scalars['String']['input'];
}>;


export type CommentQuantityEachTopicQuery = { __typename?: 'Query', lecturer: { __typename?: 'CommentQuantity', quantity: number, type: string }, training_program: { __typename?: 'CommentQuantity', quantity: number, type: string }, facility: { __typename?: 'CommentQuantity', quantity: number, type: string }, others: { __typename?: 'CommentQuantity', quantity: number, type: string }, all: { __typename?: 'CommentQuantity', quantity: number, type: string } };

export type CommentListQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortArgs>;
  type?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  topic?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CommentListQuery = { __typename?: 'Query', comments: { __typename?: 'PaginatedComment', data: Array<{ __typename?: 'Comment', comment_id: string, display_name: string, type: string, type_list: Array<string>, topic: string, class?: { __typename?: 'Class', class_id: string, class_type: string, display_name: string, participating_student?: number | null, program: string, total_student?: number | null, lecturer: { __typename?: 'Lecturer', birth_date?: any | null, display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null }, subject: { __typename?: 'Subject', display_name?: string | null, faculty_id?: string | null, subject_id: string, total_point?: number | null, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null } | null }, semester: { __typename?: 'Semester', display_name: string, semester_id: string, type?: string | null, year?: string | null } } | null }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type GetCrawlJobsQueryVariables = Exact<{
  type?: InputMaybe<CrawlJobType>;
}>;


export type GetCrawlJobsQuery = { __typename?: 'Query', crawlJobs: Array<{ __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null, completed_at?: any | null, error_message?: string | null, summary?: any | null, parameters?: any | null, created_by?: string | null, created_at: any, progress?: number | null, total_data?: number | null, detail_progress?: number | null, detail_total?: number | null, last_activity_at?: any | null }> };

export type GetCrawlJobQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCrawlJobQuery = { __typename?: 'Query', crawlJob?: { __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null, completed_at?: any | null, error_message?: string | null, summary?: any | null, parameters?: any | null, created_by?: string | null, created_at: any, progress?: number | null, total_data?: number | null, detail_progress?: number | null, detail_total?: number | null, last_activity_at?: any | null } | null };

export type GetCrawlStagingDataQueryVariables = Exact<{
  jobId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  dataType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCrawlStagingDataQuery = { __typename?: 'Query', crawlStagingData: Array<{ __typename?: 'CrawlStagingData', id: string, data_type: string, data: any, created_at: any }> };

export type GetCrawlStagingDataSummaryQueryVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type GetCrawlStagingDataSummaryQuery = { __typename?: 'Query', crawlStagingDataSummary: { __typename?: 'CrawlStagingDataSummary', totalRecords: number, byType: Array<{ __typename?: 'StagingDataTypeCount', type: string, count: number }> } };

export type GetCrawlJobLogsQueryVariables = Exact<{
  jobId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCrawlJobLogsQuery = { __typename?: 'Query', crawlJobLogs: Array<{ __typename?: 'CrawlJobLog', id: string, timestamp: any, service: string, endpoint: string, method: string, status_code?: number | null, duration_ms?: number | null, error?: string | null, metadata?: any | null, api_log_id?: string | null }> };

export type GetCrawlApiRequestLogsQueryVariables = Exact<{
  jobId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCrawlApiRequestLogsQuery = { __typename?: 'Query', crawlApiRequestLogs: Array<{ __typename?: 'CrawlApiRequestLog', id: string, created_at: any, request_url: string, request_method: string, response_status_code?: number | null, duration_ms?: number | null, error_message?: string | null }> };

export type GetCrawlApiRequestLogQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCrawlApiRequestLogQuery = { __typename?: 'Query', crawlApiRequestLog?: { __typename?: 'CrawlApiRequestLog', id: string, created_at: any, request_url: string, request_method: string, request_params?: any | null, request_headers?: any | null, response_status_code?: number | null, response_body?: any | null, response_headers?: any | null, duration_ms?: number | null, error_message?: string | null } | null };

export type GetSurveyListConfigsQueryVariables = Exact<{
  type?: InputMaybe<CrawlJobType>;
}>;


export type GetSurveyListConfigsQuery = { __typename?: 'Query', surveyListConfigs: Array<{ __typename?: 'SurveyListConfig', id: string, survey_type: CrawlJobType, sid: string, title?: string | null, type?: string | null, year?: string | null, semester_type?: string | null, semester_name?: string | null, is_active: boolean, last_crawled_at?: any | null, created_at: any, updated_at: any }> };

export type RunCrawlSubjectSurveyMutationVariables = Exact<{
  semester?: InputMaybe<Scalars['String']['input']>;
  surveyConfigIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type RunCrawlSubjectSurveyMutation = { __typename?: 'Mutation', runCrawlSubjectSurvey: { __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null } };

export type RunCrawlLecturerSurveyMutationVariables = Exact<{
  semester?: InputMaybe<Scalars['String']['input']>;
  surveyConfigIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type RunCrawlLecturerSurveyMutation = { __typename?: 'Mutation', runCrawlLecturerSurvey: { __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null } };

export type RunCrawlStaffSurveyMutationVariables = Exact<{
  year?: InputMaybe<Scalars['String']['input']>;
}>;


export type RunCrawlStaffSurveyMutation = { __typename?: 'Mutation', runCrawlStaffSurvey: { __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null } };

export type RunAggregatePointsMutationVariables = Exact<{ [key: string]: never; }>;


export type RunAggregatePointsMutation = { __typename?: 'Mutation', runAggregatePoints: { __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null } };

export type RunTransferDataMutationVariables = Exact<{ [key: string]: never; }>;


export type RunTransferDataMutation = { __typename?: 'Mutation', runTransferData: { __typename?: 'CrawlJob', crawl_job_id: string, type: CrawlJobType, status: CrawlJobStatus, started_at?: any | null } };

export type ConfirmCrawlJobMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type ConfirmCrawlJobMutation = { __typename?: 'Mutation', confirmCrawlJob: { __typename?: 'CrawlJob', crawl_job_id: string, status: CrawlJobStatus } };

export type AbandonCrawlJobMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type AbandonCrawlJobMutation = { __typename?: 'Mutation', abandonCrawlJob: { __typename?: 'CrawlJob', crawl_job_id: string, status: CrawlJobStatus } };

export type StopCrawlJobMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type StopCrawlJobMutation = { __typename?: 'Mutation', stopCrawlJob: { __typename?: 'CrawlJob', crawl_job_id: string, status: CrawlJobStatus } };

export type AddSurveyListConfigMutationVariables = Exact<{
  input: SurveyListConfigInput;
}>;


export type AddSurveyListConfigMutation = { __typename?: 'Mutation', addSurveyListConfig: { __typename?: 'SurveyListConfig', id: string, survey_type: CrawlJobType, sid: string, title?: string | null, year?: string | null, is_active: boolean } };

export type UpdateSurveyListConfigMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: SurveyListConfigInput;
}>;


export type UpdateSurveyListConfigMutation = { __typename?: 'Mutation', updateSurveyListConfig: { __typename?: 'SurveyListConfig', id: string, survey_type: CrawlJobType, sid: string, title?: string | null, year?: string | null, is_active: boolean } };

export type DeleteSurveyListConfigMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteSurveyListConfigMutation = { __typename?: 'Mutation', deleteSurveyListConfig: boolean };

export type GetSurveyCrawlHistoryQueryVariables = Exact<{
  jobId?: InputMaybe<Scalars['String']['input']>;
  surveyConfigId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSurveyCrawlHistoryQuery = { __typename?: 'Query', surveyCrawlHistory: Array<{ __typename?: 'SurveyCrawlHistory', id: string, survey_list_config_id: string, crawl_job_id: string, sid: string, status: string, records_fetched: number, error_message?: string | null, started_at: any, completed_at?: any | null }> };

export type SearchExternalSurveysQueryVariables = Exact<{
  keyword?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchExternalSurveysQuery = { __typename?: 'Query', searchExternalSurveys: any };

export type GetCriteriaMappingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCriteriaMappingsQuery = { __typename?: 'Query', getCriteriaMappings: Array<{ __typename?: 'CriteriaMapping', id: string, display_name: string, criteria?: Array<{ __typename?: 'Criteria', criteria_id: string, display_name: string, semester_id?: string | null }> | null, staffSurveyCriteria?: Array<{ __typename?: 'StaffSurveyCriteria', staff_survey_criteria_id: string, display_name: string, category: string, semesters: Array<string> }> | null }> };

export type GetAutoMappingSuggestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAutoMappingSuggestionsQuery = { __typename?: 'Query', getAutoMappingSuggestions: Array<{ __typename?: 'AutoMappingSuggestion', display_name: string, criteriaIds: Array<string>, staffSurveyCriteriaIds: Array<string>, semesters: Array<string> }> };

export type CreateCriteriaMappingMutationVariables = Exact<{
  display_name: Scalars['String']['input'];
}>;


export type CreateCriteriaMappingMutation = { __typename?: 'Mutation', createCriteriaMapping: { __typename?: 'CriteriaMapping', id: string, display_name: string } };

export type UpdateCriteriaMappingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  display_name: Scalars['String']['input'];
}>;


export type UpdateCriteriaMappingMutation = { __typename?: 'Mutation', updateCriteriaMapping: { __typename?: 'CriteriaMapping', id: string, display_name: string } };

export type DeleteCriteriaMappingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCriteriaMappingMutation = { __typename?: 'Mutation', deleteCriteriaMapping: boolean };

export type MapCriteriaToGroupMutationVariables = Exact<{
  mappingId: Scalars['ID']['input'];
  criteriaIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  type: Scalars['String']['input'];
}>;


export type MapCriteriaToGroupMutation = { __typename?: 'Mutation', mapCriteriaToGroup: { __typename?: 'CriteriaMapping', id: string } };

export type UnmapCriteriaMutationVariables = Exact<{
  criteriaIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  type: Scalars['String']['input'];
}>;


export type UnmapCriteriaMutation = { __typename?: 'Mutation', unmapCriteria: boolean };

export type ConfirmAutoMappingMutationVariables = Exact<{
  suggestions: Array<AutoMappingSuggestionInput> | AutoMappingSuggestionInput;
}>;


export type ConfirmAutoMappingMutation = { __typename?: 'Mutation', confirmAutoMapping: boolean };

export type DetailCriteriaQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DetailCriteriaQuery = { __typename?: 'Query', criteria?: { __typename?: 'Criteria', criteria_id: string, display_name: string, index?: number | null, semester: Array<{ __typename?: 'Semester', display_name: string, semester_id: string, type?: string | null, year?: string | null }> } | null };

export type AllCriteriasQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
}>;


export type AllCriteriasQuery = { __typename?: 'Query', criterias: { __typename?: 'PaginatedCriteria', data: Array<{ __typename?: 'Criteria', display_name: string, criteria_id: string, mapping_id?: string | null, semester_id?: string | null, type: Array<{ __typename?: 'CriteriaProperty', class_type: string, num: number }> }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type CriteriasQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  isAscending?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CriteriasQuery = { __typename?: 'Query', criterias: { __typename?: 'PaginatedCriteria', data: Array<{ __typename?: 'Criteria', display_name: string, criteria_id: string, mapping_id?: string | null, semester_id?: string | null }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type OverallCriteriaPointsEachSemesterQueryVariables = Exact<{
  class_type?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type OverallCriteriaPointsEachSemesterQuery = { __typename?: 'Query', groupedPoints: { __typename?: 'PaginatedGroupedPoint', data: Array<{ __typename?: 'GroupedPoint', average_point: number, class_num: number, display_name?: string | null, id: string, max_point?: number | null, point?: number | null }> } };

export type FacultiesQueryVariables = Exact<{ [key: string]: never; }>;


export type FacultiesQuery = { __typename?: 'Query', faculties: { __typename?: 'PaginatedFaculty', data: Array<{ __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null }> } };

export type DetailFacultyQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DetailFacultyQuery = { __typename?: 'Query', faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null } | null };

export type DetailLecturerQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DetailLecturerQuery = { __typename?: 'Query', lecturer?: { __typename?: 'Lecturer', birth_date?: any | null, display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null, faculty: { __typename?: 'Faculty', display_name: string } } | null };

export type AllLecturersQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  sort?: InputMaybe<SortArgs>;
}>;


export type AllLecturersQuery = { __typename?: 'Query', lecturers: { __typename?: 'PaginatedLecturer', data: Array<{ __typename?: 'Lecturer', birth_date?: any | null, display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null, faculty: { __typename?: 'Faculty', display_name: string } }> } };

export type LecturerRankingQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  minClasses?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type LecturerRankingQuery = { __typename?: 'Query', lecturerRanking: { __typename?: 'LecturerRankingResult', items: Array<{ __typename?: 'LecturerRankingItem', rank: number, lecturer_id: string, display_name?: string | null, faculty_id?: string | null, faculty_name?: string | null, avg_point: number, total_subjects: number, total_classes: number, previous_rank?: number | null, taught_subjects?: Array<{ __typename?: 'LecturerRankingSubject', subject_id: string, display_name?: string | null }> | null }> } };

export type LecturerstWithPointsQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  sort?: InputMaybe<SortArgs>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type LecturerstWithPointsQuery = { __typename?: 'Query', lecturers: { __typename?: 'PaginatedLecturer', data: Array<{ __typename?: 'Lecturer', birth_date?: any | null, display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null, faculty: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null }, points: Array<{ __typename?: 'GroupedPoint', average_point: number, class_num: number, id: string, max_point?: number | null, point?: number | null, display_name?: string | null }> }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthDto', access_token: string, user: { __typename?: 'UserEntity', displayName: string, id: string, password?: string | null, role: Role, username: string, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null, is_displayed?: boolean | null } | null, lecturer?: { __typename?: 'Lecturer', display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null } | null } } };

export type LoginIntegrationMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type LoginIntegrationMutation = { __typename?: 'Mutation', loginIntegration: { __typename?: 'AuthDto', access_token: string, user: { __typename?: 'UserEntity', displayName: string, id: string, password?: string | null, role: Role, username: string, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null, is_displayed?: boolean | null } | null, lecturer?: { __typename?: 'Lecturer', display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null } | null } } };

export type PointsEachSemesterQueryVariables = Exact<{
  groupEntity: Scalars['String']['input'];
  class_type?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type PointsEachSemesterQuery = { __typename?: 'Query', groupedPoints: { __typename?: 'PaginatedGroupedPoint', data: Array<{ __typename?: 'GroupedPoint', average_point: number, median_point?: number | null, trimmed_mean_point?: number | null, class_num: number, display_name?: string | null, id: string, max_point?: number | null, point?: number | null }> } };

export type PointsWithGroupByQueryVariables = Exact<{
  groupEntity: Scalars['String']['input'];
  class_type?: InputMaybe<Scalars['String']['input']>;
  faculty_id?: InputMaybe<Scalars['String']['input']>;
  lecturer_id?: InputMaybe<Scalars['String']['input']>;
  criteria_id?: InputMaybe<Scalars['String']['input']>;
  semester_id?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type PointsWithGroupByQuery = { __typename?: 'Query', groupedPoints: { __typename?: 'PaginatedGroupedPoint', data: Array<{ __typename?: 'GroupedPoint', average_point: number, median_point?: number | null, trimmed_mean_point?: number | null, class_num: number, display_name?: string | null, id: string, max_point?: number | null, point?: number | null }> } };

export type ProgramsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProgramsQuery = { __typename?: 'Query', programs: Array<{ __typename?: 'Program', program: string }> };

export type SemestersQueryVariables = Exact<{ [key: string]: never; }>;


export type SemestersQuery = { __typename?: 'Query', semesters?: Array<{ __typename?: 'Semester', display_name: string, semester_id: string, type?: string | null, year?: string | null }> | null };

export type AddStaffSurveyDataMutationVariables = Exact<{
  data: StaffSurveySheetDto;
}>;


export type AddStaffSurveyDataMutation = { __typename?: 'Mutation', addNewStaffSurveyData: { __typename?: 'StaffSurveySheet', batch?: { __typename?: 'StaffSurveyBatch', display_name?: string | null, staff_survey_batch_id: string, updated_at?: any | null } | null } };

export type AddListStaffSurveyDataMutationVariables = Exact<{
  data: Array<StaffSurveySheetDto> | StaffSurveySheetDto;
}>;


export type AddListStaffSurveyDataMutation = { __typename?: 'Mutation', addListStaffSurveyData: Array<{ __typename?: 'StaffSurveySheet', batch?: { __typename?: 'StaffSurveyBatch', display_name?: string | null, staff_survey_batch_id: string, updated_at?: any | null } | null }> };

export type GetStaffSurveyCriteriaListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStaffSurveyCriteriaListQuery = { __typename?: 'Query', getCriteriaList: Array<{ __typename?: 'StaffSurveyCriteria', category: string, display_name: string, index?: number | null, semesters: Array<string>, staff_survey_criteria_id: string, mapping_id?: string | null, is_shown: boolean }> };

export type GetStaffSurveyBatchListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStaffSurveyBatchListQuery = { __typename?: 'Query', getBatchList: Array<{ __typename?: 'StaffSurveyBatch', display_name?: string | null, staff_survey_batch_id: string, updated_at?: any | null }> };

export type GetSurveySemesterListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSurveySemesterListQuery = { __typename?: 'Query', getSurveySemesterList: Array<string> };

export type GetPointsByCategoryQueryVariables = Exact<{
  semester?: InputMaybe<Scalars['String']['input']>;
  showUnit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetPointsByCategoryQuery = { __typename?: 'Query', getPointsByCategory: Array<{ __typename?: 'PointByCategoryDTO', avg_point: number, category: string, is_unit?: boolean | null }> };

export type GetPointsByCategoryDonViQueryVariables = Exact<{
  semester?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPointsByCategoryDonViQuery = { __typename?: 'Query', getPointsByCategoryDonVi: Array<{ __typename?: 'PointByCategoryDTO', avg_point: number, category: string }> };

export type GetPointsByCriteriaQueryVariables = Exact<{
  category: Scalars['String']['input'];
  semester?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPointsByCriteriaQuery = { __typename?: 'Query', getPointsByCriteria: Array<{ __typename?: 'PointByCriteriaDTO', avg_point: number, criteria: string, index: number }> };

export type GetPointWithCommentByCriteriaQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  semester?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPointWithCommentByCriteriaQuery = { __typename?: 'Query', getPointWithCommentByCriteria: { __typename?: 'StaffSurveyPointResponseDTO', data: Array<{ __typename?: 'StaffSurveyPointResponseItemDTO', criteria: string, index: number, point: number, comment?: string | null }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type GetStaffSurveyCommentCountQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  semester?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStaffSurveyCommentCountQuery = { __typename?: 'Query', getStaffSurveyCommentCount: number };

export type GetAllCommentsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  semester?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllCommentsQuery = { __typename?: 'Query', getAllComments: { __typename?: 'StaffSurveyPointResponseDTO', data: Array<{ __typename?: 'StaffSurveyPointResponseItemDTO', criteria: string, index: number, point: number, comment?: string | null }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type GetAllCommentsCountQueryVariables = Exact<{
  semester?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllCommentsCountQuery = { __typename?: 'Query', getAllCommentsCount: number };

export type GetStaffSurveyPointsByYearQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStaffSurveyPointsByYearQuery = { __typename?: 'Query', getStaffSurveyPointsByYear: Array<{ __typename?: 'StaffSurveyPointByYearDTO', avg_point: number, year: string }> };

export type GetStaffSurveyPointsByCategoryAndYearQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStaffSurveyPointsByCategoryAndYearQuery = { __typename?: 'Query', getStaffSurveyPointsByCategoryAndYear: Array<{ __typename?: 'StaffSurveyPointByCategoryAndYearDTO', avg_point: number, category: string, year: string }> };

export type UpdateStaffSurveyCriteriaMutationVariables = Exact<{
  id: Scalars['String']['input'];
  is_shown: Scalars['Boolean']['input'];
}>;


export type UpdateStaffSurveyCriteriaMutation = { __typename?: 'Mutation', updateStaffSurveyCriteria: { __typename?: 'StaffSurveyCriteria', staff_survey_criteria_id: string, is_shown: boolean } };

export type DetailSubjectQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DetailSubjectQuery = { __typename?: 'Query', subject?: { __typename?: 'Subject', display_name?: string | null, faculty_id?: string | null, subject_id: string, total_point?: number | null, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null, is_displayed?: boolean | null } | null } | null };

export type SubjectsQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  isAscending?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SubjectsQuery = { __typename?: 'Query', subjects: { __typename?: 'PaginatedSubject', data: Array<{ __typename?: 'Subject', display_name?: string | null, faculty_id?: string | null, subject_id: string, total_point?: number | null, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null } | null }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type AllSubjectsQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  sort?: InputMaybe<SortArgs>;
}>;


export type AllSubjectsQuery = { __typename?: 'Query', subjects: { __typename?: 'PaginatedSubject', data: Array<{ __typename?: 'Subject', display_name?: string | null, faculty_id?: string | null, subject_id: string, total_point?: number | null }> } };

export type SubjectsWithPointsQueryVariables = Exact<{
  filter?: InputMaybe<FilterArgs>;
  sort?: InputMaybe<SortArgs>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SubjectsWithPointsQuery = { __typename?: 'Query', subjects: { __typename?: 'PaginatedSubject', data: Array<{ __typename?: 'Subject', display_name?: string | null, faculty_id?: string | null, subject_id: string, total_point?: number | null, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null } | null, points?: Array<{ __typename?: 'GroupedPoint', average_point: number, class_num: number, id: string, max_point?: number | null, point?: number | null, display_name?: string | null }> | null }>, meta: { __typename?: 'PaginatedMetaData', hasNext: boolean, hasPrev: boolean, page: number, size: number, total_item: number, total_page: number } } };

export type UsersQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UserEntity', displayName: string, id: string, password?: string | null, role: Role, username: string, lastAccess?: any | null, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null, is_displayed?: boolean | null } | null, lecturer?: { __typename?: 'Lecturer', birth_date?: any | null, display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null } | null }> };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', profile: { __typename?: 'UserEntity', displayName: string, id: string, password?: string | null, role: Role, username: string, faculty?: { __typename?: 'Faculty', display_name: string, faculty_id: string, full_name?: string | null, is_displayed?: boolean | null } | null, lecturer?: { __typename?: 'Lecturer', display_name?: string | null, email?: string | null, faculty_id?: string | null, gender?: boolean | null, learning?: string | null, learning_position?: string | null, lecturer_id: string, mscb?: number | null, ngach?: string | null, phone?: string | null, position?: string | null, total_point?: number | null, username?: string | null } | null } };

export type RegisterUserMutationVariables = Exact<{
  user: UserDto;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserEntity', displayName: string, id: string, password?: string | null, role: Role, username: string } };

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserDto;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserEntity', displayName: string, id: string, password?: string | null, role: Role, username: string } };

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveUserMutation = { __typename?: 'Mutation', removeUser: boolean };


export const GetAdditionalCommentsDocument = gql`
    query GetAdditionalComments($semester: String) {
  getAdditionalComments(semester: $semester) {
    additional_comment
    display_name
    faculty
  }
}
    `;

/**
 * __useGetAdditionalCommentsQuery__
 *
 * To run a query within a React component, call `useGetAdditionalCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdditionalCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdditionalCommentsQuery({
 *   variables: {
 *      semester: // value for 'semester'
 *   },
 * });
 */
export function useGetAdditionalCommentsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>(GetAdditionalCommentsDocument, options);
      }
export function useGetAdditionalCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>(GetAdditionalCommentsDocument, options);
        }
// @ts-ignore
export function useGetAdditionalCommentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>;
export function useGetAdditionalCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdditionalCommentsQuery | undefined, GetAdditionalCommentsQueryVariables>;
export function useGetAdditionalCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>(GetAdditionalCommentsDocument, options);
        }
export type GetAdditionalCommentsQueryHookResult = ReturnType<typeof useGetAdditionalCommentsQuery>;
export type GetAdditionalCommentsLazyQueryHookResult = ReturnType<typeof useGetAdditionalCommentsLazyQuery>;
export type GetAdditionalCommentsSuspenseQueryHookResult = ReturnType<typeof useGetAdditionalCommentsSuspenseQuery>;
export type GetAdditionalCommentsQueryResult = Apollo.QueryResult<GetAdditionalCommentsQuery, GetAdditionalCommentsQueryVariables>;
export function refetchGetAdditionalCommentsQuery(variables?: GetAdditionalCommentsQueryVariables) {
      return { query: GetAdditionalCommentsDocument, variables: variables }
    }
export const GetSettingDocument = gql`
    query GetSetting($key: String!) {
  getSetting(key: $key) {
    key
    value
  }
}
    `;

/**
 * __useGetSettingQuery__
 *
 * To run a query within a React component, call `useGetSettingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingQuery({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useGetSettingQuery(baseOptions: Apollo.QueryHookOptions<GetSettingQuery, GetSettingQueryVariables> & ({ variables: GetSettingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingQuery, GetSettingQueryVariables>(GetSettingDocument, options);
      }
export function useGetSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingQuery, GetSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingQuery, GetSettingQueryVariables>(GetSettingDocument, options);
        }
// @ts-ignore
export function useGetSettingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSettingQuery, GetSettingQueryVariables>): Apollo.UseSuspenseQueryResult<GetSettingQuery, GetSettingQueryVariables>;
export function useGetSettingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSettingQuery, GetSettingQueryVariables>): Apollo.UseSuspenseQueryResult<GetSettingQuery | undefined, GetSettingQueryVariables>;
export function useGetSettingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSettingQuery, GetSettingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSettingQuery, GetSettingQueryVariables>(GetSettingDocument, options);
        }
export type GetSettingQueryHookResult = ReturnType<typeof useGetSettingQuery>;
export type GetSettingLazyQueryHookResult = ReturnType<typeof useGetSettingLazyQuery>;
export type GetSettingSuspenseQueryHookResult = ReturnType<typeof useGetSettingSuspenseQuery>;
export type GetSettingQueryResult = Apollo.QueryResult<GetSettingQuery, GetSettingQueryVariables>;
export function refetchGetSettingQuery(variables: GetSettingQueryVariables) {
      return { query: GetSettingDocument, variables: variables }
    }
export const UpdateSettingDocument = gql`
    mutation UpdateSetting($key: String!, $value: String!) {
  updateSetting(key: $key, value: $value) {
    key
    value
  }
}
    `;
export type UpdateSettingMutationFn = Apollo.MutationFunction<UpdateSettingMutation, UpdateSettingMutationVariables>;

/**
 * __useUpdateSettingMutation__
 *
 * To run a mutation, you first call `useUpdateSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSettingMutation, { data, loading, error }] = useUpdateSettingMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSettingMutation, UpdateSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSettingMutation, UpdateSettingMutationVariables>(UpdateSettingDocument, options);
      }
export type UpdateSettingMutationHookResult = ReturnType<typeof useUpdateSettingMutation>;
export type UpdateSettingMutationResult = Apollo.MutationResult<UpdateSettingMutation>;
export type UpdateSettingMutationOptions = Apollo.BaseMutationOptions<UpdateSettingMutation, UpdateSettingMutationVariables>;
export const AllClassesDocument = gql`
    query AllClasses($filter: FilterArgs, $sort: SortArgs) {
  classes(filter: $filter, sort: $sort, pagination: {page: 0, size: 1000}) {
    data {
      class_id
      class_type
      display_name
      participating_student
      program
      total_student
    }
  }
}
    `;

/**
 * __useAllClassesQuery__
 *
 * To run a query within a React component, call `useAllClassesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllClassesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllClassesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useAllClassesQuery(baseOptions?: Apollo.QueryHookOptions<AllClassesQuery, AllClassesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllClassesQuery, AllClassesQueryVariables>(AllClassesDocument, options);
      }
export function useAllClassesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllClassesQuery, AllClassesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllClassesQuery, AllClassesQueryVariables>(AllClassesDocument, options);
        }
// @ts-ignore
export function useAllClassesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AllClassesQuery, AllClassesQueryVariables>): Apollo.UseSuspenseQueryResult<AllClassesQuery, AllClassesQueryVariables>;
export function useAllClassesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllClassesQuery, AllClassesQueryVariables>): Apollo.UseSuspenseQueryResult<AllClassesQuery | undefined, AllClassesQueryVariables>;
export function useAllClassesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllClassesQuery, AllClassesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllClassesQuery, AllClassesQueryVariables>(AllClassesDocument, options);
        }
export type AllClassesQueryHookResult = ReturnType<typeof useAllClassesQuery>;
export type AllClassesLazyQueryHookResult = ReturnType<typeof useAllClassesLazyQuery>;
export type AllClassesSuspenseQueryHookResult = ReturnType<typeof useAllClassesSuspenseQuery>;
export type AllClassesQueryResult = Apollo.QueryResult<AllClassesQuery, AllClassesQueryVariables>;
export function refetchAllClassesQuery(variables?: AllClassesQueryVariables) {
      return { query: AllClassesDocument, variables: variables }
    }
export const DetailClassDocument = gql`
    query DetailClass($id: String!) {
  class(id: $id) {
    class_id
    class_type
    display_name
    participating_student
    program
    total_student
    lecturer {
      birth_date
      display_name
      email
      faculty_id
      gender
      learning
      learning_position
      lecturer_id
      mscb
      ngach
      phone
      position
      total_point
      username
    }
    subject {
      display_name
      faculty_id
      subject_id
      total_point
      faculty {
        display_name
        faculty_id
        full_name
      }
    }
    semester {
      display_name
      semester_id
      type
      year
    }
    points {
      average_point
      median_point
      trimmed_mean_point
      class_num
      display_name
      id
      max_point
      point
    }
  }
}
    `;

/**
 * __useDetailClassQuery__
 *
 * To run a query within a React component, call `useDetailClassQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailClassQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailClassQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailClassQuery(baseOptions: Apollo.QueryHookOptions<DetailClassQuery, DetailClassQueryVariables> & ({ variables: DetailClassQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailClassQuery, DetailClassQueryVariables>(DetailClassDocument, options);
      }
export function useDetailClassLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailClassQuery, DetailClassQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailClassQuery, DetailClassQueryVariables>(DetailClassDocument, options);
        }
// @ts-ignore
export function useDetailClassSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DetailClassQuery, DetailClassQueryVariables>): Apollo.UseSuspenseQueryResult<DetailClassQuery, DetailClassQueryVariables>;
export function useDetailClassSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailClassQuery, DetailClassQueryVariables>): Apollo.UseSuspenseQueryResult<DetailClassQuery | undefined, DetailClassQueryVariables>;
export function useDetailClassSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailClassQuery, DetailClassQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DetailClassQuery, DetailClassQueryVariables>(DetailClassDocument, options);
        }
export type DetailClassQueryHookResult = ReturnType<typeof useDetailClassQuery>;
export type DetailClassLazyQueryHookResult = ReturnType<typeof useDetailClassLazyQuery>;
export type DetailClassSuspenseQueryHookResult = ReturnType<typeof useDetailClassSuspenseQuery>;
export type DetailClassQueryResult = Apollo.QueryResult<DetailClassQuery, DetailClassQueryVariables>;
export function refetchDetailClassQuery(variables: DetailClassQueryVariables) {
      return { query: DetailClassDocument, variables: variables }
    }
export const CommentQuantityDocument = gql`
    query CommentQuantity($filter: FilterArgs) {
  positive: commentQuantity(type: "positive", filter: $filter) {
    quantity
    type
  }
  negative: commentQuantity(type: "negative", filter: $filter) {
    quantity
    type
  }
  neutral: commentQuantity(type: "neutral", filter: $filter) {
    quantity
    type
  }
  all: commentQuantity(filter: $filter) {
    quantity
    type
  }
}
    `;

/**
 * __useCommentQuantityQuery__
 *
 * To run a query within a React component, call `useCommentQuantityQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentQuantityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentQuantityQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useCommentQuantityQuery(baseOptions?: Apollo.QueryHookOptions<CommentQuantityQuery, CommentQuantityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentQuantityQuery, CommentQuantityQueryVariables>(CommentQuantityDocument, options);
      }
export function useCommentQuantityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentQuantityQuery, CommentQuantityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentQuantityQuery, CommentQuantityQueryVariables>(CommentQuantityDocument, options);
        }
// @ts-ignore
export function useCommentQuantitySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CommentQuantityQuery, CommentQuantityQueryVariables>): Apollo.UseSuspenseQueryResult<CommentQuantityQuery, CommentQuantityQueryVariables>;
export function useCommentQuantitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentQuantityQuery, CommentQuantityQueryVariables>): Apollo.UseSuspenseQueryResult<CommentQuantityQuery | undefined, CommentQuantityQueryVariables>;
export function useCommentQuantitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentQuantityQuery, CommentQuantityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentQuantityQuery, CommentQuantityQueryVariables>(CommentQuantityDocument, options);
        }
export type CommentQuantityQueryHookResult = ReturnType<typeof useCommentQuantityQuery>;
export type CommentQuantityLazyQueryHookResult = ReturnType<typeof useCommentQuantityLazyQuery>;
export type CommentQuantitySuspenseQueryHookResult = ReturnType<typeof useCommentQuantitySuspenseQuery>;
export type CommentQuantityQueryResult = Apollo.QueryResult<CommentQuantityQuery, CommentQuantityQueryVariables>;
export function refetchCommentQuantityQuery(variables?: CommentQuantityQueryVariables) {
      return { query: CommentQuantityDocument, variables: variables }
    }
export const CommentQuantityEachTopicDocument = gql`
    query CommentQuantityEachTopic($filter: FilterArgs, $type: String!) {
  lecturer: commentQuantity(type: $type, topic: "lecturer", filter: $filter) {
    quantity
    type
  }
  training_program: commentQuantity(
    type: $type
    topic: "training_program"
    filter: $filter
  ) {
    quantity
    type
  }
  facility: commentQuantity(type: $type, topic: "facility", filter: $filter) {
    quantity
    type
  }
  others: commentQuantity(type: $type, topic: "others", filter: $filter) {
    quantity
    type
  }
  all: commentQuantity(filter: $filter) {
    quantity
    type
  }
}
    `;

/**
 * __useCommentQuantityEachTopicQuery__
 *
 * To run a query within a React component, call `useCommentQuantityEachTopicQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentQuantityEachTopicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentQuantityEachTopicQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCommentQuantityEachTopicQuery(baseOptions: Apollo.QueryHookOptions<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables> & ({ variables: CommentQuantityEachTopicQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>(CommentQuantityEachTopicDocument, options);
      }
export function useCommentQuantityEachTopicLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>(CommentQuantityEachTopicDocument, options);
        }
// @ts-ignore
export function useCommentQuantityEachTopicSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>): Apollo.UseSuspenseQueryResult<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>;
export function useCommentQuantityEachTopicSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>): Apollo.UseSuspenseQueryResult<CommentQuantityEachTopicQuery | undefined, CommentQuantityEachTopicQueryVariables>;
export function useCommentQuantityEachTopicSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>(CommentQuantityEachTopicDocument, options);
        }
export type CommentQuantityEachTopicQueryHookResult = ReturnType<typeof useCommentQuantityEachTopicQuery>;
export type CommentQuantityEachTopicLazyQueryHookResult = ReturnType<typeof useCommentQuantityEachTopicLazyQuery>;
export type CommentQuantityEachTopicSuspenseQueryHookResult = ReturnType<typeof useCommentQuantityEachTopicSuspenseQuery>;
export type CommentQuantityEachTopicQueryResult = Apollo.QueryResult<CommentQuantityEachTopicQuery, CommentQuantityEachTopicQueryVariables>;
export function refetchCommentQuantityEachTopicQuery(variables: CommentQuantityEachTopicQueryVariables) {
      return { query: CommentQuantityEachTopicDocument, variables: variables }
    }
export const CommentListDocument = gql`
    query CommentList($filter: FilterArgs, $page: Int, $sort: SortArgs, $type: [String!], $topic: [String!]) {
  comments(
    filter: $filter
    pagination: {page: $page}
    sort: $sort
    type: $type
    topic: $topic
  ) {
    data {
      comment_id
      display_name
      type
      type_list
      topic
      class {
        class_id
        class_type
        display_name
        participating_student
        program
        total_student
        lecturer {
          birth_date
          display_name
          email
          faculty_id
          gender
          learning
          learning_position
          lecturer_id
          mscb
          ngach
          phone
          position
          total_point
          username
        }
        subject {
          display_name
          faculty_id
          subject_id
          total_point
          faculty {
            display_name
            faculty_id
            full_name
          }
        }
        semester {
          display_name
          semester_id
          type
          year
        }
      }
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useCommentListQuery__
 *
 * To run a query within a React component, call `useCommentListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentListQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      page: // value for 'page'
 *      sort: // value for 'sort'
 *      type: // value for 'type'
 *      topic: // value for 'topic'
 *   },
 * });
 */
export function useCommentListQuery(baseOptions?: Apollo.QueryHookOptions<CommentListQuery, CommentListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentListQuery, CommentListQueryVariables>(CommentListDocument, options);
      }
export function useCommentListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentListQuery, CommentListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentListQuery, CommentListQueryVariables>(CommentListDocument, options);
        }
// @ts-ignore
export function useCommentListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CommentListQuery, CommentListQueryVariables>): Apollo.UseSuspenseQueryResult<CommentListQuery, CommentListQueryVariables>;
export function useCommentListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentListQuery, CommentListQueryVariables>): Apollo.UseSuspenseQueryResult<CommentListQuery | undefined, CommentListQueryVariables>;
export function useCommentListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentListQuery, CommentListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentListQuery, CommentListQueryVariables>(CommentListDocument, options);
        }
export type CommentListQueryHookResult = ReturnType<typeof useCommentListQuery>;
export type CommentListLazyQueryHookResult = ReturnType<typeof useCommentListLazyQuery>;
export type CommentListSuspenseQueryHookResult = ReturnType<typeof useCommentListSuspenseQuery>;
export type CommentListQueryResult = Apollo.QueryResult<CommentListQuery, CommentListQueryVariables>;
export function refetchCommentListQuery(variables?: CommentListQueryVariables) {
      return { query: CommentListDocument, variables: variables }
    }
export const GetCrawlJobsDocument = gql`
    query GetCrawlJobs($type: CrawlJobType) {
  crawlJobs(type: $type) {
    crawl_job_id
    type
    status
    started_at
    completed_at
    error_message
    summary
    parameters
    created_by
    created_at
    progress
    total_data
    detail_progress
    detail_total
    last_activity_at
  }
}
    `;

/**
 * __useGetCrawlJobsQuery__
 *
 * To run a query within a React component, call `useGetCrawlJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlJobsQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetCrawlJobsQuery(baseOptions?: Apollo.QueryHookOptions<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>(GetCrawlJobsDocument, options);
      }
export function useGetCrawlJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>(GetCrawlJobsDocument, options);
        }
// @ts-ignore
export function useGetCrawlJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>;
export function useGetCrawlJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlJobsQuery | undefined, GetCrawlJobsQueryVariables>;
export function useGetCrawlJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>(GetCrawlJobsDocument, options);
        }
export type GetCrawlJobsQueryHookResult = ReturnType<typeof useGetCrawlJobsQuery>;
export type GetCrawlJobsLazyQueryHookResult = ReturnType<typeof useGetCrawlJobsLazyQuery>;
export type GetCrawlJobsSuspenseQueryHookResult = ReturnType<typeof useGetCrawlJobsSuspenseQuery>;
export type GetCrawlJobsQueryResult = Apollo.QueryResult<GetCrawlJobsQuery, GetCrawlJobsQueryVariables>;
export function refetchGetCrawlJobsQuery(variables?: GetCrawlJobsQueryVariables) {
      return { query: GetCrawlJobsDocument, variables: variables }
    }
export const GetCrawlJobDocument = gql`
    query GetCrawlJob($id: String!) {
  crawlJob(id: $id) {
    crawl_job_id
    type
    status
    started_at
    completed_at
    error_message
    summary
    parameters
    created_by
    created_at
    progress
    total_data
    detail_progress
    detail_total
    last_activity_at
  }
}
    `;

/**
 * __useGetCrawlJobQuery__
 *
 * To run a query within a React component, call `useGetCrawlJobQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlJobQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlJobQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCrawlJobQuery(baseOptions: Apollo.QueryHookOptions<GetCrawlJobQuery, GetCrawlJobQueryVariables> & ({ variables: GetCrawlJobQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlJobQuery, GetCrawlJobQueryVariables>(GetCrawlJobDocument, options);
      }
export function useGetCrawlJobLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlJobQuery, GetCrawlJobQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlJobQuery, GetCrawlJobQueryVariables>(GetCrawlJobDocument, options);
        }
// @ts-ignore
export function useGetCrawlJobSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlJobQuery, GetCrawlJobQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlJobQuery, GetCrawlJobQueryVariables>;
export function useGetCrawlJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlJobQuery, GetCrawlJobQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlJobQuery | undefined, GetCrawlJobQueryVariables>;
export function useGetCrawlJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlJobQuery, GetCrawlJobQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlJobQuery, GetCrawlJobQueryVariables>(GetCrawlJobDocument, options);
        }
export type GetCrawlJobQueryHookResult = ReturnType<typeof useGetCrawlJobQuery>;
export type GetCrawlJobLazyQueryHookResult = ReturnType<typeof useGetCrawlJobLazyQuery>;
export type GetCrawlJobSuspenseQueryHookResult = ReturnType<typeof useGetCrawlJobSuspenseQuery>;
export type GetCrawlJobQueryResult = Apollo.QueryResult<GetCrawlJobQuery, GetCrawlJobQueryVariables>;
export function refetchGetCrawlJobQuery(variables: GetCrawlJobQueryVariables) {
      return { query: GetCrawlJobDocument, variables: variables }
    }
export const GetCrawlStagingDataDocument = gql`
    query GetCrawlStagingData($jobId: String!, $limit: Int, $offset: Int, $dataType: String) {
  crawlStagingData(
    jobId: $jobId
    limit: $limit
    offset: $offset
    dataType: $dataType
  ) {
    id
    data_type
    data
    created_at
  }
}
    `;

/**
 * __useGetCrawlStagingDataQuery__
 *
 * To run a query within a React component, call `useGetCrawlStagingDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlStagingDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlStagingDataQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      dataType: // value for 'dataType'
 *   },
 * });
 */
export function useGetCrawlStagingDataQuery(baseOptions: Apollo.QueryHookOptions<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables> & ({ variables: GetCrawlStagingDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>(GetCrawlStagingDataDocument, options);
      }
export function useGetCrawlStagingDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>(GetCrawlStagingDataDocument, options);
        }
// @ts-ignore
export function useGetCrawlStagingDataSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>;
export function useGetCrawlStagingDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlStagingDataQuery | undefined, GetCrawlStagingDataQueryVariables>;
export function useGetCrawlStagingDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>(GetCrawlStagingDataDocument, options);
        }
export type GetCrawlStagingDataQueryHookResult = ReturnType<typeof useGetCrawlStagingDataQuery>;
export type GetCrawlStagingDataLazyQueryHookResult = ReturnType<typeof useGetCrawlStagingDataLazyQuery>;
export type GetCrawlStagingDataSuspenseQueryHookResult = ReturnType<typeof useGetCrawlStagingDataSuspenseQuery>;
export type GetCrawlStagingDataQueryResult = Apollo.QueryResult<GetCrawlStagingDataQuery, GetCrawlStagingDataQueryVariables>;
export function refetchGetCrawlStagingDataQuery(variables: GetCrawlStagingDataQueryVariables) {
      return { query: GetCrawlStagingDataDocument, variables: variables }
    }
export const GetCrawlStagingDataSummaryDocument = gql`
    query GetCrawlStagingDataSummary($jobId: String!) {
  crawlStagingDataSummary(jobId: $jobId) {
    totalRecords
    byType {
      type
      count
    }
  }
}
    `;

/**
 * __useGetCrawlStagingDataSummaryQuery__
 *
 * To run a query within a React component, call `useGetCrawlStagingDataSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlStagingDataSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlStagingDataSummaryQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useGetCrawlStagingDataSummaryQuery(baseOptions: Apollo.QueryHookOptions<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables> & ({ variables: GetCrawlStagingDataSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>(GetCrawlStagingDataSummaryDocument, options);
      }
export function useGetCrawlStagingDataSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>(GetCrawlStagingDataSummaryDocument, options);
        }
// @ts-ignore
export function useGetCrawlStagingDataSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>;
export function useGetCrawlStagingDataSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlStagingDataSummaryQuery | undefined, GetCrawlStagingDataSummaryQueryVariables>;
export function useGetCrawlStagingDataSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>(GetCrawlStagingDataSummaryDocument, options);
        }
export type GetCrawlStagingDataSummaryQueryHookResult = ReturnType<typeof useGetCrawlStagingDataSummaryQuery>;
export type GetCrawlStagingDataSummaryLazyQueryHookResult = ReturnType<typeof useGetCrawlStagingDataSummaryLazyQuery>;
export type GetCrawlStagingDataSummarySuspenseQueryHookResult = ReturnType<typeof useGetCrawlStagingDataSummarySuspenseQuery>;
export type GetCrawlStagingDataSummaryQueryResult = Apollo.QueryResult<GetCrawlStagingDataSummaryQuery, GetCrawlStagingDataSummaryQueryVariables>;
export function refetchGetCrawlStagingDataSummaryQuery(variables: GetCrawlStagingDataSummaryQueryVariables) {
      return { query: GetCrawlStagingDataSummaryDocument, variables: variables }
    }
export const GetCrawlJobLogsDocument = gql`
    query GetCrawlJobLogs($jobId: String!, $limit: Int, $offset: Int) {
  crawlJobLogs(jobId: $jobId, limit: $limit, offset: $offset) {
    id
    timestamp
    service
    endpoint
    method
    status_code
    duration_ms
    error
    metadata
    api_log_id
  }
}
    `;

/**
 * __useGetCrawlJobLogsQuery__
 *
 * To run a query within a React component, call `useGetCrawlJobLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlJobLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlJobLogsQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetCrawlJobLogsQuery(baseOptions: Apollo.QueryHookOptions<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables> & ({ variables: GetCrawlJobLogsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>(GetCrawlJobLogsDocument, options);
      }
export function useGetCrawlJobLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>(GetCrawlJobLogsDocument, options);
        }
// @ts-ignore
export function useGetCrawlJobLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>;
export function useGetCrawlJobLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlJobLogsQuery | undefined, GetCrawlJobLogsQueryVariables>;
export function useGetCrawlJobLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>(GetCrawlJobLogsDocument, options);
        }
export type GetCrawlJobLogsQueryHookResult = ReturnType<typeof useGetCrawlJobLogsQuery>;
export type GetCrawlJobLogsLazyQueryHookResult = ReturnType<typeof useGetCrawlJobLogsLazyQuery>;
export type GetCrawlJobLogsSuspenseQueryHookResult = ReturnType<typeof useGetCrawlJobLogsSuspenseQuery>;
export type GetCrawlJobLogsQueryResult = Apollo.QueryResult<GetCrawlJobLogsQuery, GetCrawlJobLogsQueryVariables>;
export function refetchGetCrawlJobLogsQuery(variables: GetCrawlJobLogsQueryVariables) {
      return { query: GetCrawlJobLogsDocument, variables: variables }
    }
export const GetCrawlApiRequestLogsDocument = gql`
    query GetCrawlApiRequestLogs($jobId: String!, $limit: Int, $offset: Int) {
  crawlApiRequestLogs(jobId: $jobId, limit: $limit, offset: $offset) {
    id
    created_at
    request_url
    request_method
    response_status_code
    duration_ms
    error_message
  }
}
    `;

/**
 * __useGetCrawlApiRequestLogsQuery__
 *
 * To run a query within a React component, call `useGetCrawlApiRequestLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlApiRequestLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlApiRequestLogsQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetCrawlApiRequestLogsQuery(baseOptions: Apollo.QueryHookOptions<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables> & ({ variables: GetCrawlApiRequestLogsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>(GetCrawlApiRequestLogsDocument, options);
      }
export function useGetCrawlApiRequestLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>(GetCrawlApiRequestLogsDocument, options);
        }
// @ts-ignore
export function useGetCrawlApiRequestLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>;
export function useGetCrawlApiRequestLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlApiRequestLogsQuery | undefined, GetCrawlApiRequestLogsQueryVariables>;
export function useGetCrawlApiRequestLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>(GetCrawlApiRequestLogsDocument, options);
        }
export type GetCrawlApiRequestLogsQueryHookResult = ReturnType<typeof useGetCrawlApiRequestLogsQuery>;
export type GetCrawlApiRequestLogsLazyQueryHookResult = ReturnType<typeof useGetCrawlApiRequestLogsLazyQuery>;
export type GetCrawlApiRequestLogsSuspenseQueryHookResult = ReturnType<typeof useGetCrawlApiRequestLogsSuspenseQuery>;
export type GetCrawlApiRequestLogsQueryResult = Apollo.QueryResult<GetCrawlApiRequestLogsQuery, GetCrawlApiRequestLogsQueryVariables>;
export function refetchGetCrawlApiRequestLogsQuery(variables: GetCrawlApiRequestLogsQueryVariables) {
      return { query: GetCrawlApiRequestLogsDocument, variables: variables }
    }
export const GetCrawlApiRequestLogDocument = gql`
    query GetCrawlApiRequestLog($id: String!) {
  crawlApiRequestLog(id: $id) {
    id
    created_at
    request_url
    request_method
    request_params
    request_headers
    response_status_code
    response_body
    response_headers
    duration_ms
    error_message
  }
}
    `;

/**
 * __useGetCrawlApiRequestLogQuery__
 *
 * To run a query within a React component, call `useGetCrawlApiRequestLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrawlApiRequestLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrawlApiRequestLogQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCrawlApiRequestLogQuery(baseOptions: Apollo.QueryHookOptions<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables> & ({ variables: GetCrawlApiRequestLogQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>(GetCrawlApiRequestLogDocument, options);
      }
export function useGetCrawlApiRequestLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>(GetCrawlApiRequestLogDocument, options);
        }
// @ts-ignore
export function useGetCrawlApiRequestLogSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>;
export function useGetCrawlApiRequestLogSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>): Apollo.UseSuspenseQueryResult<GetCrawlApiRequestLogQuery | undefined, GetCrawlApiRequestLogQueryVariables>;
export function useGetCrawlApiRequestLogSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>(GetCrawlApiRequestLogDocument, options);
        }
export type GetCrawlApiRequestLogQueryHookResult = ReturnType<typeof useGetCrawlApiRequestLogQuery>;
export type GetCrawlApiRequestLogLazyQueryHookResult = ReturnType<typeof useGetCrawlApiRequestLogLazyQuery>;
export type GetCrawlApiRequestLogSuspenseQueryHookResult = ReturnType<typeof useGetCrawlApiRequestLogSuspenseQuery>;
export type GetCrawlApiRequestLogQueryResult = Apollo.QueryResult<GetCrawlApiRequestLogQuery, GetCrawlApiRequestLogQueryVariables>;
export function refetchGetCrawlApiRequestLogQuery(variables: GetCrawlApiRequestLogQueryVariables) {
      return { query: GetCrawlApiRequestLogDocument, variables: variables }
    }
export const GetSurveyListConfigsDocument = gql`
    query GetSurveyListConfigs($type: CrawlJobType) {
  surveyListConfigs(type: $type) {
    id
    survey_type
    sid
    title
    type
    year
    semester_type
    semester_name
    is_active
    last_crawled_at
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetSurveyListConfigsQuery__
 *
 * To run a query within a React component, call `useGetSurveyListConfigsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSurveyListConfigsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSurveyListConfigsQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetSurveyListConfigsQuery(baseOptions?: Apollo.QueryHookOptions<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>(GetSurveyListConfigsDocument, options);
      }
export function useGetSurveyListConfigsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>(GetSurveyListConfigsDocument, options);
        }
// @ts-ignore
export function useGetSurveyListConfigsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>;
export function useGetSurveyListConfigsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSurveyListConfigsQuery | undefined, GetSurveyListConfigsQueryVariables>;
export function useGetSurveyListConfigsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>(GetSurveyListConfigsDocument, options);
        }
export type GetSurveyListConfigsQueryHookResult = ReturnType<typeof useGetSurveyListConfigsQuery>;
export type GetSurveyListConfigsLazyQueryHookResult = ReturnType<typeof useGetSurveyListConfigsLazyQuery>;
export type GetSurveyListConfigsSuspenseQueryHookResult = ReturnType<typeof useGetSurveyListConfigsSuspenseQuery>;
export type GetSurveyListConfigsQueryResult = Apollo.QueryResult<GetSurveyListConfigsQuery, GetSurveyListConfigsQueryVariables>;
export function refetchGetSurveyListConfigsQuery(variables?: GetSurveyListConfigsQueryVariables) {
      return { query: GetSurveyListConfigsDocument, variables: variables }
    }
export const RunCrawlSubjectSurveyDocument = gql`
    mutation RunCrawlSubjectSurvey($semester: String, $surveyConfigIds: [String!]) {
  runCrawlSubjectSurvey(semester: $semester, surveyConfigIds: $surveyConfigIds) {
    crawl_job_id
    type
    status
    started_at
  }
}
    `;
export type RunCrawlSubjectSurveyMutationFn = Apollo.MutationFunction<RunCrawlSubjectSurveyMutation, RunCrawlSubjectSurveyMutationVariables>;

/**
 * __useRunCrawlSubjectSurveyMutation__
 *
 * To run a mutation, you first call `useRunCrawlSubjectSurveyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunCrawlSubjectSurveyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runCrawlSubjectSurveyMutation, { data, loading, error }] = useRunCrawlSubjectSurveyMutation({
 *   variables: {
 *      semester: // value for 'semester'
 *      surveyConfigIds: // value for 'surveyConfigIds'
 *   },
 * });
 */
export function useRunCrawlSubjectSurveyMutation(baseOptions?: Apollo.MutationHookOptions<RunCrawlSubjectSurveyMutation, RunCrawlSubjectSurveyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RunCrawlSubjectSurveyMutation, RunCrawlSubjectSurveyMutationVariables>(RunCrawlSubjectSurveyDocument, options);
      }
export type RunCrawlSubjectSurveyMutationHookResult = ReturnType<typeof useRunCrawlSubjectSurveyMutation>;
export type RunCrawlSubjectSurveyMutationResult = Apollo.MutationResult<RunCrawlSubjectSurveyMutation>;
export type RunCrawlSubjectSurveyMutationOptions = Apollo.BaseMutationOptions<RunCrawlSubjectSurveyMutation, RunCrawlSubjectSurveyMutationVariables>;
export const RunCrawlLecturerSurveyDocument = gql`
    mutation RunCrawlLecturerSurvey($semester: String, $surveyConfigIds: [String!]) {
  runCrawlLecturerSurvey(semester: $semester, surveyConfigIds: $surveyConfigIds) {
    crawl_job_id
    type
    status
    started_at
  }
}
    `;
export type RunCrawlLecturerSurveyMutationFn = Apollo.MutationFunction<RunCrawlLecturerSurveyMutation, RunCrawlLecturerSurveyMutationVariables>;

/**
 * __useRunCrawlLecturerSurveyMutation__
 *
 * To run a mutation, you first call `useRunCrawlLecturerSurveyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunCrawlLecturerSurveyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runCrawlLecturerSurveyMutation, { data, loading, error }] = useRunCrawlLecturerSurveyMutation({
 *   variables: {
 *      semester: // value for 'semester'
 *      surveyConfigIds: // value for 'surveyConfigIds'
 *   },
 * });
 */
export function useRunCrawlLecturerSurveyMutation(baseOptions?: Apollo.MutationHookOptions<RunCrawlLecturerSurveyMutation, RunCrawlLecturerSurveyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RunCrawlLecturerSurveyMutation, RunCrawlLecturerSurveyMutationVariables>(RunCrawlLecturerSurveyDocument, options);
      }
export type RunCrawlLecturerSurveyMutationHookResult = ReturnType<typeof useRunCrawlLecturerSurveyMutation>;
export type RunCrawlLecturerSurveyMutationResult = Apollo.MutationResult<RunCrawlLecturerSurveyMutation>;
export type RunCrawlLecturerSurveyMutationOptions = Apollo.BaseMutationOptions<RunCrawlLecturerSurveyMutation, RunCrawlLecturerSurveyMutationVariables>;
export const RunCrawlStaffSurveyDocument = gql`
    mutation RunCrawlStaffSurvey($year: String) {
  runCrawlStaffSurvey(year: $year) {
    crawl_job_id
    type
    status
    started_at
  }
}
    `;
export type RunCrawlStaffSurveyMutationFn = Apollo.MutationFunction<RunCrawlStaffSurveyMutation, RunCrawlStaffSurveyMutationVariables>;

/**
 * __useRunCrawlStaffSurveyMutation__
 *
 * To run a mutation, you first call `useRunCrawlStaffSurveyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunCrawlStaffSurveyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runCrawlStaffSurveyMutation, { data, loading, error }] = useRunCrawlStaffSurveyMutation({
 *   variables: {
 *      year: // value for 'year'
 *   },
 * });
 */
export function useRunCrawlStaffSurveyMutation(baseOptions?: Apollo.MutationHookOptions<RunCrawlStaffSurveyMutation, RunCrawlStaffSurveyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RunCrawlStaffSurveyMutation, RunCrawlStaffSurveyMutationVariables>(RunCrawlStaffSurveyDocument, options);
      }
export type RunCrawlStaffSurveyMutationHookResult = ReturnType<typeof useRunCrawlStaffSurveyMutation>;
export type RunCrawlStaffSurveyMutationResult = Apollo.MutationResult<RunCrawlStaffSurveyMutation>;
export type RunCrawlStaffSurveyMutationOptions = Apollo.BaseMutationOptions<RunCrawlStaffSurveyMutation, RunCrawlStaffSurveyMutationVariables>;
export const RunAggregatePointsDocument = gql`
    mutation RunAggregatePoints {
  runAggregatePoints {
    crawl_job_id
    type
    status
    started_at
  }
}
    `;
export type RunAggregatePointsMutationFn = Apollo.MutationFunction<RunAggregatePointsMutation, RunAggregatePointsMutationVariables>;

/**
 * __useRunAggregatePointsMutation__
 *
 * To run a mutation, you first call `useRunAggregatePointsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunAggregatePointsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runAggregatePointsMutation, { data, loading, error }] = useRunAggregatePointsMutation({
 *   variables: {
 *   },
 * });
 */
export function useRunAggregatePointsMutation(baseOptions?: Apollo.MutationHookOptions<RunAggregatePointsMutation, RunAggregatePointsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RunAggregatePointsMutation, RunAggregatePointsMutationVariables>(RunAggregatePointsDocument, options);
      }
export type RunAggregatePointsMutationHookResult = ReturnType<typeof useRunAggregatePointsMutation>;
export type RunAggregatePointsMutationResult = Apollo.MutationResult<RunAggregatePointsMutation>;
export type RunAggregatePointsMutationOptions = Apollo.BaseMutationOptions<RunAggregatePointsMutation, RunAggregatePointsMutationVariables>;
export const RunTransferDataDocument = gql`
    mutation RunTransferData {
  runTransferData {
    crawl_job_id
    type
    status
    started_at
  }
}
    `;
export type RunTransferDataMutationFn = Apollo.MutationFunction<RunTransferDataMutation, RunTransferDataMutationVariables>;

/**
 * __useRunTransferDataMutation__
 *
 * To run a mutation, you first call `useRunTransferDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunTransferDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runTransferDataMutation, { data, loading, error }] = useRunTransferDataMutation({
 *   variables: {
 *   },
 * });
 */
export function useRunTransferDataMutation(baseOptions?: Apollo.MutationHookOptions<RunTransferDataMutation, RunTransferDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RunTransferDataMutation, RunTransferDataMutationVariables>(RunTransferDataDocument, options);
      }
export type RunTransferDataMutationHookResult = ReturnType<typeof useRunTransferDataMutation>;
export type RunTransferDataMutationResult = Apollo.MutationResult<RunTransferDataMutation>;
export type RunTransferDataMutationOptions = Apollo.BaseMutationOptions<RunTransferDataMutation, RunTransferDataMutationVariables>;
export const ConfirmCrawlJobDocument = gql`
    mutation ConfirmCrawlJob($jobId: String!) {
  confirmCrawlJob(jobId: $jobId) {
    crawl_job_id
    status
  }
}
    `;
export type ConfirmCrawlJobMutationFn = Apollo.MutationFunction<ConfirmCrawlJobMutation, ConfirmCrawlJobMutationVariables>;

/**
 * __useConfirmCrawlJobMutation__
 *
 * To run a mutation, you first call `useConfirmCrawlJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmCrawlJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmCrawlJobMutation, { data, loading, error }] = useConfirmCrawlJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useConfirmCrawlJobMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmCrawlJobMutation, ConfirmCrawlJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmCrawlJobMutation, ConfirmCrawlJobMutationVariables>(ConfirmCrawlJobDocument, options);
      }
export type ConfirmCrawlJobMutationHookResult = ReturnType<typeof useConfirmCrawlJobMutation>;
export type ConfirmCrawlJobMutationResult = Apollo.MutationResult<ConfirmCrawlJobMutation>;
export type ConfirmCrawlJobMutationOptions = Apollo.BaseMutationOptions<ConfirmCrawlJobMutation, ConfirmCrawlJobMutationVariables>;
export const AbandonCrawlJobDocument = gql`
    mutation AbandonCrawlJob($jobId: String!) {
  abandonCrawlJob(jobId: $jobId) {
    crawl_job_id
    status
  }
}
    `;
export type AbandonCrawlJobMutationFn = Apollo.MutationFunction<AbandonCrawlJobMutation, AbandonCrawlJobMutationVariables>;

/**
 * __useAbandonCrawlJobMutation__
 *
 * To run a mutation, you first call `useAbandonCrawlJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAbandonCrawlJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [abandonCrawlJobMutation, { data, loading, error }] = useAbandonCrawlJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useAbandonCrawlJobMutation(baseOptions?: Apollo.MutationHookOptions<AbandonCrawlJobMutation, AbandonCrawlJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AbandonCrawlJobMutation, AbandonCrawlJobMutationVariables>(AbandonCrawlJobDocument, options);
      }
export type AbandonCrawlJobMutationHookResult = ReturnType<typeof useAbandonCrawlJobMutation>;
export type AbandonCrawlJobMutationResult = Apollo.MutationResult<AbandonCrawlJobMutation>;
export type AbandonCrawlJobMutationOptions = Apollo.BaseMutationOptions<AbandonCrawlJobMutation, AbandonCrawlJobMutationVariables>;
export const StopCrawlJobDocument = gql`
    mutation StopCrawlJob($jobId: String!) {
  stopCrawlJob(jobId: $jobId) {
    crawl_job_id
    status
  }
}
    `;
export type StopCrawlJobMutationFn = Apollo.MutationFunction<StopCrawlJobMutation, StopCrawlJobMutationVariables>;

/**
 * __useStopCrawlJobMutation__
 *
 * To run a mutation, you first call `useStopCrawlJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopCrawlJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopCrawlJobMutation, { data, loading, error }] = useStopCrawlJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useStopCrawlJobMutation(baseOptions?: Apollo.MutationHookOptions<StopCrawlJobMutation, StopCrawlJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StopCrawlJobMutation, StopCrawlJobMutationVariables>(StopCrawlJobDocument, options);
      }
export type StopCrawlJobMutationHookResult = ReturnType<typeof useStopCrawlJobMutation>;
export type StopCrawlJobMutationResult = Apollo.MutationResult<StopCrawlJobMutation>;
export type StopCrawlJobMutationOptions = Apollo.BaseMutationOptions<StopCrawlJobMutation, StopCrawlJobMutationVariables>;
export const AddSurveyListConfigDocument = gql`
    mutation AddSurveyListConfig($input: SurveyListConfigInput!) {
  addSurveyListConfig(input: $input) {
    id
    survey_type
    sid
    title
    year
    is_active
  }
}
    `;
export type AddSurveyListConfigMutationFn = Apollo.MutationFunction<AddSurveyListConfigMutation, AddSurveyListConfigMutationVariables>;

/**
 * __useAddSurveyListConfigMutation__
 *
 * To run a mutation, you first call `useAddSurveyListConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSurveyListConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSurveyListConfigMutation, { data, loading, error }] = useAddSurveyListConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddSurveyListConfigMutation(baseOptions?: Apollo.MutationHookOptions<AddSurveyListConfigMutation, AddSurveyListConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSurveyListConfigMutation, AddSurveyListConfigMutationVariables>(AddSurveyListConfigDocument, options);
      }
export type AddSurveyListConfigMutationHookResult = ReturnType<typeof useAddSurveyListConfigMutation>;
export type AddSurveyListConfigMutationResult = Apollo.MutationResult<AddSurveyListConfigMutation>;
export type AddSurveyListConfigMutationOptions = Apollo.BaseMutationOptions<AddSurveyListConfigMutation, AddSurveyListConfigMutationVariables>;
export const UpdateSurveyListConfigDocument = gql`
    mutation UpdateSurveyListConfig($id: String!, $input: SurveyListConfigInput!) {
  updateSurveyListConfig(id: $id, input: $input) {
    id
    survey_type
    sid
    title
    year
    is_active
  }
}
    `;
export type UpdateSurveyListConfigMutationFn = Apollo.MutationFunction<UpdateSurveyListConfigMutation, UpdateSurveyListConfigMutationVariables>;

/**
 * __useUpdateSurveyListConfigMutation__
 *
 * To run a mutation, you first call `useUpdateSurveyListConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSurveyListConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSurveyListConfigMutation, { data, loading, error }] = useUpdateSurveyListConfigMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSurveyListConfigMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSurveyListConfigMutation, UpdateSurveyListConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSurveyListConfigMutation, UpdateSurveyListConfigMutationVariables>(UpdateSurveyListConfigDocument, options);
      }
export type UpdateSurveyListConfigMutationHookResult = ReturnType<typeof useUpdateSurveyListConfigMutation>;
export type UpdateSurveyListConfigMutationResult = Apollo.MutationResult<UpdateSurveyListConfigMutation>;
export type UpdateSurveyListConfigMutationOptions = Apollo.BaseMutationOptions<UpdateSurveyListConfigMutation, UpdateSurveyListConfigMutationVariables>;
export const DeleteSurveyListConfigDocument = gql`
    mutation DeleteSurveyListConfig($id: String!) {
  deleteSurveyListConfig(id: $id)
}
    `;
export type DeleteSurveyListConfigMutationFn = Apollo.MutationFunction<DeleteSurveyListConfigMutation, DeleteSurveyListConfigMutationVariables>;

/**
 * __useDeleteSurveyListConfigMutation__
 *
 * To run a mutation, you first call `useDeleteSurveyListConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSurveyListConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSurveyListConfigMutation, { data, loading, error }] = useDeleteSurveyListConfigMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSurveyListConfigMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSurveyListConfigMutation, DeleteSurveyListConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSurveyListConfigMutation, DeleteSurveyListConfigMutationVariables>(DeleteSurveyListConfigDocument, options);
      }
export type DeleteSurveyListConfigMutationHookResult = ReturnType<typeof useDeleteSurveyListConfigMutation>;
export type DeleteSurveyListConfigMutationResult = Apollo.MutationResult<DeleteSurveyListConfigMutation>;
export type DeleteSurveyListConfigMutationOptions = Apollo.BaseMutationOptions<DeleteSurveyListConfigMutation, DeleteSurveyListConfigMutationVariables>;
export const GetSurveyCrawlHistoryDocument = gql`
    query getSurveyCrawlHistory($jobId: String, $surveyConfigId: String, $limit: Int, $offset: Int) {
  surveyCrawlHistory(
    jobId: $jobId
    surveyConfigId: $surveyConfigId
    limit: $limit
    offset: $offset
  ) {
    id
    survey_list_config_id
    crawl_job_id
    sid
    status
    records_fetched
    error_message
    started_at
    completed_at
  }
}
    `;

/**
 * __useGetSurveyCrawlHistoryQuery__
 *
 * To run a query within a React component, call `useGetSurveyCrawlHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSurveyCrawlHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSurveyCrawlHistoryQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *      surveyConfigId: // value for 'surveyConfigId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetSurveyCrawlHistoryQuery(baseOptions?: Apollo.QueryHookOptions<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>(GetSurveyCrawlHistoryDocument, options);
      }
export function useGetSurveyCrawlHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>(GetSurveyCrawlHistoryDocument, options);
        }
// @ts-ignore
export function useGetSurveyCrawlHistorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>;
export function useGetSurveyCrawlHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetSurveyCrawlHistoryQuery | undefined, GetSurveyCrawlHistoryQueryVariables>;
export function useGetSurveyCrawlHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>(GetSurveyCrawlHistoryDocument, options);
        }
export type GetSurveyCrawlHistoryQueryHookResult = ReturnType<typeof useGetSurveyCrawlHistoryQuery>;
export type GetSurveyCrawlHistoryLazyQueryHookResult = ReturnType<typeof useGetSurveyCrawlHistoryLazyQuery>;
export type GetSurveyCrawlHistorySuspenseQueryHookResult = ReturnType<typeof useGetSurveyCrawlHistorySuspenseQuery>;
export type GetSurveyCrawlHistoryQueryResult = Apollo.QueryResult<GetSurveyCrawlHistoryQuery, GetSurveyCrawlHistoryQueryVariables>;
export function refetchGetSurveyCrawlHistoryQuery(variables?: GetSurveyCrawlHistoryQueryVariables) {
      return { query: GetSurveyCrawlHistoryDocument, variables: variables }
    }
export const SearchExternalSurveysDocument = gql`
    query searchExternalSurveys($keyword: String, $page: Int, $limit: Int, $order: String, $direction: String) {
  searchExternalSurveys(
    keyword: $keyword
    page: $page
    limit: $limit
    order: $order
    direction: $direction
  )
}
    `;

/**
 * __useSearchExternalSurveysQuery__
 *
 * To run a query within a React component, call `useSearchExternalSurveysQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchExternalSurveysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchExternalSurveysQuery({
 *   variables: {
 *      keyword: // value for 'keyword'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      order: // value for 'order'
 *      direction: // value for 'direction'
 *   },
 * });
 */
export function useSearchExternalSurveysQuery(baseOptions?: Apollo.QueryHookOptions<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>(SearchExternalSurveysDocument, options);
      }
export function useSearchExternalSurveysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>(SearchExternalSurveysDocument, options);
        }
// @ts-ignore
export function useSearchExternalSurveysSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>): Apollo.UseSuspenseQueryResult<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>;
export function useSearchExternalSurveysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>): Apollo.UseSuspenseQueryResult<SearchExternalSurveysQuery | undefined, SearchExternalSurveysQueryVariables>;
export function useSearchExternalSurveysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>(SearchExternalSurveysDocument, options);
        }
export type SearchExternalSurveysQueryHookResult = ReturnType<typeof useSearchExternalSurveysQuery>;
export type SearchExternalSurveysLazyQueryHookResult = ReturnType<typeof useSearchExternalSurveysLazyQuery>;
export type SearchExternalSurveysSuspenseQueryHookResult = ReturnType<typeof useSearchExternalSurveysSuspenseQuery>;
export type SearchExternalSurveysQueryResult = Apollo.QueryResult<SearchExternalSurveysQuery, SearchExternalSurveysQueryVariables>;
export function refetchSearchExternalSurveysQuery(variables?: SearchExternalSurveysQueryVariables) {
      return { query: SearchExternalSurveysDocument, variables: variables }
    }
export const GetCriteriaMappingsDocument = gql`
    query GetCriteriaMappings {
  getCriteriaMappings {
    id
    display_name
    criteria {
      criteria_id
      display_name
      semester_id
    }
    staffSurveyCriteria {
      staff_survey_criteria_id
      display_name
      category
      semesters
    }
  }
}
    `;

/**
 * __useGetCriteriaMappingsQuery__
 *
 * To run a query within a React component, call `useGetCriteriaMappingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCriteriaMappingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCriteriaMappingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCriteriaMappingsQuery(baseOptions?: Apollo.QueryHookOptions<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>(GetCriteriaMappingsDocument, options);
      }
export function useGetCriteriaMappingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>(GetCriteriaMappingsDocument, options);
        }
// @ts-ignore
export function useGetCriteriaMappingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>;
export function useGetCriteriaMappingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCriteriaMappingsQuery | undefined, GetCriteriaMappingsQueryVariables>;
export function useGetCriteriaMappingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>(GetCriteriaMappingsDocument, options);
        }
export type GetCriteriaMappingsQueryHookResult = ReturnType<typeof useGetCriteriaMappingsQuery>;
export type GetCriteriaMappingsLazyQueryHookResult = ReturnType<typeof useGetCriteriaMappingsLazyQuery>;
export type GetCriteriaMappingsSuspenseQueryHookResult = ReturnType<typeof useGetCriteriaMappingsSuspenseQuery>;
export type GetCriteriaMappingsQueryResult = Apollo.QueryResult<GetCriteriaMappingsQuery, GetCriteriaMappingsQueryVariables>;
export function refetchGetCriteriaMappingsQuery(variables?: GetCriteriaMappingsQueryVariables) {
      return { query: GetCriteriaMappingsDocument, variables: variables }
    }
export const GetAutoMappingSuggestionsDocument = gql`
    query GetAutoMappingSuggestions {
  getAutoMappingSuggestions {
    display_name
    criteriaIds
    staffSurveyCriteriaIds
    semesters
  }
}
    `;

/**
 * __useGetAutoMappingSuggestionsQuery__
 *
 * To run a query within a React component, call `useGetAutoMappingSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutoMappingSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutoMappingSuggestionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAutoMappingSuggestionsQuery(baseOptions?: Apollo.QueryHookOptions<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>(GetAutoMappingSuggestionsDocument, options);
      }
export function useGetAutoMappingSuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>(GetAutoMappingSuggestionsDocument, options);
        }
// @ts-ignore
export function useGetAutoMappingSuggestionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>;
export function useGetAutoMappingSuggestionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAutoMappingSuggestionsQuery | undefined, GetAutoMappingSuggestionsQueryVariables>;
export function useGetAutoMappingSuggestionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>(GetAutoMappingSuggestionsDocument, options);
        }
export type GetAutoMappingSuggestionsQueryHookResult = ReturnType<typeof useGetAutoMappingSuggestionsQuery>;
export type GetAutoMappingSuggestionsLazyQueryHookResult = ReturnType<typeof useGetAutoMappingSuggestionsLazyQuery>;
export type GetAutoMappingSuggestionsSuspenseQueryHookResult = ReturnType<typeof useGetAutoMappingSuggestionsSuspenseQuery>;
export type GetAutoMappingSuggestionsQueryResult = Apollo.QueryResult<GetAutoMappingSuggestionsQuery, GetAutoMappingSuggestionsQueryVariables>;
export function refetchGetAutoMappingSuggestionsQuery(variables?: GetAutoMappingSuggestionsQueryVariables) {
      return { query: GetAutoMappingSuggestionsDocument, variables: variables }
    }
export const CreateCriteriaMappingDocument = gql`
    mutation CreateCriteriaMapping($display_name: String!) {
  createCriteriaMapping(display_name: $display_name) {
    id
    display_name
  }
}
    `;
export type CreateCriteriaMappingMutationFn = Apollo.MutationFunction<CreateCriteriaMappingMutation, CreateCriteriaMappingMutationVariables>;

/**
 * __useCreateCriteriaMappingMutation__
 *
 * To run a mutation, you first call `useCreateCriteriaMappingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCriteriaMappingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCriteriaMappingMutation, { data, loading, error }] = useCreateCriteriaMappingMutation({
 *   variables: {
 *      display_name: // value for 'display_name'
 *   },
 * });
 */
export function useCreateCriteriaMappingMutation(baseOptions?: Apollo.MutationHookOptions<CreateCriteriaMappingMutation, CreateCriteriaMappingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCriteriaMappingMutation, CreateCriteriaMappingMutationVariables>(CreateCriteriaMappingDocument, options);
      }
export type CreateCriteriaMappingMutationHookResult = ReturnType<typeof useCreateCriteriaMappingMutation>;
export type CreateCriteriaMappingMutationResult = Apollo.MutationResult<CreateCriteriaMappingMutation>;
export type CreateCriteriaMappingMutationOptions = Apollo.BaseMutationOptions<CreateCriteriaMappingMutation, CreateCriteriaMappingMutationVariables>;
export const UpdateCriteriaMappingDocument = gql`
    mutation UpdateCriteriaMapping($id: ID!, $display_name: String!) {
  updateCriteriaMapping(id: $id, display_name: $display_name) {
    id
    display_name
  }
}
    `;
export type UpdateCriteriaMappingMutationFn = Apollo.MutationFunction<UpdateCriteriaMappingMutation, UpdateCriteriaMappingMutationVariables>;

/**
 * __useUpdateCriteriaMappingMutation__
 *
 * To run a mutation, you first call `useUpdateCriteriaMappingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCriteriaMappingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCriteriaMappingMutation, { data, loading, error }] = useUpdateCriteriaMappingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      display_name: // value for 'display_name'
 *   },
 * });
 */
export function useUpdateCriteriaMappingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCriteriaMappingMutation, UpdateCriteriaMappingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCriteriaMappingMutation, UpdateCriteriaMappingMutationVariables>(UpdateCriteriaMappingDocument, options);
      }
export type UpdateCriteriaMappingMutationHookResult = ReturnType<typeof useUpdateCriteriaMappingMutation>;
export type UpdateCriteriaMappingMutationResult = Apollo.MutationResult<UpdateCriteriaMappingMutation>;
export type UpdateCriteriaMappingMutationOptions = Apollo.BaseMutationOptions<UpdateCriteriaMappingMutation, UpdateCriteriaMappingMutationVariables>;
export const DeleteCriteriaMappingDocument = gql`
    mutation DeleteCriteriaMapping($id: ID!) {
  deleteCriteriaMapping(id: $id)
}
    `;
export type DeleteCriteriaMappingMutationFn = Apollo.MutationFunction<DeleteCriteriaMappingMutation, DeleteCriteriaMappingMutationVariables>;

/**
 * __useDeleteCriteriaMappingMutation__
 *
 * To run a mutation, you first call `useDeleteCriteriaMappingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCriteriaMappingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCriteriaMappingMutation, { data, loading, error }] = useDeleteCriteriaMappingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCriteriaMappingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCriteriaMappingMutation, DeleteCriteriaMappingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCriteriaMappingMutation, DeleteCriteriaMappingMutationVariables>(DeleteCriteriaMappingDocument, options);
      }
export type DeleteCriteriaMappingMutationHookResult = ReturnType<typeof useDeleteCriteriaMappingMutation>;
export type DeleteCriteriaMappingMutationResult = Apollo.MutationResult<DeleteCriteriaMappingMutation>;
export type DeleteCriteriaMappingMutationOptions = Apollo.BaseMutationOptions<DeleteCriteriaMappingMutation, DeleteCriteriaMappingMutationVariables>;
export const MapCriteriaToGroupDocument = gql`
    mutation MapCriteriaToGroup($mappingId: ID!, $criteriaIds: [ID!]!, $type: String!) {
  mapCriteriaToGroup(
    mappingId: $mappingId
    criteriaIds: $criteriaIds
    type: $type
  ) {
    id
  }
}
    `;
export type MapCriteriaToGroupMutationFn = Apollo.MutationFunction<MapCriteriaToGroupMutation, MapCriteriaToGroupMutationVariables>;

/**
 * __useMapCriteriaToGroupMutation__
 *
 * To run a mutation, you first call `useMapCriteriaToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMapCriteriaToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mapCriteriaToGroupMutation, { data, loading, error }] = useMapCriteriaToGroupMutation({
 *   variables: {
 *      mappingId: // value for 'mappingId'
 *      criteriaIds: // value for 'criteriaIds'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useMapCriteriaToGroupMutation(baseOptions?: Apollo.MutationHookOptions<MapCriteriaToGroupMutation, MapCriteriaToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MapCriteriaToGroupMutation, MapCriteriaToGroupMutationVariables>(MapCriteriaToGroupDocument, options);
      }
export type MapCriteriaToGroupMutationHookResult = ReturnType<typeof useMapCriteriaToGroupMutation>;
export type MapCriteriaToGroupMutationResult = Apollo.MutationResult<MapCriteriaToGroupMutation>;
export type MapCriteriaToGroupMutationOptions = Apollo.BaseMutationOptions<MapCriteriaToGroupMutation, MapCriteriaToGroupMutationVariables>;
export const UnmapCriteriaDocument = gql`
    mutation UnmapCriteria($criteriaIds: [ID!]!, $type: String!) {
  unmapCriteria(criteriaIds: $criteriaIds, type: $type)
}
    `;
export type UnmapCriteriaMutationFn = Apollo.MutationFunction<UnmapCriteriaMutation, UnmapCriteriaMutationVariables>;

/**
 * __useUnmapCriteriaMutation__
 *
 * To run a mutation, you first call `useUnmapCriteriaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnmapCriteriaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unmapCriteriaMutation, { data, loading, error }] = useUnmapCriteriaMutation({
 *   variables: {
 *      criteriaIds: // value for 'criteriaIds'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useUnmapCriteriaMutation(baseOptions?: Apollo.MutationHookOptions<UnmapCriteriaMutation, UnmapCriteriaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnmapCriteriaMutation, UnmapCriteriaMutationVariables>(UnmapCriteriaDocument, options);
      }
export type UnmapCriteriaMutationHookResult = ReturnType<typeof useUnmapCriteriaMutation>;
export type UnmapCriteriaMutationResult = Apollo.MutationResult<UnmapCriteriaMutation>;
export type UnmapCriteriaMutationOptions = Apollo.BaseMutationOptions<UnmapCriteriaMutation, UnmapCriteriaMutationVariables>;
export const ConfirmAutoMappingDocument = gql`
    mutation ConfirmAutoMapping($suggestions: [AutoMappingSuggestionInput!]!) {
  confirmAutoMapping(suggestions: $suggestions)
}
    `;
export type ConfirmAutoMappingMutationFn = Apollo.MutationFunction<ConfirmAutoMappingMutation, ConfirmAutoMappingMutationVariables>;

/**
 * __useConfirmAutoMappingMutation__
 *
 * To run a mutation, you first call `useConfirmAutoMappingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmAutoMappingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmAutoMappingMutation, { data, loading, error }] = useConfirmAutoMappingMutation({
 *   variables: {
 *      suggestions: // value for 'suggestions'
 *   },
 * });
 */
export function useConfirmAutoMappingMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmAutoMappingMutation, ConfirmAutoMappingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmAutoMappingMutation, ConfirmAutoMappingMutationVariables>(ConfirmAutoMappingDocument, options);
      }
export type ConfirmAutoMappingMutationHookResult = ReturnType<typeof useConfirmAutoMappingMutation>;
export type ConfirmAutoMappingMutationResult = Apollo.MutationResult<ConfirmAutoMappingMutation>;
export type ConfirmAutoMappingMutationOptions = Apollo.BaseMutationOptions<ConfirmAutoMappingMutation, ConfirmAutoMappingMutationVariables>;
export const DetailCriteriaDocument = gql`
    query DetailCriteria($id: String!) {
  criteria(id: $id) {
    criteria_id
    display_name
    index
    semester {
      display_name
      semester_id
      type
      year
    }
  }
}
    `;

/**
 * __useDetailCriteriaQuery__
 *
 * To run a query within a React component, call `useDetailCriteriaQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailCriteriaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailCriteriaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailCriteriaQuery(baseOptions: Apollo.QueryHookOptions<DetailCriteriaQuery, DetailCriteriaQueryVariables> & ({ variables: DetailCriteriaQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailCriteriaQuery, DetailCriteriaQueryVariables>(DetailCriteriaDocument, options);
      }
export function useDetailCriteriaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailCriteriaQuery, DetailCriteriaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailCriteriaQuery, DetailCriteriaQueryVariables>(DetailCriteriaDocument, options);
        }
// @ts-ignore
export function useDetailCriteriaSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DetailCriteriaQuery, DetailCriteriaQueryVariables>): Apollo.UseSuspenseQueryResult<DetailCriteriaQuery, DetailCriteriaQueryVariables>;
export function useDetailCriteriaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailCriteriaQuery, DetailCriteriaQueryVariables>): Apollo.UseSuspenseQueryResult<DetailCriteriaQuery | undefined, DetailCriteriaQueryVariables>;
export function useDetailCriteriaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailCriteriaQuery, DetailCriteriaQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DetailCriteriaQuery, DetailCriteriaQueryVariables>(DetailCriteriaDocument, options);
        }
export type DetailCriteriaQueryHookResult = ReturnType<typeof useDetailCriteriaQuery>;
export type DetailCriteriaLazyQueryHookResult = ReturnType<typeof useDetailCriteriaLazyQuery>;
export type DetailCriteriaSuspenseQueryHookResult = ReturnType<typeof useDetailCriteriaSuspenseQuery>;
export type DetailCriteriaQueryResult = Apollo.QueryResult<DetailCriteriaQuery, DetailCriteriaQueryVariables>;
export function refetchDetailCriteriaQuery(variables: DetailCriteriaQueryVariables) {
      return { query: DetailCriteriaDocument, variables: variables }
    }
export const AllCriteriasDocument = gql`
    query AllCriterias($filter: FilterArgs) {
  criterias(filter: $filter, pagination: {page: 0, size: 150}) {
    data {
      display_name
      criteria_id
      mapping_id
      semester_id
      type {
        class_type
        num
      }
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useAllCriteriasQuery__
 *
 * To run a query within a React component, call `useAllCriteriasQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllCriteriasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllCriteriasQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAllCriteriasQuery(baseOptions?: Apollo.QueryHookOptions<AllCriteriasQuery, AllCriteriasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllCriteriasQuery, AllCriteriasQueryVariables>(AllCriteriasDocument, options);
      }
export function useAllCriteriasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllCriteriasQuery, AllCriteriasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllCriteriasQuery, AllCriteriasQueryVariables>(AllCriteriasDocument, options);
        }
// @ts-ignore
export function useAllCriteriasSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AllCriteriasQuery, AllCriteriasQueryVariables>): Apollo.UseSuspenseQueryResult<AllCriteriasQuery, AllCriteriasQueryVariables>;
export function useAllCriteriasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllCriteriasQuery, AllCriteriasQueryVariables>): Apollo.UseSuspenseQueryResult<AllCriteriasQuery | undefined, AllCriteriasQueryVariables>;
export function useAllCriteriasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllCriteriasQuery, AllCriteriasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllCriteriasQuery, AllCriteriasQueryVariables>(AllCriteriasDocument, options);
        }
export type AllCriteriasQueryHookResult = ReturnType<typeof useAllCriteriasQuery>;
export type AllCriteriasLazyQueryHookResult = ReturnType<typeof useAllCriteriasLazyQuery>;
export type AllCriteriasSuspenseQueryHookResult = ReturnType<typeof useAllCriteriasSuspenseQuery>;
export type AllCriteriasQueryResult = Apollo.QueryResult<AllCriteriasQuery, AllCriteriasQueryVariables>;
export function refetchAllCriteriasQuery(variables?: AllCriteriasQueryVariables) {
      return { query: AllCriteriasDocument, variables: variables }
    }
export const CriteriasDocument = gql`
    query Criterias($filter: FilterArgs, $isAscending: Boolean, $page: Int) {
  criterias(
    filter: $filter
    pagination: {page: $page, size: 10}
    sort: {isAscending: $isAscending}
  ) {
    data {
      display_name
      criteria_id
      mapping_id
      semester_id
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useCriteriasQuery__
 *
 * To run a query within a React component, call `useCriteriasQuery` and pass it any options that fit your needs.
 * When your component renders, `useCriteriasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCriteriasQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      isAscending: // value for 'isAscending'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useCriteriasQuery(baseOptions?: Apollo.QueryHookOptions<CriteriasQuery, CriteriasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CriteriasQuery, CriteriasQueryVariables>(CriteriasDocument, options);
      }
export function useCriteriasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CriteriasQuery, CriteriasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CriteriasQuery, CriteriasQueryVariables>(CriteriasDocument, options);
        }
// @ts-ignore
export function useCriteriasSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CriteriasQuery, CriteriasQueryVariables>): Apollo.UseSuspenseQueryResult<CriteriasQuery, CriteriasQueryVariables>;
export function useCriteriasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CriteriasQuery, CriteriasQueryVariables>): Apollo.UseSuspenseQueryResult<CriteriasQuery | undefined, CriteriasQueryVariables>;
export function useCriteriasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CriteriasQuery, CriteriasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CriteriasQuery, CriteriasQueryVariables>(CriteriasDocument, options);
        }
export type CriteriasQueryHookResult = ReturnType<typeof useCriteriasQuery>;
export type CriteriasLazyQueryHookResult = ReturnType<typeof useCriteriasLazyQuery>;
export type CriteriasSuspenseQueryHookResult = ReturnType<typeof useCriteriasSuspenseQuery>;
export type CriteriasQueryResult = Apollo.QueryResult<CriteriasQuery, CriteriasQueryVariables>;
export function refetchCriteriasQuery(variables?: CriteriasQueryVariables) {
      return { query: CriteriasDocument, variables: variables }
    }
export const OverallCriteriaPointsEachSemesterDocument = gql`
    query OverallCriteriaPointsEachSemester($class_type: String, $faculty_id: String, $lecturer_id: String, $program: String, $subjects: [String!]) {
  groupedPoints(
    groupEntity: "Semester"
    size: 30
    class_type: $class_type
    faculty_id: $faculty_id
    lecturer_id: $lecturer_id
    program: $program
    subjects: $subjects
  ) {
    data {
      average_point
      class_num
      display_name
      id
      max_point
      point
    }
  }
}
    `;

/**
 * __useOverallCriteriaPointsEachSemesterQuery__
 *
 * To run a query within a React component, call `useOverallCriteriaPointsEachSemesterQuery` and pass it any options that fit your needs.
 * When your component renders, `useOverallCriteriaPointsEachSemesterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOverallCriteriaPointsEachSemesterQuery({
 *   variables: {
 *      class_type: // value for 'class_type'
 *      faculty_id: // value for 'faculty_id'
 *      lecturer_id: // value for 'lecturer_id'
 *      program: // value for 'program'
 *      subjects: // value for 'subjects'
 *   },
 * });
 */
export function useOverallCriteriaPointsEachSemesterQuery(baseOptions?: Apollo.QueryHookOptions<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>(OverallCriteriaPointsEachSemesterDocument, options);
      }
export function useOverallCriteriaPointsEachSemesterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>(OverallCriteriaPointsEachSemesterDocument, options);
        }
// @ts-ignore
export function useOverallCriteriaPointsEachSemesterSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>): Apollo.UseSuspenseQueryResult<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>;
export function useOverallCriteriaPointsEachSemesterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>): Apollo.UseSuspenseQueryResult<OverallCriteriaPointsEachSemesterQuery | undefined, OverallCriteriaPointsEachSemesterQueryVariables>;
export function useOverallCriteriaPointsEachSemesterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>(OverallCriteriaPointsEachSemesterDocument, options);
        }
export type OverallCriteriaPointsEachSemesterQueryHookResult = ReturnType<typeof useOverallCriteriaPointsEachSemesterQuery>;
export type OverallCriteriaPointsEachSemesterLazyQueryHookResult = ReturnType<typeof useOverallCriteriaPointsEachSemesterLazyQuery>;
export type OverallCriteriaPointsEachSemesterSuspenseQueryHookResult = ReturnType<typeof useOverallCriteriaPointsEachSemesterSuspenseQuery>;
export type OverallCriteriaPointsEachSemesterQueryResult = Apollo.QueryResult<OverallCriteriaPointsEachSemesterQuery, OverallCriteriaPointsEachSemesterQueryVariables>;
export function refetchOverallCriteriaPointsEachSemesterQuery(variables?: OverallCriteriaPointsEachSemesterQueryVariables) {
      return { query: OverallCriteriaPointsEachSemesterDocument, variables: variables }
    }
export const FacultiesDocument = gql`
    query Faculties {
  faculties(pagination: {size: 100}) {
    data {
      display_name
      faculty_id
      full_name
    }
  }
}
    `;

/**
 * __useFacultiesQuery__
 *
 * To run a query within a React component, call `useFacultiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFacultiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFacultiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFacultiesQuery(baseOptions?: Apollo.QueryHookOptions<FacultiesQuery, FacultiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FacultiesQuery, FacultiesQueryVariables>(FacultiesDocument, options);
      }
export function useFacultiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FacultiesQuery, FacultiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FacultiesQuery, FacultiesQueryVariables>(FacultiesDocument, options);
        }
// @ts-ignore
export function useFacultiesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FacultiesQuery, FacultiesQueryVariables>): Apollo.UseSuspenseQueryResult<FacultiesQuery, FacultiesQueryVariables>;
export function useFacultiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FacultiesQuery, FacultiesQueryVariables>): Apollo.UseSuspenseQueryResult<FacultiesQuery | undefined, FacultiesQueryVariables>;
export function useFacultiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FacultiesQuery, FacultiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FacultiesQuery, FacultiesQueryVariables>(FacultiesDocument, options);
        }
export type FacultiesQueryHookResult = ReturnType<typeof useFacultiesQuery>;
export type FacultiesLazyQueryHookResult = ReturnType<typeof useFacultiesLazyQuery>;
export type FacultiesSuspenseQueryHookResult = ReturnType<typeof useFacultiesSuspenseQuery>;
export type FacultiesQueryResult = Apollo.QueryResult<FacultiesQuery, FacultiesQueryVariables>;
export function refetchFacultiesQuery(variables?: FacultiesQueryVariables) {
      return { query: FacultiesDocument, variables: variables }
    }
export const DetailFacultyDocument = gql`
    query DetailFaculty($id: String!) {
  faculty(id: $id) {
    display_name
    faculty_id
    full_name
  }
}
    `;

/**
 * __useDetailFacultyQuery__
 *
 * To run a query within a React component, call `useDetailFacultyQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailFacultyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailFacultyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailFacultyQuery(baseOptions: Apollo.QueryHookOptions<DetailFacultyQuery, DetailFacultyQueryVariables> & ({ variables: DetailFacultyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailFacultyQuery, DetailFacultyQueryVariables>(DetailFacultyDocument, options);
      }
export function useDetailFacultyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailFacultyQuery, DetailFacultyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailFacultyQuery, DetailFacultyQueryVariables>(DetailFacultyDocument, options);
        }
// @ts-ignore
export function useDetailFacultySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DetailFacultyQuery, DetailFacultyQueryVariables>): Apollo.UseSuspenseQueryResult<DetailFacultyQuery, DetailFacultyQueryVariables>;
export function useDetailFacultySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailFacultyQuery, DetailFacultyQueryVariables>): Apollo.UseSuspenseQueryResult<DetailFacultyQuery | undefined, DetailFacultyQueryVariables>;
export function useDetailFacultySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailFacultyQuery, DetailFacultyQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DetailFacultyQuery, DetailFacultyQueryVariables>(DetailFacultyDocument, options);
        }
export type DetailFacultyQueryHookResult = ReturnType<typeof useDetailFacultyQuery>;
export type DetailFacultyLazyQueryHookResult = ReturnType<typeof useDetailFacultyLazyQuery>;
export type DetailFacultySuspenseQueryHookResult = ReturnType<typeof useDetailFacultySuspenseQuery>;
export type DetailFacultyQueryResult = Apollo.QueryResult<DetailFacultyQuery, DetailFacultyQueryVariables>;
export function refetchDetailFacultyQuery(variables: DetailFacultyQueryVariables) {
      return { query: DetailFacultyDocument, variables: variables }
    }
export const DetailLecturerDocument = gql`
    query DetailLecturer($id: String!) {
  lecturer(id: $id) {
    birth_date
    display_name
    email
    faculty_id
    faculty {
      display_name
    }
    gender
    learning
    learning_position
    lecturer_id
    mscb
    ngach
    phone
    position
    total_point
    username
  }
}
    `;

/**
 * __useDetailLecturerQuery__
 *
 * To run a query within a React component, call `useDetailLecturerQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailLecturerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailLecturerQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailLecturerQuery(baseOptions: Apollo.QueryHookOptions<DetailLecturerQuery, DetailLecturerQueryVariables> & ({ variables: DetailLecturerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailLecturerQuery, DetailLecturerQueryVariables>(DetailLecturerDocument, options);
      }
export function useDetailLecturerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailLecturerQuery, DetailLecturerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailLecturerQuery, DetailLecturerQueryVariables>(DetailLecturerDocument, options);
        }
// @ts-ignore
export function useDetailLecturerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DetailLecturerQuery, DetailLecturerQueryVariables>): Apollo.UseSuspenseQueryResult<DetailLecturerQuery, DetailLecturerQueryVariables>;
export function useDetailLecturerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailLecturerQuery, DetailLecturerQueryVariables>): Apollo.UseSuspenseQueryResult<DetailLecturerQuery | undefined, DetailLecturerQueryVariables>;
export function useDetailLecturerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailLecturerQuery, DetailLecturerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DetailLecturerQuery, DetailLecturerQueryVariables>(DetailLecturerDocument, options);
        }
export type DetailLecturerQueryHookResult = ReturnType<typeof useDetailLecturerQuery>;
export type DetailLecturerLazyQueryHookResult = ReturnType<typeof useDetailLecturerLazyQuery>;
export type DetailLecturerSuspenseQueryHookResult = ReturnType<typeof useDetailLecturerSuspenseQuery>;
export type DetailLecturerQueryResult = Apollo.QueryResult<DetailLecturerQuery, DetailLecturerQueryVariables>;
export function refetchDetailLecturerQuery(variables: DetailLecturerQueryVariables) {
      return { query: DetailLecturerDocument, variables: variables }
    }
export const AllLecturersDocument = gql`
    query AllLecturers($filter: FilterArgs, $sort: SortArgs) {
  lecturers(filter: $filter, sort: $sort, pagination: {page: 0, size: 1000}) {
    data {
      birth_date
      display_name
      email
      faculty_id
      faculty {
        display_name
      }
      gender
      learning
      learning_position
      lecturer_id
      mscb
      ngach
      phone
      position
      total_point
      username
    }
  }
}
    `;

/**
 * __useAllLecturersQuery__
 *
 * To run a query within a React component, call `useAllLecturersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllLecturersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllLecturersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useAllLecturersQuery(baseOptions?: Apollo.QueryHookOptions<AllLecturersQuery, AllLecturersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllLecturersQuery, AllLecturersQueryVariables>(AllLecturersDocument, options);
      }
export function useAllLecturersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllLecturersQuery, AllLecturersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllLecturersQuery, AllLecturersQueryVariables>(AllLecturersDocument, options);
        }
// @ts-ignore
export function useAllLecturersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AllLecturersQuery, AllLecturersQueryVariables>): Apollo.UseSuspenseQueryResult<AllLecturersQuery, AllLecturersQueryVariables>;
export function useAllLecturersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllLecturersQuery, AllLecturersQueryVariables>): Apollo.UseSuspenseQueryResult<AllLecturersQuery | undefined, AllLecturersQueryVariables>;
export function useAllLecturersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllLecturersQuery, AllLecturersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllLecturersQuery, AllLecturersQueryVariables>(AllLecturersDocument, options);
        }
export type AllLecturersQueryHookResult = ReturnType<typeof useAllLecturersQuery>;
export type AllLecturersLazyQueryHookResult = ReturnType<typeof useAllLecturersLazyQuery>;
export type AllLecturersSuspenseQueryHookResult = ReturnType<typeof useAllLecturersSuspenseQuery>;
export type AllLecturersQueryResult = Apollo.QueryResult<AllLecturersQuery, AllLecturersQueryVariables>;
export function refetchAllLecturersQuery(variables?: AllLecturersQueryVariables) {
      return { query: AllLecturersDocument, variables: variables }
    }
export const LecturerRankingDocument = gql`
    query LecturerRanking($filter: FilterArgs, $minClasses: Int, $limit: Int) {
  lecturerRanking(filter: $filter, minClasses: $minClasses, limit: $limit) {
    items {
      rank
      lecturer_id
      display_name
      faculty_id
      faculty_name
      avg_point
      total_subjects
      total_classes
      previous_rank
      taught_subjects {
        subject_id
        display_name
      }
    }
  }
}
    `;

/**
 * __useLecturerRankingQuery__
 *
 * To run a query within a React component, call `useLecturerRankingQuery` and pass it any options that fit your needs.
 * When your component renders, `useLecturerRankingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLecturerRankingQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      minClasses: // value for 'minClasses'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useLecturerRankingQuery(baseOptions?: Apollo.QueryHookOptions<LecturerRankingQuery, LecturerRankingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LecturerRankingQuery, LecturerRankingQueryVariables>(LecturerRankingDocument, options);
      }
export function useLecturerRankingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LecturerRankingQuery, LecturerRankingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LecturerRankingQuery, LecturerRankingQueryVariables>(LecturerRankingDocument, options);
        }
// @ts-ignore
export function useLecturerRankingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LecturerRankingQuery, LecturerRankingQueryVariables>): Apollo.UseSuspenseQueryResult<LecturerRankingQuery, LecturerRankingQueryVariables>;
export function useLecturerRankingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LecturerRankingQuery, LecturerRankingQueryVariables>): Apollo.UseSuspenseQueryResult<LecturerRankingQuery | undefined, LecturerRankingQueryVariables>;
export function useLecturerRankingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LecturerRankingQuery, LecturerRankingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LecturerRankingQuery, LecturerRankingQueryVariables>(LecturerRankingDocument, options);
        }
export type LecturerRankingQueryHookResult = ReturnType<typeof useLecturerRankingQuery>;
export type LecturerRankingLazyQueryHookResult = ReturnType<typeof useLecturerRankingLazyQuery>;
export type LecturerRankingSuspenseQueryHookResult = ReturnType<typeof useLecturerRankingSuspenseQuery>;
export type LecturerRankingQueryResult = Apollo.QueryResult<LecturerRankingQuery, LecturerRankingQueryVariables>;
export function refetchLecturerRankingQuery(variables?: LecturerRankingQueryVariables) {
      return { query: LecturerRankingDocument, variables: variables }
    }
export const LecturerstWithPointsDocument = gql`
    query LecturerstWithPoints($filter: FilterArgs, $sort: SortArgs, $page: Int) {
  lecturers(filter: $filter, sort: $sort, pagination: {page: $page, size: 10}) {
    data {
      birth_date
      display_name
      email
      faculty_id
      gender
      learning
      learning_position
      lecturer_id
      mscb
      ngach
      phone
      position
      total_point
      username
      faculty {
        display_name
        faculty_id
        full_name
      }
      points(filter: $filter) {
        average_point
        class_num
        id
        max_point
        point
        display_name
      }
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useLecturerstWithPointsQuery__
 *
 * To run a query within a React component, call `useLecturerstWithPointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLecturerstWithPointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLecturerstWithPointsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useLecturerstWithPointsQuery(baseOptions?: Apollo.QueryHookOptions<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>(LecturerstWithPointsDocument, options);
      }
export function useLecturerstWithPointsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>(LecturerstWithPointsDocument, options);
        }
// @ts-ignore
export function useLecturerstWithPointsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>): Apollo.UseSuspenseQueryResult<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>;
export function useLecturerstWithPointsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>): Apollo.UseSuspenseQueryResult<LecturerstWithPointsQuery | undefined, LecturerstWithPointsQueryVariables>;
export function useLecturerstWithPointsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>(LecturerstWithPointsDocument, options);
        }
export type LecturerstWithPointsQueryHookResult = ReturnType<typeof useLecturerstWithPointsQuery>;
export type LecturerstWithPointsLazyQueryHookResult = ReturnType<typeof useLecturerstWithPointsLazyQuery>;
export type LecturerstWithPointsSuspenseQueryHookResult = ReturnType<typeof useLecturerstWithPointsSuspenseQuery>;
export type LecturerstWithPointsQueryResult = Apollo.QueryResult<LecturerstWithPointsQuery, LecturerstWithPointsQueryVariables>;
export function refetchLecturerstWithPointsQuery(variables?: LecturerstWithPointsQueryVariables) {
      return { query: LecturerstWithPointsDocument, variables: variables }
    }
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(password: $password, username: $username) {
    access_token
    user {
      displayName
      id
      password
      role
      username
      faculty {
        display_name
        faculty_id
        full_name
        is_displayed
      }
      lecturer {
        display_name
        email
        faculty_id
        gender
        learning
        learning_position
        lecturer_id
        mscb
        ngach
        phone
        position
        total_point
        username
      }
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LoginIntegrationDocument = gql`
    mutation LoginIntegration($token: String!) {
  loginIntegration(token: $token) {
    access_token
    user {
      displayName
      id
      password
      role
      username
      faculty {
        display_name
        faculty_id
        full_name
        is_displayed
      }
      lecturer {
        display_name
        email
        faculty_id
        gender
        learning
        learning_position
        lecturer_id
        mscb
        ngach
        phone
        position
        total_point
        username
      }
    }
  }
}
    `;
export type LoginIntegrationMutationFn = Apollo.MutationFunction<LoginIntegrationMutation, LoginIntegrationMutationVariables>;

/**
 * __useLoginIntegrationMutation__
 *
 * To run a mutation, you first call `useLoginIntegrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginIntegrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginIntegrationMutation, { data, loading, error }] = useLoginIntegrationMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useLoginIntegrationMutation(baseOptions?: Apollo.MutationHookOptions<LoginIntegrationMutation, LoginIntegrationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginIntegrationMutation, LoginIntegrationMutationVariables>(LoginIntegrationDocument, options);
      }
export type LoginIntegrationMutationHookResult = ReturnType<typeof useLoginIntegrationMutation>;
export type LoginIntegrationMutationResult = Apollo.MutationResult<LoginIntegrationMutation>;
export type LoginIntegrationMutationOptions = Apollo.BaseMutationOptions<LoginIntegrationMutation, LoginIntegrationMutationVariables>;
export const PointsEachSemesterDocument = gql`
    query PointsEachSemester($groupEntity: String!, $class_type: String, $faculty_id: String, $lecturer_id: String, $criteria_id: String, $semester_id: String, $program: String, $subjects: [String!]) {
  groupedPoints(
    groupEntity: $groupEntity
    size: 30
    class_type: $class_type
    faculty_id: $faculty_id
    lecturer_id: $lecturer_id
    criteria_id: $criteria_id
    semester_id: $semester_id
    program: $program
    subjects: $subjects
  ) {
    data {
      average_point
      median_point
      trimmed_mean_point
      class_num
      display_name
      id
      max_point
      point
    }
  }
}
    `;

/**
 * __usePointsEachSemesterQuery__
 *
 * To run a query within a React component, call `usePointsEachSemesterQuery` and pass it any options that fit your needs.
 * When your component renders, `usePointsEachSemesterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePointsEachSemesterQuery({
 *   variables: {
 *      groupEntity: // value for 'groupEntity'
 *      class_type: // value for 'class_type'
 *      faculty_id: // value for 'faculty_id'
 *      lecturer_id: // value for 'lecturer_id'
 *      criteria_id: // value for 'criteria_id'
 *      semester_id: // value for 'semester_id'
 *      program: // value for 'program'
 *      subjects: // value for 'subjects'
 *   },
 * });
 */
export function usePointsEachSemesterQuery(baseOptions: Apollo.QueryHookOptions<PointsEachSemesterQuery, PointsEachSemesterQueryVariables> & ({ variables: PointsEachSemesterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>(PointsEachSemesterDocument, options);
      }
export function usePointsEachSemesterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>(PointsEachSemesterDocument, options);
        }
// @ts-ignore
export function usePointsEachSemesterSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>): Apollo.UseSuspenseQueryResult<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>;
export function usePointsEachSemesterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>): Apollo.UseSuspenseQueryResult<PointsEachSemesterQuery | undefined, PointsEachSemesterQueryVariables>;
export function usePointsEachSemesterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>(PointsEachSemesterDocument, options);
        }
export type PointsEachSemesterQueryHookResult = ReturnType<typeof usePointsEachSemesterQuery>;
export type PointsEachSemesterLazyQueryHookResult = ReturnType<typeof usePointsEachSemesterLazyQuery>;
export type PointsEachSemesterSuspenseQueryHookResult = ReturnType<typeof usePointsEachSemesterSuspenseQuery>;
export type PointsEachSemesterQueryResult = Apollo.QueryResult<PointsEachSemesterQuery, PointsEachSemesterQueryVariables>;
export function refetchPointsEachSemesterQuery(variables: PointsEachSemesterQueryVariables) {
      return { query: PointsEachSemesterDocument, variables: variables }
    }
export const PointsWithGroupByDocument = gql`
    query PointsWithGroupBy($groupEntity: String!, $class_type: String, $faculty_id: String, $lecturer_id: String, $criteria_id: String, $semester_id: String, $program: String, $subjects: [String!]) {
  groupedPoints(
    groupEntity: $groupEntity
    size: 200
    class_type: $class_type
    faculty_id: $faculty_id
    lecturer_id: $lecturer_id
    criteria_id: $criteria_id
    semester_id: $semester_id
    program: $program
    subjects: $subjects
  ) {
    data {
      average_point
      median_point
      trimmed_mean_point
      class_num
      display_name
      id
      max_point
      point
    }
  }
}
    `;

/**
 * __usePointsWithGroupByQuery__
 *
 * To run a query within a React component, call `usePointsWithGroupByQuery` and pass it any options that fit your needs.
 * When your component renders, `usePointsWithGroupByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePointsWithGroupByQuery({
 *   variables: {
 *      groupEntity: // value for 'groupEntity'
 *      class_type: // value for 'class_type'
 *      faculty_id: // value for 'faculty_id'
 *      lecturer_id: // value for 'lecturer_id'
 *      criteria_id: // value for 'criteria_id'
 *      semester_id: // value for 'semester_id'
 *      program: // value for 'program'
 *      subjects: // value for 'subjects'
 *   },
 * });
 */
export function usePointsWithGroupByQuery(baseOptions: Apollo.QueryHookOptions<PointsWithGroupByQuery, PointsWithGroupByQueryVariables> & ({ variables: PointsWithGroupByQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>(PointsWithGroupByDocument, options);
      }
export function usePointsWithGroupByLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>(PointsWithGroupByDocument, options);
        }
// @ts-ignore
export function usePointsWithGroupBySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>): Apollo.UseSuspenseQueryResult<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>;
export function usePointsWithGroupBySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>): Apollo.UseSuspenseQueryResult<PointsWithGroupByQuery | undefined, PointsWithGroupByQueryVariables>;
export function usePointsWithGroupBySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>(PointsWithGroupByDocument, options);
        }
export type PointsWithGroupByQueryHookResult = ReturnType<typeof usePointsWithGroupByQuery>;
export type PointsWithGroupByLazyQueryHookResult = ReturnType<typeof usePointsWithGroupByLazyQuery>;
export type PointsWithGroupBySuspenseQueryHookResult = ReturnType<typeof usePointsWithGroupBySuspenseQuery>;
export type PointsWithGroupByQueryResult = Apollo.QueryResult<PointsWithGroupByQuery, PointsWithGroupByQueryVariables>;
export function refetchPointsWithGroupByQuery(variables: PointsWithGroupByQueryVariables) {
      return { query: PointsWithGroupByDocument, variables: variables }
    }
export const ProgramsDocument = gql`
    query Programs {
  programs {
    program
  }
}
    `;

/**
 * __useProgramsQuery__
 *
 * To run a query within a React component, call `useProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProgramsQuery(baseOptions?: Apollo.QueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
      }
export function useProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
        }
// @ts-ignore
export function useProgramsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>): Apollo.UseSuspenseQueryResult<ProgramsQuery, ProgramsQueryVariables>;
export function useProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>): Apollo.UseSuspenseQueryResult<ProgramsQuery | undefined, ProgramsQueryVariables>;
export function useProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
        }
export type ProgramsQueryHookResult = ReturnType<typeof useProgramsQuery>;
export type ProgramsLazyQueryHookResult = ReturnType<typeof useProgramsLazyQuery>;
export type ProgramsSuspenseQueryHookResult = ReturnType<typeof useProgramsSuspenseQuery>;
export type ProgramsQueryResult = Apollo.QueryResult<ProgramsQuery, ProgramsQueryVariables>;
export function refetchProgramsQuery(variables?: ProgramsQueryVariables) {
      return { query: ProgramsDocument, variables: variables }
    }
export const SemestersDocument = gql`
    query Semesters {
  semesters {
    display_name
    semester_id
    type
    year
  }
}
    `;

/**
 * __useSemestersQuery__
 *
 * To run a query within a React component, call `useSemestersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSemestersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSemestersQuery({
 *   variables: {
 *   },
 * });
 */
export function useSemestersQuery(baseOptions?: Apollo.QueryHookOptions<SemestersQuery, SemestersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SemestersQuery, SemestersQueryVariables>(SemestersDocument, options);
      }
export function useSemestersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SemestersQuery, SemestersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SemestersQuery, SemestersQueryVariables>(SemestersDocument, options);
        }
// @ts-ignore
export function useSemestersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SemestersQuery, SemestersQueryVariables>): Apollo.UseSuspenseQueryResult<SemestersQuery, SemestersQueryVariables>;
export function useSemestersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SemestersQuery, SemestersQueryVariables>): Apollo.UseSuspenseQueryResult<SemestersQuery | undefined, SemestersQueryVariables>;
export function useSemestersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SemestersQuery, SemestersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SemestersQuery, SemestersQueryVariables>(SemestersDocument, options);
        }
export type SemestersQueryHookResult = ReturnType<typeof useSemestersQuery>;
export type SemestersLazyQueryHookResult = ReturnType<typeof useSemestersLazyQuery>;
export type SemestersSuspenseQueryHookResult = ReturnType<typeof useSemestersSuspenseQuery>;
export type SemestersQueryResult = Apollo.QueryResult<SemestersQuery, SemestersQueryVariables>;
export function refetchSemestersQuery(variables?: SemestersQueryVariables) {
      return { query: SemestersDocument, variables: variables }
    }
export const AddStaffSurveyDataDocument = gql`
    mutation AddStaffSurveyData($data: StaffSurveySheetDTO!) {
  addNewStaffSurveyData(data: $data) {
    batch {
      display_name
      staff_survey_batch_id
      updated_at
    }
  }
}
    `;
export type AddStaffSurveyDataMutationFn = Apollo.MutationFunction<AddStaffSurveyDataMutation, AddStaffSurveyDataMutationVariables>;

/**
 * __useAddStaffSurveyDataMutation__
 *
 * To run a mutation, you first call `useAddStaffSurveyDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStaffSurveyDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStaffSurveyDataMutation, { data, loading, error }] = useAddStaffSurveyDataMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddStaffSurveyDataMutation(baseOptions?: Apollo.MutationHookOptions<AddStaffSurveyDataMutation, AddStaffSurveyDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddStaffSurveyDataMutation, AddStaffSurveyDataMutationVariables>(AddStaffSurveyDataDocument, options);
      }
export type AddStaffSurveyDataMutationHookResult = ReturnType<typeof useAddStaffSurveyDataMutation>;
export type AddStaffSurveyDataMutationResult = Apollo.MutationResult<AddStaffSurveyDataMutation>;
export type AddStaffSurveyDataMutationOptions = Apollo.BaseMutationOptions<AddStaffSurveyDataMutation, AddStaffSurveyDataMutationVariables>;
export const AddListStaffSurveyDataDocument = gql`
    mutation AddListStaffSurveyData($data: [StaffSurveySheetDTO!]!) {
  addListStaffSurveyData(data: $data) {
    batch {
      display_name
      staff_survey_batch_id
      updated_at
    }
  }
}
    `;
export type AddListStaffSurveyDataMutationFn = Apollo.MutationFunction<AddListStaffSurveyDataMutation, AddListStaffSurveyDataMutationVariables>;

/**
 * __useAddListStaffSurveyDataMutation__
 *
 * To run a mutation, you first call `useAddListStaffSurveyDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddListStaffSurveyDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addListStaffSurveyDataMutation, { data, loading, error }] = useAddListStaffSurveyDataMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddListStaffSurveyDataMutation(baseOptions?: Apollo.MutationHookOptions<AddListStaffSurveyDataMutation, AddListStaffSurveyDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddListStaffSurveyDataMutation, AddListStaffSurveyDataMutationVariables>(AddListStaffSurveyDataDocument, options);
      }
export type AddListStaffSurveyDataMutationHookResult = ReturnType<typeof useAddListStaffSurveyDataMutation>;
export type AddListStaffSurveyDataMutationResult = Apollo.MutationResult<AddListStaffSurveyDataMutation>;
export type AddListStaffSurveyDataMutationOptions = Apollo.BaseMutationOptions<AddListStaffSurveyDataMutation, AddListStaffSurveyDataMutationVariables>;
export const GetStaffSurveyCriteriaListDocument = gql`
    query GetStaffSurveyCriteriaList {
  getCriteriaList {
    category
    display_name
    index
    semesters
    staff_survey_criteria_id
    mapping_id
    is_shown
  }
}
    `;

/**
 * __useGetStaffSurveyCriteriaListQuery__
 *
 * To run a query within a React component, call `useGetStaffSurveyCriteriaListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffSurveyCriteriaListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffSurveyCriteriaListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStaffSurveyCriteriaListQuery(baseOptions?: Apollo.QueryHookOptions<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>(GetStaffSurveyCriteriaListDocument, options);
      }
export function useGetStaffSurveyCriteriaListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>(GetStaffSurveyCriteriaListDocument, options);
        }
// @ts-ignore
export function useGetStaffSurveyCriteriaListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>;
export function useGetStaffSurveyCriteriaListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyCriteriaListQuery | undefined, GetStaffSurveyCriteriaListQueryVariables>;
export function useGetStaffSurveyCriteriaListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>(GetStaffSurveyCriteriaListDocument, options);
        }
export type GetStaffSurveyCriteriaListQueryHookResult = ReturnType<typeof useGetStaffSurveyCriteriaListQuery>;
export type GetStaffSurveyCriteriaListLazyQueryHookResult = ReturnType<typeof useGetStaffSurveyCriteriaListLazyQuery>;
export type GetStaffSurveyCriteriaListSuspenseQueryHookResult = ReturnType<typeof useGetStaffSurveyCriteriaListSuspenseQuery>;
export type GetStaffSurveyCriteriaListQueryResult = Apollo.QueryResult<GetStaffSurveyCriteriaListQuery, GetStaffSurveyCriteriaListQueryVariables>;
export function refetchGetStaffSurveyCriteriaListQuery(variables?: GetStaffSurveyCriteriaListQueryVariables) {
      return { query: GetStaffSurveyCriteriaListDocument, variables: variables }
    }
export const GetStaffSurveyBatchListDocument = gql`
    query GetStaffSurveyBatchList {
  getBatchList {
    display_name
    staff_survey_batch_id
    updated_at
  }
}
    `;

/**
 * __useGetStaffSurveyBatchListQuery__
 *
 * To run a query within a React component, call `useGetStaffSurveyBatchListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffSurveyBatchListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffSurveyBatchListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStaffSurveyBatchListQuery(baseOptions?: Apollo.QueryHookOptions<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>(GetStaffSurveyBatchListDocument, options);
      }
export function useGetStaffSurveyBatchListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>(GetStaffSurveyBatchListDocument, options);
        }
// @ts-ignore
export function useGetStaffSurveyBatchListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>;
export function useGetStaffSurveyBatchListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyBatchListQuery | undefined, GetStaffSurveyBatchListQueryVariables>;
export function useGetStaffSurveyBatchListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>(GetStaffSurveyBatchListDocument, options);
        }
export type GetStaffSurveyBatchListQueryHookResult = ReturnType<typeof useGetStaffSurveyBatchListQuery>;
export type GetStaffSurveyBatchListLazyQueryHookResult = ReturnType<typeof useGetStaffSurveyBatchListLazyQuery>;
export type GetStaffSurveyBatchListSuspenseQueryHookResult = ReturnType<typeof useGetStaffSurveyBatchListSuspenseQuery>;
export type GetStaffSurveyBatchListQueryResult = Apollo.QueryResult<GetStaffSurveyBatchListQuery, GetStaffSurveyBatchListQueryVariables>;
export function refetchGetStaffSurveyBatchListQuery(variables?: GetStaffSurveyBatchListQueryVariables) {
      return { query: GetStaffSurveyBatchListDocument, variables: variables }
    }
export const GetSurveySemesterListDocument = gql`
    query GetSurveySemesterList {
  getSurveySemesterList
}
    `;

/**
 * __useGetSurveySemesterListQuery__
 *
 * To run a query within a React component, call `useGetSurveySemesterListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSurveySemesterListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSurveySemesterListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSurveySemesterListQuery(baseOptions?: Apollo.QueryHookOptions<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>(GetSurveySemesterListDocument, options);
      }
export function useGetSurveySemesterListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>(GetSurveySemesterListDocument, options);
        }
// @ts-ignore
export function useGetSurveySemesterListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>;
export function useGetSurveySemesterListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSurveySemesterListQuery | undefined, GetSurveySemesterListQueryVariables>;
export function useGetSurveySemesterListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>(GetSurveySemesterListDocument, options);
        }
export type GetSurveySemesterListQueryHookResult = ReturnType<typeof useGetSurveySemesterListQuery>;
export type GetSurveySemesterListLazyQueryHookResult = ReturnType<typeof useGetSurveySemesterListLazyQuery>;
export type GetSurveySemesterListSuspenseQueryHookResult = ReturnType<typeof useGetSurveySemesterListSuspenseQuery>;
export type GetSurveySemesterListQueryResult = Apollo.QueryResult<GetSurveySemesterListQuery, GetSurveySemesterListQueryVariables>;
export function refetchGetSurveySemesterListQuery(variables?: GetSurveySemesterListQueryVariables) {
      return { query: GetSurveySemesterListDocument, variables: variables }
    }
export const GetPointsByCategoryDocument = gql`
    query GetPointsByCategory($semester: String, $showUnit: Boolean) {
  getPointsByCategory(semester: $semester, showUnit: $showUnit) {
    avg_point
    category
    is_unit
  }
}
    `;

/**
 * __useGetPointsByCategoryQuery__
 *
 * To run a query within a React component, call `useGetPointsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPointsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPointsByCategoryQuery({
 *   variables: {
 *      semester: // value for 'semester'
 *      showUnit: // value for 'showUnit'
 *   },
 * });
 */
export function useGetPointsByCategoryQuery(baseOptions?: Apollo.QueryHookOptions<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>(GetPointsByCategoryDocument, options);
      }
export function useGetPointsByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>(GetPointsByCategoryDocument, options);
        }
// @ts-ignore
export function useGetPointsByCategorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>;
export function useGetPointsByCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointsByCategoryQuery | undefined, GetPointsByCategoryQueryVariables>;
export function useGetPointsByCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>(GetPointsByCategoryDocument, options);
        }
export type GetPointsByCategoryQueryHookResult = ReturnType<typeof useGetPointsByCategoryQuery>;
export type GetPointsByCategoryLazyQueryHookResult = ReturnType<typeof useGetPointsByCategoryLazyQuery>;
export type GetPointsByCategorySuspenseQueryHookResult = ReturnType<typeof useGetPointsByCategorySuspenseQuery>;
export type GetPointsByCategoryQueryResult = Apollo.QueryResult<GetPointsByCategoryQuery, GetPointsByCategoryQueryVariables>;
export function refetchGetPointsByCategoryQuery(variables?: GetPointsByCategoryQueryVariables) {
      return { query: GetPointsByCategoryDocument, variables: variables }
    }
export const GetPointsByCategoryDonViDocument = gql`
    query GetPointsByCategoryDonVi($semester: String) {
  getPointsByCategoryDonVi(semester: $semester) {
    avg_point
    category
  }
}
    `;

/**
 * __useGetPointsByCategoryDonViQuery__
 *
 * To run a query within a React component, call `useGetPointsByCategoryDonViQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPointsByCategoryDonViQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPointsByCategoryDonViQuery({
 *   variables: {
 *      semester: // value for 'semester'
 *   },
 * });
 */
export function useGetPointsByCategoryDonViQuery(baseOptions?: Apollo.QueryHookOptions<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>(GetPointsByCategoryDonViDocument, options);
      }
export function useGetPointsByCategoryDonViLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>(GetPointsByCategoryDonViDocument, options);
        }
// @ts-ignore
export function useGetPointsByCategoryDonViSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>;
export function useGetPointsByCategoryDonViSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointsByCategoryDonViQuery | undefined, GetPointsByCategoryDonViQueryVariables>;
export function useGetPointsByCategoryDonViSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>(GetPointsByCategoryDonViDocument, options);
        }
export type GetPointsByCategoryDonViQueryHookResult = ReturnType<typeof useGetPointsByCategoryDonViQuery>;
export type GetPointsByCategoryDonViLazyQueryHookResult = ReturnType<typeof useGetPointsByCategoryDonViLazyQuery>;
export type GetPointsByCategoryDonViSuspenseQueryHookResult = ReturnType<typeof useGetPointsByCategoryDonViSuspenseQuery>;
export type GetPointsByCategoryDonViQueryResult = Apollo.QueryResult<GetPointsByCategoryDonViQuery, GetPointsByCategoryDonViQueryVariables>;
export function refetchGetPointsByCategoryDonViQuery(variables?: GetPointsByCategoryDonViQueryVariables) {
      return { query: GetPointsByCategoryDonViDocument, variables: variables }
    }
export const GetPointsByCriteriaDocument = gql`
    query GetPointsByCriteria($category: String!, $semester: String, $displayName: String) {
  getPointsByCriteria(
    category: $category
    semester: $semester
    displayName: $displayName
  ) {
    avg_point
    criteria
    index
  }
}
    `;

/**
 * __useGetPointsByCriteriaQuery__
 *
 * To run a query within a React component, call `useGetPointsByCriteriaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPointsByCriteriaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPointsByCriteriaQuery({
 *   variables: {
 *      category: // value for 'category'
 *      semester: // value for 'semester'
 *      displayName: // value for 'displayName'
 *   },
 * });
 */
export function useGetPointsByCriteriaQuery(baseOptions: Apollo.QueryHookOptions<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables> & ({ variables: GetPointsByCriteriaQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>(GetPointsByCriteriaDocument, options);
      }
export function useGetPointsByCriteriaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>(GetPointsByCriteriaDocument, options);
        }
// @ts-ignore
export function useGetPointsByCriteriaSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>;
export function useGetPointsByCriteriaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointsByCriteriaQuery | undefined, GetPointsByCriteriaQueryVariables>;
export function useGetPointsByCriteriaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>(GetPointsByCriteriaDocument, options);
        }
export type GetPointsByCriteriaQueryHookResult = ReturnType<typeof useGetPointsByCriteriaQuery>;
export type GetPointsByCriteriaLazyQueryHookResult = ReturnType<typeof useGetPointsByCriteriaLazyQuery>;
export type GetPointsByCriteriaSuspenseQueryHookResult = ReturnType<typeof useGetPointsByCriteriaSuspenseQuery>;
export type GetPointsByCriteriaQueryResult = Apollo.QueryResult<GetPointsByCriteriaQuery, GetPointsByCriteriaQueryVariables>;
export function refetchGetPointsByCriteriaQuery(variables: GetPointsByCriteriaQueryVariables) {
      return { query: GetPointsByCriteriaDocument, variables: variables }
    }
export const GetPointWithCommentByCriteriaDocument = gql`
    query GetPointWithCommentByCriteria($category: String, $page: Int, $semester: String, $displayName: String) {
  getPointWithCommentByCriteria(
    category: $category
    pagination: {page: $page}
    semester: $semester
    displayName: $displayName
  ) {
    data {
      criteria
      index
      point
      comment
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useGetPointWithCommentByCriteriaQuery__
 *
 * To run a query within a React component, call `useGetPointWithCommentByCriteriaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPointWithCommentByCriteriaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPointWithCommentByCriteriaQuery({
 *   variables: {
 *      category: // value for 'category'
 *      page: // value for 'page'
 *      semester: // value for 'semester'
 *      displayName: // value for 'displayName'
 *   },
 * });
 */
export function useGetPointWithCommentByCriteriaQuery(baseOptions?: Apollo.QueryHookOptions<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>(GetPointWithCommentByCriteriaDocument, options);
      }
export function useGetPointWithCommentByCriteriaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>(GetPointWithCommentByCriteriaDocument, options);
        }
// @ts-ignore
export function useGetPointWithCommentByCriteriaSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>;
export function useGetPointWithCommentByCriteriaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>): Apollo.UseSuspenseQueryResult<GetPointWithCommentByCriteriaQuery | undefined, GetPointWithCommentByCriteriaQueryVariables>;
export function useGetPointWithCommentByCriteriaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>(GetPointWithCommentByCriteriaDocument, options);
        }
export type GetPointWithCommentByCriteriaQueryHookResult = ReturnType<typeof useGetPointWithCommentByCriteriaQuery>;
export type GetPointWithCommentByCriteriaLazyQueryHookResult = ReturnType<typeof useGetPointWithCommentByCriteriaLazyQuery>;
export type GetPointWithCommentByCriteriaSuspenseQueryHookResult = ReturnType<typeof useGetPointWithCommentByCriteriaSuspenseQuery>;
export type GetPointWithCommentByCriteriaQueryResult = Apollo.QueryResult<GetPointWithCommentByCriteriaQuery, GetPointWithCommentByCriteriaQueryVariables>;
export function refetchGetPointWithCommentByCriteriaQuery(variables?: GetPointWithCommentByCriteriaQueryVariables) {
      return { query: GetPointWithCommentByCriteriaDocument, variables: variables }
    }
export const GetStaffSurveyCommentCountDocument = gql`
    query GetStaffSurveyCommentCount($category: String, $semester: String, $displayName: String) {
  getStaffSurveyCommentCount(
    category: $category
    semester: $semester
    displayName: $displayName
  )
}
    `;

/**
 * __useGetStaffSurveyCommentCountQuery__
 *
 * To run a query within a React component, call `useGetStaffSurveyCommentCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffSurveyCommentCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffSurveyCommentCountQuery({
 *   variables: {
 *      category: // value for 'category'
 *      semester: // value for 'semester'
 *      displayName: // value for 'displayName'
 *   },
 * });
 */
export function useGetStaffSurveyCommentCountQuery(baseOptions?: Apollo.QueryHookOptions<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>(GetStaffSurveyCommentCountDocument, options);
      }
export function useGetStaffSurveyCommentCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>(GetStaffSurveyCommentCountDocument, options);
        }
// @ts-ignore
export function useGetStaffSurveyCommentCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>;
export function useGetStaffSurveyCommentCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyCommentCountQuery | undefined, GetStaffSurveyCommentCountQueryVariables>;
export function useGetStaffSurveyCommentCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>(GetStaffSurveyCommentCountDocument, options);
        }
export type GetStaffSurveyCommentCountQueryHookResult = ReturnType<typeof useGetStaffSurveyCommentCountQuery>;
export type GetStaffSurveyCommentCountLazyQueryHookResult = ReturnType<typeof useGetStaffSurveyCommentCountLazyQuery>;
export type GetStaffSurveyCommentCountSuspenseQueryHookResult = ReturnType<typeof useGetStaffSurveyCommentCountSuspenseQuery>;
export type GetStaffSurveyCommentCountQueryResult = Apollo.QueryResult<GetStaffSurveyCommentCountQuery, GetStaffSurveyCommentCountQueryVariables>;
export function refetchGetStaffSurveyCommentCountQuery(variables?: GetStaffSurveyCommentCountQueryVariables) {
      return { query: GetStaffSurveyCommentCountDocument, variables: variables }
    }
export const GetAllCommentsDocument = gql`
    query GetAllComments($page: Int, $semester: String, $keyword: String) {
  getAllComments(
    pagination: {page: $page}
    semester: $semester
    keyword: $keyword
  ) {
    data {
      criteria
      index
      point
      comment
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useGetAllCommentsQuery__
 *
 * To run a query within a React component, call `useGetAllCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCommentsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      semester: // value for 'semester'
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function useGetAllCommentsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCommentsQuery, GetAllCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCommentsQuery, GetAllCommentsQueryVariables>(GetAllCommentsDocument, options);
      }
export function useGetAllCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCommentsQuery, GetAllCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCommentsQuery, GetAllCommentsQueryVariables>(GetAllCommentsDocument, options);
        }
// @ts-ignore
export function useGetAllCommentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllCommentsQuery, GetAllCommentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCommentsQuery, GetAllCommentsQueryVariables>;
export function useGetAllCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCommentsQuery, GetAllCommentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCommentsQuery | undefined, GetAllCommentsQueryVariables>;
export function useGetAllCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCommentsQuery, GetAllCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCommentsQuery, GetAllCommentsQueryVariables>(GetAllCommentsDocument, options);
        }
export type GetAllCommentsQueryHookResult = ReturnType<typeof useGetAllCommentsQuery>;
export type GetAllCommentsLazyQueryHookResult = ReturnType<typeof useGetAllCommentsLazyQuery>;
export type GetAllCommentsSuspenseQueryHookResult = ReturnType<typeof useGetAllCommentsSuspenseQuery>;
export type GetAllCommentsQueryResult = Apollo.QueryResult<GetAllCommentsQuery, GetAllCommentsQueryVariables>;
export function refetchGetAllCommentsQuery(variables?: GetAllCommentsQueryVariables) {
      return { query: GetAllCommentsDocument, variables: variables }
    }
export const GetAllCommentsCountDocument = gql`
    query GetAllCommentsCount($semester: String, $keyword: String) {
  getAllCommentsCount(semester: $semester, keyword: $keyword)
}
    `;

/**
 * __useGetAllCommentsCountQuery__
 *
 * To run a query within a React component, call `useGetAllCommentsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCommentsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCommentsCountQuery({
 *   variables: {
 *      semester: // value for 'semester'
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function useGetAllCommentsCountQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>(GetAllCommentsCountDocument, options);
      }
export function useGetAllCommentsCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>(GetAllCommentsCountDocument, options);
        }
// @ts-ignore
export function useGetAllCommentsCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>;
export function useGetAllCommentsCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllCommentsCountQuery | undefined, GetAllCommentsCountQueryVariables>;
export function useGetAllCommentsCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>(GetAllCommentsCountDocument, options);
        }
export type GetAllCommentsCountQueryHookResult = ReturnType<typeof useGetAllCommentsCountQuery>;
export type GetAllCommentsCountLazyQueryHookResult = ReturnType<typeof useGetAllCommentsCountLazyQuery>;
export type GetAllCommentsCountSuspenseQueryHookResult = ReturnType<typeof useGetAllCommentsCountSuspenseQuery>;
export type GetAllCommentsCountQueryResult = Apollo.QueryResult<GetAllCommentsCountQuery, GetAllCommentsCountQueryVariables>;
export function refetchGetAllCommentsCountQuery(variables?: GetAllCommentsCountQueryVariables) {
      return { query: GetAllCommentsCountDocument, variables: variables }
    }
export const GetStaffSurveyPointsByYearDocument = gql`
    query GetStaffSurveyPointsByYear {
  getStaffSurveyPointsByYear {
    avg_point
    year
  }
}
    `;

/**
 * __useGetStaffSurveyPointsByYearQuery__
 *
 * To run a query within a React component, call `useGetStaffSurveyPointsByYearQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffSurveyPointsByYearQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffSurveyPointsByYearQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStaffSurveyPointsByYearQuery(baseOptions?: Apollo.QueryHookOptions<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>(GetStaffSurveyPointsByYearDocument, options);
      }
export function useGetStaffSurveyPointsByYearLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>(GetStaffSurveyPointsByYearDocument, options);
        }
// @ts-ignore
export function useGetStaffSurveyPointsByYearSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>;
export function useGetStaffSurveyPointsByYearSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyPointsByYearQuery | undefined, GetStaffSurveyPointsByYearQueryVariables>;
export function useGetStaffSurveyPointsByYearSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>(GetStaffSurveyPointsByYearDocument, options);
        }
export type GetStaffSurveyPointsByYearQueryHookResult = ReturnType<typeof useGetStaffSurveyPointsByYearQuery>;
export type GetStaffSurveyPointsByYearLazyQueryHookResult = ReturnType<typeof useGetStaffSurveyPointsByYearLazyQuery>;
export type GetStaffSurveyPointsByYearSuspenseQueryHookResult = ReturnType<typeof useGetStaffSurveyPointsByYearSuspenseQuery>;
export type GetStaffSurveyPointsByYearQueryResult = Apollo.QueryResult<GetStaffSurveyPointsByYearQuery, GetStaffSurveyPointsByYearQueryVariables>;
export function refetchGetStaffSurveyPointsByYearQuery(variables?: GetStaffSurveyPointsByYearQueryVariables) {
      return { query: GetStaffSurveyPointsByYearDocument, variables: variables }
    }
export const GetStaffSurveyPointsByCategoryAndYearDocument = gql`
    query GetStaffSurveyPointsByCategoryAndYear {
  getStaffSurveyPointsByCategoryAndYear {
    avg_point
    category
    year
  }
}
    `;

/**
 * __useGetStaffSurveyPointsByCategoryAndYearQuery__
 *
 * To run a query within a React component, call `useGetStaffSurveyPointsByCategoryAndYearQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffSurveyPointsByCategoryAndYearQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffSurveyPointsByCategoryAndYearQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStaffSurveyPointsByCategoryAndYearQuery(baseOptions?: Apollo.QueryHookOptions<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>(GetStaffSurveyPointsByCategoryAndYearDocument, options);
      }
export function useGetStaffSurveyPointsByCategoryAndYearLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>(GetStaffSurveyPointsByCategoryAndYearDocument, options);
        }
// @ts-ignore
export function useGetStaffSurveyPointsByCategoryAndYearSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>;
export function useGetStaffSurveyPointsByCategoryAndYearSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>): Apollo.UseSuspenseQueryResult<GetStaffSurveyPointsByCategoryAndYearQuery | undefined, GetStaffSurveyPointsByCategoryAndYearQueryVariables>;
export function useGetStaffSurveyPointsByCategoryAndYearSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>(GetStaffSurveyPointsByCategoryAndYearDocument, options);
        }
export type GetStaffSurveyPointsByCategoryAndYearQueryHookResult = ReturnType<typeof useGetStaffSurveyPointsByCategoryAndYearQuery>;
export type GetStaffSurveyPointsByCategoryAndYearLazyQueryHookResult = ReturnType<typeof useGetStaffSurveyPointsByCategoryAndYearLazyQuery>;
export type GetStaffSurveyPointsByCategoryAndYearSuspenseQueryHookResult = ReturnType<typeof useGetStaffSurveyPointsByCategoryAndYearSuspenseQuery>;
export type GetStaffSurveyPointsByCategoryAndYearQueryResult = Apollo.QueryResult<GetStaffSurveyPointsByCategoryAndYearQuery, GetStaffSurveyPointsByCategoryAndYearQueryVariables>;
export function refetchGetStaffSurveyPointsByCategoryAndYearQuery(variables?: GetStaffSurveyPointsByCategoryAndYearQueryVariables) {
      return { query: GetStaffSurveyPointsByCategoryAndYearDocument, variables: variables }
    }
export const UpdateStaffSurveyCriteriaDocument = gql`
    mutation UpdateStaffSurveyCriteria($id: String!, $is_shown: Boolean!) {
  updateStaffSurveyCriteria(id: $id, is_shown: $is_shown) {
    staff_survey_criteria_id
    is_shown
  }
}
    `;
export type UpdateStaffSurveyCriteriaMutationFn = Apollo.MutationFunction<UpdateStaffSurveyCriteriaMutation, UpdateStaffSurveyCriteriaMutationVariables>;

/**
 * __useUpdateStaffSurveyCriteriaMutation__
 *
 * To run a mutation, you first call `useUpdateStaffSurveyCriteriaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStaffSurveyCriteriaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStaffSurveyCriteriaMutation, { data, loading, error }] = useUpdateStaffSurveyCriteriaMutation({
 *   variables: {
 *      id: // value for 'id'
 *      is_shown: // value for 'is_shown'
 *   },
 * });
 */
export function useUpdateStaffSurveyCriteriaMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffSurveyCriteriaMutation, UpdateStaffSurveyCriteriaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStaffSurveyCriteriaMutation, UpdateStaffSurveyCriteriaMutationVariables>(UpdateStaffSurveyCriteriaDocument, options);
      }
export type UpdateStaffSurveyCriteriaMutationHookResult = ReturnType<typeof useUpdateStaffSurveyCriteriaMutation>;
export type UpdateStaffSurveyCriteriaMutationResult = Apollo.MutationResult<UpdateStaffSurveyCriteriaMutation>;
export type UpdateStaffSurveyCriteriaMutationOptions = Apollo.BaseMutationOptions<UpdateStaffSurveyCriteriaMutation, UpdateStaffSurveyCriteriaMutationVariables>;
export const DetailSubjectDocument = gql`
    query DetailSubject($id: String!) {
  subject(id: $id) {
    display_name
    faculty_id
    subject_id
    total_point
    faculty {
      display_name
      faculty_id
      full_name
      is_displayed
    }
  }
}
    `;

/**
 * __useDetailSubjectQuery__
 *
 * To run a query within a React component, call `useDetailSubjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailSubjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailSubjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailSubjectQuery(baseOptions: Apollo.QueryHookOptions<DetailSubjectQuery, DetailSubjectQueryVariables> & ({ variables: DetailSubjectQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailSubjectQuery, DetailSubjectQueryVariables>(DetailSubjectDocument, options);
      }
export function useDetailSubjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailSubjectQuery, DetailSubjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailSubjectQuery, DetailSubjectQueryVariables>(DetailSubjectDocument, options);
        }
// @ts-ignore
export function useDetailSubjectSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DetailSubjectQuery, DetailSubjectQueryVariables>): Apollo.UseSuspenseQueryResult<DetailSubjectQuery, DetailSubjectQueryVariables>;
export function useDetailSubjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailSubjectQuery, DetailSubjectQueryVariables>): Apollo.UseSuspenseQueryResult<DetailSubjectQuery | undefined, DetailSubjectQueryVariables>;
export function useDetailSubjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DetailSubjectQuery, DetailSubjectQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DetailSubjectQuery, DetailSubjectQueryVariables>(DetailSubjectDocument, options);
        }
export type DetailSubjectQueryHookResult = ReturnType<typeof useDetailSubjectQuery>;
export type DetailSubjectLazyQueryHookResult = ReturnType<typeof useDetailSubjectLazyQuery>;
export type DetailSubjectSuspenseQueryHookResult = ReturnType<typeof useDetailSubjectSuspenseQuery>;
export type DetailSubjectQueryResult = Apollo.QueryResult<DetailSubjectQuery, DetailSubjectQueryVariables>;
export function refetchDetailSubjectQuery(variables: DetailSubjectQueryVariables) {
      return { query: DetailSubjectDocument, variables: variables }
    }
export const SubjectsDocument = gql`
    query Subjects($filter: FilterArgs, $isAscending: Boolean, $page: Int) {
  subjects(
    filter: $filter
    pagination: {page: $page, size: 10}
    sort: {isAscending: $isAscending}
  ) {
    data {
      display_name
      faculty_id
      subject_id
      total_point
      faculty {
        display_name
        faculty_id
        full_name
      }
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useSubjectsQuery__
 *
 * To run a query within a React component, call `useSubjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      isAscending: // value for 'isAscending'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useSubjectsQuery(baseOptions?: Apollo.QueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, options);
      }
export function useSubjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, options);
        }
// @ts-ignore
export function useSubjectsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>): Apollo.UseSuspenseQueryResult<SubjectsQuery, SubjectsQueryVariables>;
export function useSubjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>): Apollo.UseSuspenseQueryResult<SubjectsQuery | undefined, SubjectsQueryVariables>;
export function useSubjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SubjectsQuery, SubjectsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SubjectsQuery, SubjectsQueryVariables>(SubjectsDocument, options);
        }
export type SubjectsQueryHookResult = ReturnType<typeof useSubjectsQuery>;
export type SubjectsLazyQueryHookResult = ReturnType<typeof useSubjectsLazyQuery>;
export type SubjectsSuspenseQueryHookResult = ReturnType<typeof useSubjectsSuspenseQuery>;
export type SubjectsQueryResult = Apollo.QueryResult<SubjectsQuery, SubjectsQueryVariables>;
export function refetchSubjectsQuery(variables?: SubjectsQueryVariables) {
      return { query: SubjectsDocument, variables: variables }
    }
export const AllSubjectsDocument = gql`
    query AllSubjects($filter: FilterArgs, $sort: SortArgs) {
  subjects(filter: $filter, sort: $sort, pagination: {page: 0, size: 1000}) {
    data {
      display_name
      faculty_id
      subject_id
      total_point
    }
  }
}
    `;

/**
 * __useAllSubjectsQuery__
 *
 * To run a query within a React component, call `useAllSubjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllSubjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllSubjectsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useAllSubjectsQuery(baseOptions?: Apollo.QueryHookOptions<AllSubjectsQuery, AllSubjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllSubjectsQuery, AllSubjectsQueryVariables>(AllSubjectsDocument, options);
      }
export function useAllSubjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllSubjectsQuery, AllSubjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllSubjectsQuery, AllSubjectsQueryVariables>(AllSubjectsDocument, options);
        }
// @ts-ignore
export function useAllSubjectsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AllSubjectsQuery, AllSubjectsQueryVariables>): Apollo.UseSuspenseQueryResult<AllSubjectsQuery, AllSubjectsQueryVariables>;
export function useAllSubjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllSubjectsQuery, AllSubjectsQueryVariables>): Apollo.UseSuspenseQueryResult<AllSubjectsQuery | undefined, AllSubjectsQueryVariables>;
export function useAllSubjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllSubjectsQuery, AllSubjectsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllSubjectsQuery, AllSubjectsQueryVariables>(AllSubjectsDocument, options);
        }
export type AllSubjectsQueryHookResult = ReturnType<typeof useAllSubjectsQuery>;
export type AllSubjectsLazyQueryHookResult = ReturnType<typeof useAllSubjectsLazyQuery>;
export type AllSubjectsSuspenseQueryHookResult = ReturnType<typeof useAllSubjectsSuspenseQuery>;
export type AllSubjectsQueryResult = Apollo.QueryResult<AllSubjectsQuery, AllSubjectsQueryVariables>;
export function refetchAllSubjectsQuery(variables?: AllSubjectsQueryVariables) {
      return { query: AllSubjectsDocument, variables: variables }
    }
export const SubjectsWithPointsDocument = gql`
    query SubjectsWithPoints($filter: FilterArgs, $sort: SortArgs, $page: Int) {
  subjects(filter: $filter, sort: $sort, pagination: {page: $page, size: 10}) {
    data {
      display_name
      faculty_id
      subject_id
      total_point
      faculty {
        display_name
        faculty_id
        full_name
      }
      points(filter: $filter) {
        average_point
        class_num
        id
        max_point
        point
        display_name
      }
    }
    meta {
      hasNext
      hasPrev
      page
      size
      total_item
      total_page
    }
  }
}
    `;

/**
 * __useSubjectsWithPointsQuery__
 *
 * To run a query within a React component, call `useSubjectsWithPointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectsWithPointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectsWithPointsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useSubjectsWithPointsQuery(baseOptions?: Apollo.QueryHookOptions<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>(SubjectsWithPointsDocument, options);
      }
export function useSubjectsWithPointsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>(SubjectsWithPointsDocument, options);
        }
// @ts-ignore
export function useSubjectsWithPointsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>): Apollo.UseSuspenseQueryResult<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>;
export function useSubjectsWithPointsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>): Apollo.UseSuspenseQueryResult<SubjectsWithPointsQuery | undefined, SubjectsWithPointsQueryVariables>;
export function useSubjectsWithPointsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>(SubjectsWithPointsDocument, options);
        }
export type SubjectsWithPointsQueryHookResult = ReturnType<typeof useSubjectsWithPointsQuery>;
export type SubjectsWithPointsLazyQueryHookResult = ReturnType<typeof useSubjectsWithPointsLazyQuery>;
export type SubjectsWithPointsSuspenseQueryHookResult = ReturnType<typeof useSubjectsWithPointsSuspenseQuery>;
export type SubjectsWithPointsQueryResult = Apollo.QueryResult<SubjectsWithPointsQuery, SubjectsWithPointsQueryVariables>;
export function refetchSubjectsWithPointsQuery(variables?: SubjectsWithPointsQueryVariables) {
      return { query: SubjectsWithPointsDocument, variables: variables }
    }
export const UsersDocument = gql`
    query Users($name: String) {
  users(name: $name) {
    displayName
    id
    password
    role
    username
    lastAccess
    faculty {
      display_name
      faculty_id
      full_name
      is_displayed
    }
    lecturer {
      birth_date
      display_name
      email
      faculty_id
      gender
      learning
      learning_position
      lecturer_id
      mscb
      ngach
      phone
      position
      total_point
      username
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
// @ts-ignore
export function useUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>): Apollo.UseSuspenseQueryResult<UsersQuery, UsersQueryVariables>;
export function useUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>): Apollo.UseSuspenseQueryResult<UsersQuery | undefined, UsersQueryVariables>;
export function useUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
    }
export const ProfileDocument = gql`
    query Profile {
  profile {
    displayName
    id
    password
    role
    username
    faculty {
      display_name
      faculty_id
      full_name
      is_displayed
    }
    lecturer {
      display_name
      email
      faculty_id
      gender
      learning
      learning_position
      lecturer_id
      mscb
      ngach
      phone
      position
      total_point
      username
    }
  }
}
    `;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(baseOptions?: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
// @ts-ignore
export function useProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>): Apollo.UseSuspenseQueryResult<ProfileQuery, ProfileQueryVariables>;
export function useProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>): Apollo.UseSuspenseQueryResult<ProfileQuery | undefined, ProfileQueryVariables>;
export function useProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<typeof useProfileSuspenseQuery>;
export type ProfileQueryResult = Apollo.QueryResult<ProfileQuery, ProfileQueryVariables>;
export function refetchProfileQuery(variables?: ProfileQueryVariables) {
      return { query: ProfileDocument, variables: variables }
    }
export const RegisterUserDocument = gql`
    mutation RegisterUser($user: UserDto!) {
  registerUser(user: $user) {
    displayName
    id
    password
    role
    username
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($user: UpdateUserDto!) {
  updateUser(user: $user) {
    displayName
    id
    password
    role
    username
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const RemoveUserDocument = gql`
    mutation RemoveUser($id: String!) {
  removeUser(id: $id)
}
    `;
export type RemoveUserMutationFn = Apollo.MutationFunction<RemoveUserMutation, RemoveUserMutationVariables>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserMutation, RemoveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(RemoveUserDocument, options);
      }
export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;
export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<RemoveUserMutation, RemoveUserMutationVariables>;