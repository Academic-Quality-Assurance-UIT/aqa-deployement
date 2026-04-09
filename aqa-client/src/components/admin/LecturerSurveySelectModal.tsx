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
  Divider,
  Chip,
} from "@heroui/react";
import { useState, useMemo, useCallback } from "react";
import { useGetSurveyListConfigsQuery, CrawlJobType, GetSurveyListConfigsQuery } from "@/gql/graphql";
import { SearchExternalSurveyModal } from "./SearchExternalSurveyModal";
import { AiOutlineDelete, AiOutlineUnorderedList } from "react-icons/ai";

type SurveyConfig = GetSurveyListConfigsQuery['surveyListConfigs'][0];

interface GroupedSurvey {
  id: string; // This will be the semester_name
  semester_name: string;
  year: string;
  semester_type: string;
  sids: string[];
  titles: string[];
  types: string[];
  last_crawled_at: string | null;
  surveyIds: string[];
}

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
  const [prunedSurveyIds, setPrunedSurveyIds] = useState<Set<string>>(new Set([]));
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: onListClose } = useDisclosure();

  const { data, loading, refetch } = useGetSurveyListConfigsQuery({
    variables: { type },
    skip: !isOpen,
    fetchPolicy: "network-only",
  });

  const surveys = useMemo(() => {
    return data?.surveyListConfigs || [];
  }, [data]);

  const { groupedSurveys, semesterToIds } = useMemo(() => {
    const groups = new Map<string, GroupedSurvey>();
    const mapping = new Map<string, string[]>();
    
    surveys.forEach(s => {
      const sem = s.semester_name || "Khác";
      if (!groups.has(sem)) {
        groups.set(sem, {
          id: sem,
          semester_name: sem,
          year: s.year || "",
          semester_type: s.semester_type || "",
          sids: [],
          titles: [],
          types: [],
          last_crawled_at: null,
          surveyIds: [],
        });
      }
      
      const group = groups.get(sem)!;
      group.sids.push(s.sid);
      group.titles.push(s.title);
      const typeLabel = (s.type && s.type !== "HT1" && s.type !== "HT2") ? "LT" : (s.type || "-");
      if (!group.types.includes(typeLabel)) group.types.push(typeLabel);
      group.surveyIds.push(s.id);
      
      if (s.last_crawled_at) {
        if (!group.last_crawled_at || new Date(s.last_crawled_at) > new Date(group.last_crawled_at)) {
          group.last_crawled_at = s.last_crawled_at;
        }
      }
      
      if (!mapping.has(sem)) mapping.set(sem, []);
      mapping.get(sem)!.push(s.id);
    });
    
    return { 
      groupedSurveys: Array.from(groups.values()).sort((a, b) => {
        if (a.year !== b.year) return b.year.localeCompare(a.year);
        return b.semester_name.localeCompare(a.semester_name);
      }), 
      semesterToIds: mapping 
    };
  }, [surveys]);

  const handleSelectionChange = useCallback((keys: any) => {
    const newKeys = new Set(keys as Set<string>);
    const oldKeys = selectedKeys;

    // If a semester was added, we clear its pruned IDs to reset state
    newKeys.forEach(sem => {
      if (!oldKeys.has(sem)) {
        const ids = semesterToIds.get(sem) || [];
        setPrunedSurveyIds(prev => {
          const next = new Set(prev);
          ids.forEach(id => next.delete(id));
          return next;
        });
      }
    });

    setSelectedKeys(newKeys);
  }, [selectedKeys, semesterToIds]);

  const removeGroup = useCallback((semester: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      next.delete(semester);
      return next;
    });

    // Also clear pruned IDs for this semester to keep state clean
    const semesterIds = semesterToIds.get(semester) || [];
    setPrunedSurveyIds(prev => {
      const next = new Set(prev);
      semesterIds.forEach(id => next.delete(id));
      return next;
    });
  }, [semesterToIds]);

  const removeSurvey = useCallback((surveyId: string) => {
    setPrunedSurveyIds(prev => {
      const next = new Set(prev);
      next.add(surveyId);
      return next;
    });
  }, []);

  const selectedSurveysList = useMemo(() => {
    const ids = new Set<string>();
    selectedKeys.forEach(sem => {
      const surveyIds = semesterToIds.get(sem) || [];
      surveyIds.forEach(id => {
        if (!prunedSurveyIds.has(id)) {
          ids.add(id);
        }
      });
    });
    return surveys.filter(s => ids.has(s.id));
  }, [surveys, selectedKeys, semesterToIds, prunedSurveyIds]);

  const selectedSemesters = useMemo(() => {
    const result: { name: string; count: number; surveys: SurveyConfig[] }[] = [];
    selectedSurveysList.forEach(s => {
      const semName = s.semester_name || "Khác";
      let existing = result.find(r => r.name === semName);
      if (!existing) {
        existing = { name: semName, count: 0, surveys: [] };
        result.push(existing);
      }
      existing.count++;
      existing.surveys.push(s);
    });
    return result;
  }, [selectedSurveysList]);

  const handleRun = () => {
    const allSelectedIds: string[] = selectedSurveysList.map(s => s.id);
    onRun(allSelectedIds);
  };

  const titleText = type === CrawlJobType.LecturerSurvey ? "Chọn Khảo sát Giảng viên để thu thập" : "Chọn Khảo sát Môn học để thu thập";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <ModalHeader className="flex justify-between items-center pr-10">
            <div className="flex items-center gap-3">
              <span>{titleText}</span>
              {selectedKeys.size > 0 && (
                <Button 
                  size="sm" 
                  color="primary" 
                  variant="flat" 
                  onPress={onListOpen}
                  startContent={<AiOutlineUnorderedList />}
                >
                  Đã chọn {selectedKeys.size} học kỳ ({selectedSurveysList.length} khảo sát)
                </Button>
              )}
            </div>
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
              onSelectionChange={handleSelectionChange}
              classNames={{
                wrapper: "max-h-[400px] overflow-auto",
              }}
            >
              <TableHeader>
                <TableColumn width={70}>SID</TableColumn>
                <TableColumn>Tên khảo sát</TableColumn>
                <TableColumn width={180} align="center">Tên học kỳ</TableColumn>
                <TableColumn width={70} align="center">Loại</TableColumn>
                <TableColumn width={160} align="end">Lần thu thập cuối</TableColumn>
              </TableHeader>
              <TableBody
                items={groupedSurveys}
                loadingContent={<Spinner />}
                isLoading={loading}
                emptyContent="Không có cấu hình khảo sát nào"
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {item.sids.map(sid => (
                          <span key={sid} className="text-tiny text-default-400 font-mono">{sid}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="py-1 flex flex-col gap-1">
                        {item.titles.map((title, idx) => (
                          <span key={idx} className="text-small font-medium text-default-700 line-clamp-1">{title}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-small font-bold text-primary">{item.semester_name}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {item.types.map(t => (
                          <Chip key={t} size="sm" variant="flat" color="primary" className="border-none">{t}</Chip>
                        ))}
                      </div>
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
        existingSids={new Set(surveys.map((s) => s.sid))}
        onAddSelected={() => {
          refetch();
        }}
      />

      <Modal isOpen={isListOpen} onClose={onListClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Danh sách khảo sát đã chọn</ModalHeader>
          <ModalBody>
            {selectedSemesters.length === 0 ? (
              <p className="text-center py-10 text-default-400">Chưa có khảo sát nào được chọn</p>
            ) : (
              <div className="flex flex-col gap-4">
                {selectedSemesters.map(group => (
                  <div key={group.name} className="border border-default-100 rounded-xl overflow-hidden">
                    <div className="bg-default-50 px-4 py-2 flex justify-between items-center border-b border-default-100">
                      <span className="font-bold text-primary">{group.name}</span>
                      <Button 
                        size="sm" 
                        color="danger" 
                        variant="light" 
                        onPress={() => removeGroup(group.name)}
                        startContent={<AiOutlineDelete />}
                      >
                        Gỡ bỏ học kỳ
                      </Button>
                    </div>
                    <Table aria-label="Selected group" removeWrapper shadow="none" className="p-0">
                      <TableHeader>
                        <TableColumn width={80}>SID</TableColumn>
                        <TableColumn>Tên khảo sát</TableColumn>
                        <TableColumn width={80} align="center">Loại</TableColumn>
                        <TableColumn width={50} align="center">&nbsp;</TableColumn>
                      </TableHeader>
                      <TableBody items={group.surveys}>
                        {(s) => (
                          <TableRow key={s.id}>
                            <TableCell><span className="text-tiny font-mono">{s.sid}</span></TableCell>
                            <TableCell><span className="text-small">{s.title}</span></TableCell>
                            <TableCell><span className="text-small">{s.type || "-"}</span></TableCell>
                            <TableCell>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => removeSurvey(s.id)}
                              >
                                <AiOutlineDelete size={18} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
             <Button variant="light" onPress={onListClose}>
              Quay lại
            </Button>
            <Button color="primary" onPress={() => { onListClose(); handleRun(); }}>
              Chạy các khảo sát này
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
