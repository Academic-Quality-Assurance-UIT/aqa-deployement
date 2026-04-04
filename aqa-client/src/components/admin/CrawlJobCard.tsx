"use client";

import { 
  CrawlJob, 
  CrawlJobStatus, 
  CrawlJobType, 
  useGetCrawlStagingDataSummaryQuery,
  useConfirmCrawlJobMutation,
  useAbandonCrawlJobMutation
} from "@/gql/graphql";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Divider, 
  Chip, 
  Spinner, 
  Accordion, 
  AccordionItem,
  Tooltip
} from "@heroui/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  AiOutlinePlayCircle, 
  AiOutlineCheckCircle, 
  AiOutlineCloseCircle, 
  AiOutlineHistory,
  AiOutlineInfoCircle
} from "react-icons/ai";
import { useState, useMemo } from "react";

interface CrawlJobCardProps {
  type: CrawlJobType;
  title: string;
  description: string;
  jobs: CrawlJob[];
  onRun: () => Promise<void>;
  running: boolean;
  refetchJobs: () => void;
}

export const CrawlJobCard = ({ type, title, description, jobs, onRun, running, refetchJobs }: CrawlJobCardProps) => {
  const latestJob = jobs.find(j => j.type === type);
  const history = jobs.filter(j => j.type === type).slice(1, 6); // Last 5 historical jobs
  
  const isJobRunning = latestJob?.status === CrawlJobStatus.Running;
  const isCompleted = latestJob?.status === CrawlJobStatus.Completed;
  
  const { data: stagingData, refetch: refetchStaging } = useGetCrawlStagingDataSummaryQuery({
    variables: { jobId: latestJob?.crawl_job_id || "" },
    skip: !latestJob || !isCompleted,
  });

  const [confirmJob, { loading: confirming }] = useConfirmCrawlJobMutation();
  const [abandonJob, { loading: abandoning }] = useAbandonCrawlJobMutation();

  const handleConfirm = async () => {
    if (!latestJob) return;
    try {
      await confirmJob({ variables: { jobId: latestJob.crawl_job_id } });
      refetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAbandon = async () => {
    if (!latestJob) return;
    try {
      await abandonJob({ variables: { jobId: latestJob.crawl_job_id } });
      refetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusChip = (status: CrawlJobStatus | undefined) => {
    switch (status) {
      case CrawlJobStatus.Running:
        return <Chip color="warning" variant="dot" size="sm">Đang chạy</Chip>;
      case CrawlJobStatus.Completed:
        return <Chip color="primary" variant="flat" size="sm">Chờ xác nhận</Chip>;
      case CrawlJobStatus.Confirmed:
        return <Chip color="success" variant="flat" size="sm">Đã xác nhận</Chip>;
      case CrawlJobStatus.Failed:
        return <Chip color="danger" variant="flat" size="sm">Lỗi</Chip>;
      case CrawlJobStatus.Abandoned:
        return <Chip color="default" variant="flat" size="sm">Đã hủy</Chip>;
      default:
        return <Chip variant="flat" size="sm">Sẵn sàng</Chip>;
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
      <CardHeader className="flex flex-col items-start gap-1 pb-2">
        <div className="flex justify-between w-full items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          {getStatusChip(latestJob?.status)}
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
        {latestJob && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Lần chạy cuối:</span>
              <span>{format(new Date(latestJob.started_at), "HH:mm dd/MM/yyyy", { locale: vi })}</span>
            </div>
            
            {isJobRunning && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Spinner size="sm" />
                <span className="text-sm">Hệ thống đang thu thập dữ liệu...</span>
              </div>
            )}

            {latestJob.status === CrawlJobStatus.Failed && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 text-xs">
                Lỗi: {latestJob.error_message || "Không rõ nguyên nhân"}
              </div>
            )}

            {isCompleted && stagingData?.crawlStagingDataSummary && (
              <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-1 mb-1">
                  <AiOutlineInfoCircle className="text-primary" />
                  <span className="text-xs font-semibold">Dữ liệu tạm thời ({stagingData.crawlStagingDataSummary.totalRecords} bản ghi)</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {stagingData.crawlStagingDataSummary.byType.map((item: any) => (
                    <div key={item.type} className="flex justify-between text-[10px]">
                      <span className="capitalize">{item.type}:</span>
                      <span className="font-mono">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {!isCompleted && latestJob?.status !== CrawlJobStatus.Running && (
            <Button 
              size="sm" 
              color="primary" 
              startContent={<AiOutlinePlayCircle />}
              onPress={onRun}
              isLoading={running}
              className="flex-1 font-bold"
            >
              Chạy ngay
            </Button>
          )}

          {isCompleted && (
            <>
              <Button 
                size="sm" 
                color="success" 
                variant="flat"
                startContent={<AiOutlineCheckCircle />}
                onPress={handleConfirm}
                isLoading={confirming}
                className="flex-1 font-bold"
              >
                Xác nhận
              </Button>
              <Button 
                size="sm" 
                color="danger" 
                variant="light"
                startContent={<AiOutlineCloseCircle />}
                onPress={handleAbandon}
                isLoading={abandoning}
                className="flex-1 font-bold"
              >
                Hủy bỏ
              </Button>
            </>
          )}

          {latestJob?.status === CrawlJobStatus.Failed && (
             <Button 
                size="sm" 
                color="default" 
                variant="light"
                onPress={handleAbandon}
                isLoading={abandoning}
                className="flex-1 font-bold"
             >
               Xóa lịch sử lỗi
             </Button>
          )}
        </div>

        {history.length > 0 && (
          <Accordion variant="light" className="px-0">
            <AccordionItem 
              key="history" 
              aria-label="History" 
              title={<span className="text-xs text-gray-400 flex items-center gap-1"><AiOutlineHistory /> Lịch sử 5 lần gần nhất</span>}
              className="text-xs"
            >
              <div className="flex flex-col gap-1">
                {history.map((h) => (
                  <div key={h.crawl_job_id} className="flex justify-between text-[10px] py-1 border-b border-gray-50 dark:border-zinc-900 last:border-0 italic">
                    <span>{format(new Date(h.started_at), "dd/MM HH:mm")}</span>
                    <span>{getStatusChip(h.status)}</span>
                  </div>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        )}
      </CardBody>
    </Card>
  );
};
