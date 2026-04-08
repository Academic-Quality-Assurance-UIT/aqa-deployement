"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Button
} from "@heroui/react";
import { useState, useMemo } from "react";
import { useSearchExternalSurveysQuery, useAddSurveyListConfigMutation, CrawlJobType } from "@/gql/graphql";

// searchExternalSurveys returns any (we know it has rows and total count)
// The API format: { data: [{ sid, title, startdate, enddate, ...}], meta: { current_page, per_page, total } } or similar (Wait, our backend resolves `apiClient.getExternalSurveys`).

export const SearchExternalSurveyModal = ({
  isOpen,
  onClose,
  type,
  onAddSelected,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: CrawlJobType;
  onAddSelected: (sid: string) => void;
}) => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<any>({
    column: "startdate",
    direction: "descending",
  });

  const { data, loading, error, refetch } = useSearchExternalSurveysQuery({
    variables: {
      keyword,
      page,
      limit,
      order: sortDescriptor.column,
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    },
    skip: !isOpen,
  });

  const [addConfig, { loading: adding }] = useAddSurveyListConfigMutation();

  const handleAdd = async (survey: any) => {
    try {
      await addConfig({
        variables: {
          input: {
            title: survey.title,
            sid: survey.sid,
            type: "CBGV", // Wait, depends on type
            survey_type: type,
            semester_type: "HK1",
            year: new Date().getFullYear().toString(),
            semester_name: "Tự động thêm",
          },
        },
      });
      onAddSelected(survey.sid);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const rows = data?.searchExternalSurveys?.data || [];
  const total = data?.searchExternalSurveys?.meta?.total || 0;
  const pages = Math.ceil(total / limit) || 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Tìm kiếm khảo sát từ UIT Survey</ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex gap-2 items-center mb-4">
            <Input
              placeholder="Nhập tên khảo sát..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  refetch();
                }
              }}
            />
            <Button
              color="primary"
              onPress={() => {
                setPage(1);
                refetch();
              }}
            >
              Tìm kiếm
            </Button>
          </div>

          <Table
            aria-label="External surveys"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            layout="fixed"
            bottomContent={
              pages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(p) => setPage(p)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn key="sid" allowsSorting width={120}>SID</TableColumn>
              <TableColumn key="title" allowsSorting>Tên khảo sát</TableColumn>
              <TableColumn key="startdate" allowsSorting width={160} align="center">Ngày bắt đầu</TableColumn>
              <TableColumn key="action" width={120} align="end">Thao tác</TableColumn>
            </TableHeader>
            <TableBody
              items={rows}
              loadingContent={<Spinner label="Đang tải..." />}
              isLoading={loading}
              emptyContent={"Không tìm thấy dữ liệu"}
            >
              {(item: any) => (
                <TableRow key={item.sid}>
                  <TableCell>
                    <span className="text-tiny text-default-400 font-mono">{item.sid}</span>
                  </TableCell>
                  <TableCell>
                    <div className="py-1">
                      <span className="text-small font-medium text-default-700">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-tiny text-default-500">{item.startdate || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      isLoading={adding}
                      onPress={() => handleAdd(item)}
                    >
                      Thêm
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
