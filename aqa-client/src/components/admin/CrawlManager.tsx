"use client";

import { 
  useGetCrawlJobsQuery,
  useRunCrawlSubjectSurveyMutation,
  useRunCrawlLecturerSurveyMutation,
  useRunCrawlStaffSurveyMutation,
  useRunAggregatePointsMutation,
  useRunTransferDataMutation,
  CrawlJobType,
  CrawlJobStatus
} from "@/gql/graphql";
import { CrawlJobCard } from "./CrawlJobCard";
import { useEffect, useMemo, useState } from "react";
import { LecturerSurveySelectModal } from "./LecturerSurveySelectModal";
import { SurveyCrawlHistoryTable } from "./SurveyCrawlHistoryTable";
import { useDisclosure } from "@heroui/react";

export const CrawlManager = () => {
  const { data, loading, refetch, startPolling, stopPolling } = useGetCrawlJobsQuery({
    fetchPolicy: "network-only",
  });

  const jobs = useMemo(() => data?.crawlJobs || [], [data]);
  const isAnyJobRunning = useMemo(() => jobs.some((j: any) => j.status === CrawlJobStatus.Running), [jobs]);

  // Handle polling when jobs are running
  useEffect(() => {
    if (isAnyJobRunning) {
      startPolling(3000); // Poll every 3 seconds
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [isAnyJobRunning, startPolling, stopPolling]);

  // Mutations
  const [runSubjectSurvey, { loading: subjectLoading }] = useRunCrawlSubjectSurveyMutation();
  const [runLecturerSurvey, { loading: lecturerLoading }] = useRunCrawlLecturerSurveyMutation();
  const [runStaffSurvey, { loading: staffLoading }] = useRunCrawlStaffSurveyMutation();
  const [runAggregatePoints, { loading: aggregateLoading }] = useRunAggregatePointsMutation();
  const [runTransferData, { loading: transferLoading }] = useRunTransferDataMutation();

  const { isOpen: isSelectModalOpen, onOpen: onSelectModalOpen, onClose: onSelectModalClose } = useDisclosure();
  const [activeSurveyType, setActiveSurveyType] = useState<CrawlJobType | null>(null);
  const [activeSurveyMutation, setActiveSurveyMutation] = useState<any>(null);
  const [activeSurveyLoading, setActiveSurveyLoading] = useState(false);

  const handleRun = async (type: CrawlJobType, mutation: any, vars: any = {}) => {
    if (type === CrawlJobType.LecturerSurvey || type === CrawlJobType.SubjectSurvey) {
      setActiveSurveyType(type);
      setActiveSurveyMutation(() => mutation);
      setActiveSurveyLoading(false);
      onSelectModalOpen();
      return;
    }

    try {
      await mutation({ variables: vars });
      refetch();
    } catch (err) {
      console.error(`Failed to run ${type}:`, err);
    }
  };

  const submitSurveyCrawl = async (surveyConfigIds: string[]) => {
    if (!activeSurveyMutation) return;
    setActiveSurveyLoading(true);
    try {
      await activeSurveyMutation({ variables: { surveyConfigIds: surveyConfigIds.length > 0 ? surveyConfigIds : undefined } });
      refetch();
      onSelectModalClose();
    } catch (err) {
      console.error(`Failed to run survey crawl:`, err);
    } finally {
      setActiveSurveyLoading(false);
    }
  };

  const crawlConfigs = [
    {
      type: CrawlJobType.SubjectSurvey,
      title: "Thu thập KS Môn học",
      description: "Lấy dữ liệu khảo sát môn học từ survey.uit.edu.vn",
      mutation: runSubjectSurvey,
      loading: subjectLoading,
    },
    {
      type: CrawlJobType.LecturerSurvey,
      title: "Thu thập KS Giảng viên",
      description: "Lấy dữ liệu khảo sát giảng viên từ survey.uit.edu.vn",
      mutation: runLecturerSurvey,
      loading: lecturerLoading,
    },
    {
      type: CrawlJobType.StaffSurvey,
      title: "Thu thập KS CBNV",
      description: "Lấy dữ liệu khảo sát cán bộ nhân viên hàng năm",
      mutation: runStaffSurvey,
      loading: staffLoading,
    },
    {
      type: CrawlJobType.AggregatePoints,
      title: "Tổng hợp điểm",
      description: "Tổng hợp điểm trung bình từ các câu trả lời chi tiết",
      mutation: runAggregatePoints,
      loading: aggregateLoading,
    },
    {
      type: CrawlJobType.TransferData,
      title: "Chuyển dữ liệu",
      description: "Đồng bộ dữ liệu cơ bản giữa nguồn và đích",
      mutation: runTransferData,
      loading: transferLoading,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl">
        <h2 className="font-semibold text-lg text-foreground">Quản lý nhập dữ liệu (Crawl & Import)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Hệ thống chạy theo quy trình: <strong>Chạy → Xem trước → Xác nhận</strong>. Dữ liệu sau khi thu thập sẽ nằm ở trạng thái tạm thời, chỉ được ghi vào hệ thống chính khi bạn bấm Xác nhận.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crawlConfigs.map((config) => (
            <CrawlJobCard
              key={config.type}
              type={config.type}
              title={config.title}
              description={config.description}
              jobs={jobs}
              onRun={() => handleRun(config.type, config.mutation)}
              running={config.loading}
              refetchJobs={refetch}
            />
          ))}
        </div>
      </div>
      
      {activeSurveyType && (
        <LecturerSurveySelectModal
          isOpen={isSelectModalOpen}
          onClose={onSelectModalClose}
          type={activeSurveyType!}
          onRun={submitSurveyCrawl}
          isLoading={activeSurveyLoading}
        />
      )}

      <div className="flex flex-col gap-2 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl mt-4">
        <SurveyCrawlHistoryTable />
      </div>
    </div>
  );
};
