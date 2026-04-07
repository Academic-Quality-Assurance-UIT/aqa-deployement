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
              classNames={{
                wrapper: "max-h-[400px] overflow-auto",
              }}
            >
              <TableHeader>
                <TableColumn>SID</TableColumn>
                <TableColumn>Tên khảo sát</TableColumn>
                <TableColumn>Năm học</TableColumn>
                <TableColumn>Loại</TableColumn>
                <TableColumn>Lần thu thập cuối</TableColumn>
              </TableHeader>
              <TableBody
                items={surveys}
                loadingContent={<Spinner />}
                isLoading={loading}
                emptyContent="Không có cấu hình khảo sát nào"
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.sid}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.year || "-"}</TableCell>
                    <TableCell>{item.type || "-"}</TableCell>
                    <TableCell>{item.last_crawled_at ? new Date(item.last_crawled_at).toLocaleString('vi-VN') : "Chưa từng thu thập"}</TableCell>
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
