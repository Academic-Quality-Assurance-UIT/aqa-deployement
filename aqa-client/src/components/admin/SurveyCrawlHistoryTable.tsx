"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
} from "@heroui/react";
import { useState } from "react";
import { useGetSurveyCrawlHistoryQuery, CrawlJobStatus } from "@/gql/graphql";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const SurveyCrawlHistoryTable = ({
  jobId,
  surveyConfigId,
}: {
  jobId?: string;
  surveyConfigId?: string;
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data, loading } = useGetSurveyCrawlHistoryQuery({
    variables: {
      jobId: jobId || undefined,
      surveyConfigId: surveyConfigId || undefined,
      limit: rowsPerPage,
      offset: (page - 1) * rowsPerPage,
    },
    fetchPolicy: "cache-and-network",
  });

  const history = data?.surveyCrawlHistory || [];
  // Assuming a hypothetical total count is returned if we want proper pagination. 
  // Currently our backend doesn't return total count for history, we'll just implement simple prev/next or hide pagination.
  // We'll trust the limit.

  const getStatusChip = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <Chip color="warning" variant="flat" size="sm">Đang chạy</Chip>;
      case "COMPLETED":
        return <Chip color="success" variant="flat" size="sm">Thành công</Chip>;
      case "FAILED":
        return <Chip color="danger" variant="flat" size="sm">Thất bại</Chip>;
      default:
        return <Chip variant="flat" size="sm">{status}</Chip>;
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <h3 className="font-semibold text-lg">Lịch sử thu thập khảo sát chi tiết</h3>
      <Table
        aria-label="Survey Crawl History"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={10} // Hardcoded for now without total count from backend
              onChange={(p) => setPage(p)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Thời gian bắt đầu</TableColumn>
          <TableColumn>Job ID</TableColumn>
          <TableColumn>SID Khảo sát</TableColumn>
          <TableColumn>Trạng thái</TableColumn>
          <TableColumn>Số bản ghi</TableColumn>
          <TableColumn>Lỗi</TableColumn>
        </TableHeader>
        <TableBody
          items={history}
          loadingContent={<Spinner />}
          isLoading={loading}
          emptyContent="Chưa có lịch sử thu thập"
        >
          {(item: any) => (
            <TableRow key={item.id}>
              <TableCell>{format(new Date(item.started_at), "dd/MM/yyyy HH:mm:ss")}</TableCell>
              <TableCell>{item.crawl_job_id.substring(0, 8)}...</TableCell>
              <TableCell>{item.sid}</TableCell>
              <TableCell>{getStatusChip(item.status)}</TableCell>
              <TableCell>{item.records_fetched || 0}</TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate text-xs text-red-500" title={item.error_message || ""}>
                  {item.error_message || "-"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
