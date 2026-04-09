"use client";

import { 
  useGetCrawlJobsQuery,
  useRunCrawlSubjectSurveyMutation,
  useRunCrawlStaffSurveyMutation,
  CrawlJobType,
  CrawlJobStatus
} from "@/gql/graphql";
import { useEffect, useMemo, useState } from "react";
import { TopicAssignmentManager } from "./TopicAssignmentManager";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  useDisclosure,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { CrawlJobRow } from "./CrawlJobRow";
import { 
  AiOutlineBook, 
  AiOutlineTeam, 
  AiOutlineThunderbolt, 
  AiOutlinePlayCircle, 
  AiOutlineMonitor,
  AiOutlineDown
} from "react-icons/ai";
import { CrawlJobMonitorModal } from "./CrawlJobMonitorModal";
import { LecturerSurveySelectModal } from "./LecturerSurveySelectModal";

export const CrawlManager = () => {
  const { data, loading, refetch, startPolling, stopPolling } = useGetCrawlJobsQuery({
    fetchPolicy: "network-only",
  });

  const [runSubjectSurvey, { loading: subjectLoading }] = useRunCrawlSubjectSurveyMutation();
  const [runStaffSurvey, { loading: staffLoading }] = useRunCrawlStaffSurveyMutation();

  const jobs = useMemo(() => data?.crawlJobs || [], [data]);
  const isAnyJobRunning = useMemo(() => 
    jobs.some((j: any) => 
      j.status === CrawlJobStatus.Running || j.status === CrawlJobStatus.Confirming
    ), [jobs]);

  // Handle polling when jobs are running
  useEffect(() => {
    if (isAnyJobRunning) {
      startPolling(3000); // Poll every 3 seconds
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [isAnyJobRunning, startPolling, stopPolling]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { isOpen: isMonitorOpen, onOpen: onMonitorOpen, onOpenChange: onMonitorOpenChange } = useDisclosure();
  const { isOpen: isTopicOpen, onOpen: onTopicOpen, onOpenChange: onTopicOpenChange } = useDisclosure();
  const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();

  const selectedJob = useMemo(() => jobs.find(j => j.crawl_job_id === selectedJobId), [jobs, selectedJobId]);

  const handleOpenDetails = (type: CrawlJobType) => {
    if (type === CrawlJobType.TopicAssignment) {
      onTopicOpen();
      return;
    }

    const job = jobs.find(j => j.type === type);
    if (job) {
      setSelectedJobId(job.crawl_job_id);
      onMonitorOpen();
    }
  };

  const handleStartNew = async (type: CrawlJobType) => {
    if (type === CrawlJobType.SubjectSurvey) {
      onSelectOpen();
    } else if (type === CrawlJobType.StaffSurvey) {
      try {
        await runStaffSurvey();
        refetch();
      } catch (err) {
        console.error("Failed to run staff survey:", err);
      }
    }
  };

  const submitSurveyCrawl = async (surveyConfigIds: string[]) => {
    try {
      await runSubjectSurvey({ variables: { surveyConfigIds: surveyConfigIds.length > 0 ? surveyConfigIds : undefined } });
      refetch();
      onSelectClose();
    } catch (err) {
      console.error(`Failed to run subject survey:`, err);
    }
  };

  const crawlConfigs = [
    {
      type: CrawlJobType.SubjectSurvey,
      title: "Thu thập KS Môn học",
      description: "Lấy dữ liệu khảo sát môn học từ survey.uit.edu.vn",
      icon: <AiOutlineBook size={24} />,
    },
    {
      type: CrawlJobType.StaffSurvey,
      title: "Thu thập KS CBNV",
      description: "Lấy dữ liệu khảo sát cán bộ nhân viên hàng năm",
      icon: <AiOutlineTeam size={24} />,
    },
    {
      type: CrawlJobType.TopicAssignment,
      title: "Phân loại chủ đề bình luận",
      description: "Tự động phân loại chủ đề và cảm xúc bình luận bằng AI",
      icon: <AiOutlineThunderbolt size={24} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="font-bold text-lg text-foreground tracking-tight">Quy trình xử lý dữ liệu</h2>
          <p className="text-xs text-gray-500">
            Dữ liệu được xử lý theo trình tự: <strong>Thu thập → Kiểm tra → Xác nhận</strong>. Click vào từng mục để mở rộng tùy chọn.
          </p>
        </div>
        
        <Accordion variant="light" className="px-0 flex flex-col gap-2" itemClasses={{
          base: "bg-white dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm overflow-hidden",
          title: "p-0",
          trigger: "p-0 pr-4",
          content: "pt-0 pb-4 px-4 h-auto",
        }}>
          {crawlConfigs.map((config) => (
            <AccordionItem
              key={config.type}
              aria-label={config.title}
              indicator={({ isOpen }) => (
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 transition-all duration-300 ${isOpen ? "rotate-180 bg-primary/10 border-primary/20 text-primary" : ""}`}>
                  <AiOutlineDown size={14} />
                </div>
              )}
              title={
                <CrawlJobRow
                  title={config.title}
                  description={config.description}
                  icon={config.icon}
                  latestJob={jobs.find(j => j.type === config.type)}
                  hideChevron
                />
              }
            >
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 dark:border-zinc-700 mt-2">
                <Button 
                  size="sm" 
                  variant="flat" 
                  color="primary" 
                  onPress={() => handleStartNew(config.type)}
                  startContent={<AiOutlinePlayCircle size={18} />}
                  className="font-bold bg-primary-50 dark:bg-primary-900/10"
                  isDisabled={config.type === CrawlJobType.TopicAssignment && jobs.find(j => j.type === config.type)?.status === CrawlJobStatus.Running}
                >
                  {config.type === CrawlJobType.TopicAssignment ? "Bắt đầu phân loại" : "Chạy thu thập mới"}
                </Button>

                {(config.type === CrawlJobType.TopicAssignment || jobs.find(j => j.type === config.type)) && (
                   <Button 
                    size="sm" 
                    variant="flat" 
                    color="secondary" 
                    onPress={() => handleOpenDetails(config.type)}
                    startContent={<AiOutlineMonitor size={18} />}
                    className="font-bold"
                   >
                     {config.type === CrawlJobType.TopicAssignment ? "Quản lý chi tiết" : "Xem tiến trình & Giám sát"}
                   </Button>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Topic Assignment Modal */}
      <Modal 
        isOpen={isTopicOpen} 
        onOpenChange={onTopicOpenChange}
        size="5xl"
        scrollBehavior="inside"
        backdrop="blur"
        classNames={{
          base: "bg-white dark:bg-zinc-950",
          header: "border-b border-gray-100 dark:border-zinc-800",
          footer: "border-t border-gray-100 dark:border-zinc-800",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Phân loại chủ đề bình luận</h3>
                <p className="text-xs text-gray-500 font-normal">Cấu hình và thực hiện phân loại bình luận bằng mô hình AI</p>
              </ModalHeader>
              <ModalBody className="py-6">
                <TopicAssignmentManager />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="font-bold">
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Monitor Modal for Subject and Staff surveys */}
      {selectedJob && (
        <CrawlJobMonitorModal
          job={selectedJob}
          isOpen={isMonitorOpen}
          onOpenChange={onMonitorOpenChange}
        />
      )}

      <LecturerSurveySelectModal
          isOpen={isSelectOpen}
          onClose={onSelectClose}
          type={CrawlJobType.SubjectSurvey}
          onRun={submitSurveyCrawl}
          isLoading={subjectLoading}
      />
    </div>
  );
};
