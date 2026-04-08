"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { useState, useMemo } from "react";
import { useGetSurveyListConfigsQuery, CrawlJobType, GetSurveyListConfigsQuery } from "@/gql/graphql";
import { SearchExternalSurveyModal } from "./SearchExternalSurveyModal";

type SurveyConfig = GetSurveyListConfigsQuery['surveyListConfigs'][0];

export const LecturerSurveySelectModal = ({
  isOpen,
  onClose,
  type,
  onRun,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: CrawlJobType;
  onRun: (surveyConfigIds: string[]) => void;
  isLoading: boolean;
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();

  const { data, loading, refetch } = useGetSurveyListConfigsQuery({
    variables: { type },
    skip: !isOpen,
    fetchPolicy: "network-only",
  });

  const surveys = useMemo(() => {
    return data?.surveyListConfigs || [];
  }, [data]);

  const handleRun = () => {
    const selectedIds = Array.from(selectedKeys) as string[];
    onRun(selectedIds);
  };

  const titleText = type === CrawlJobType.LecturerSurvey ? "Chọn Khảo sát Giảng viên để thu thập" : "Chọn Khảo sát Môn học để thu thập";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <ModalHeader className="flex justify-between items-center pr-10">
            <span>{titleText}</span>
            <Button size="sm" color="secondary" variant="flat" onPress={onSearchOpen}>
              + Tìm kiếm khảo sát mới
            </Button>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-500 mb-2">
              Bạn có thể chọn một hoặc nhiều khảo sát để thu thập dữ liệu. Để trống để thu thập tất cả.
            </p>
            <Table
              aria-label="Select surveys to crawl"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
              layout="fixed"
              classNames={{
                wrapper: "max-h-[400px] overflow-auto",
              }}
            >
              <TableHeader>
                <TableColumn width={100}>SID</TableColumn>
                <TableColumn>Tên khảo sát</TableColumn>
                <TableColumn width={140} align="center">Năm học</TableColumn>
                <TableColumn width={100} align="center">Loại</TableColumn>
                <TableColumn width={200} align="end">Lần thu thập cuối</TableColumn>
              </TableHeader>
              <TableBody
                items={surveys}
                loadingContent={<Spinner />}
                isLoading={loading}
                emptyContent="Không có cấu hình khảo sát nào"
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="text-tiny text-default-400 font-mono">{item.sid}</span>
                    </TableCell>
                    <TableCell>
                      <div className="py-1">
                        <span className="text-small font-medium text-default-700">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-small">{item.year || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-small">{item.type || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-tiny text-default-500 whitespace-nowrap">
                        {item.last_crawled_at ? new Date(item.last_crawled_at).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "Chưa từng thu thập"}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={handleRun}
            >
              Chạy thủ công
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SearchExternalSurveyModal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        type={type}
        onAddSelected={(sid) => {
          refetch();
        }}
      />
    </>
  );
};
