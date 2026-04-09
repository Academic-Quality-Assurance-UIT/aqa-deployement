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
  useDisclosure,
  Spinner,
  Button,
  Divider,
  Selection,
  Chip,
  ModalFooter,
} from "@heroui/react";
import { AiOutlineDelete, AiOutlineUnorderedList } from "react-icons/ai";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useSearchExternalSurveysQuery,
  useAddSurveyListConfigMutation,
  CrawlJobType,
} from "@/gql/graphql";

function detectSurveyInfo(survey: any) {
  const title: string = survey.title || "";
  const lowerTitle = title.toLowerCase();

  let expiresDate: Date | null = null;
  if (survey.expires) {
    expiresDate = new Date(survey.expires);
    if (isNaN(expiresDate.getTime())) expiresDate = null;
  }

  let type = "LT";
  if (lowerTitle.includes("phương thức 1") || lowerTitle.includes("hình thức 1")) {
    type = "HT1";
  } else if (lowerTitle.includes("phương thức 2") || lowerTitle.includes("hình thức 2")) {
    type = "HT2";
  }

  let year = "";
  if (expiresDate) {
    const expiresYear = expiresDate.getFullYear();
    year = `${expiresYear - 1}-${expiresYear}`;
  }

  let semester_type = "";
  if (lowerTitle.includes("học kỳ 1")) {
    semester_type = "HK1";
  } else if (lowerTitle.includes("học kỳ 2")) {
    semester_type = "HK2";
  } else if (expiresDate) {
    const month = expiresDate.getMonth();
    if (month <= 6) {
      semester_type = "HK1";
    } else {
      semester_type = "HK2";
    }
  }

  const semester_name = semester_type && year ? `${semester_type}, ${year}` : "";

  return { type, year, semester_type, semester_name };
}

export const SearchExternalSurveyModal = ({
  isOpen,
  onClose,
  type,
  onAddSelected,
  existingSids = new Set(),
}: {
  isOpen: boolean;
  onClose: () => void;
  type: CrawlJobType;
  onAddSelected: () => void;
  existingSids?: Set<string>;
}) => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<any>({
    column: "startdate",
    direction: "descending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [allSelectedSurveys, setAllSelectedSurveys] = useState<Map<string, any>>(new Map());
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: onListClose } = useDisclosure();


  const { data, loading, refetch } = useSearchExternalSurveysQuery({
    variables: {
      keyword,
      page,
      limit,
      order: sortDescriptor.column,
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    },
    skip: !isOpen,
  });

  const rows = data?.searchExternalSurveys?.data || [];
  const total = data?.searchExternalSurveys?.meta?.total || 0;
  const pages = Math.ceil(total / limit) || 1;

  const { groupedSurveys, semesterToSurveys } = useMemo(() => {
    const groups = new Map<string, any>();
    const mapping = new Map<string, any[]>();
    
    rows.forEach(s => {
      const info = detectSurveyInfo(s);
      const sem = info.semester_name || "Khác";
      if (!groups.has(sem)) {
        groups.set(sem, {
          id: sem,
          semester_name: sem,
          year: info.year || "",
          semester_type: info.semester_type || "",
          sids: [],
          titles: [],
          types: [],
          surveys: [],
        });
      }
      const group = groups.get(sem);
      group.sids.push(s.sid);
      group.titles.push(s.title);
      const typeLabel = (info.type && info.type !== "HT1" && info.type !== "HT2") ? "LT" : (info.type || "-");
      if (!group.types.includes(typeLabel)) group.types.push(typeLabel);
      group.surveys.push(s);

      if (!mapping.has(sem)) mapping.set(sem, []);
      mapping.get(sem)!.push(s);
    });

    return {
      groupedSurveys: Array.from(groups.values()).sort((a, b) => {
        if (a.year !== b.year) return b.year.localeCompare(a.year);
        return b.semester_name.localeCompare(a.semester_name);
      }),
      semesterToSurveys: mapping
    };
  }, [rows]);

  const handleSelectionChange = useCallback((keys: Selection) => {
    const newKeySet = keys === "all" ? new Set(groupedSurveys.map(g => g.id)) : keys as Set<string>;
    
    setSelectedKeys(keys);
    
    setAllSelectedSurveys((prev) => {
      const next = new Map(prev);
      
      // Reconcile visibility: for each group in the current view, 
      // if it's selected in newKeySet, add its surveys; else remove them.
      groupedSurveys.forEach(group => {
        if (newKeySet.has(group.id)) {
          group.surveys.forEach((s: any) => next.set(s.sid, s));
        } else {
          // Remove surveys of this semester that we have in the map
          Array.from(next.keys()).forEach(sid => {
            const s = next.get(sid);
            if (detectSurveyInfo(s).semester_name === group.id) {
              next.delete(sid);
            }
          });
        }
      });
      
      return next;
    });
  }, [groupedSurveys]);

  const [addConfig, { loading: adding }] = useAddSurveyListConfigMutation();

  useEffect(() => {
    if (!isOpen) {
      setAllSelectedSurveys(new Map());
      setSelectedKeys(new Set([]));
    }
  }, [isOpen]);

  const removeGroup = useCallback((semester: string) => {
    setSelectedKeys(prev => {
      if (prev === "all") {
        // This is tricky if it was "all". 
        // For simplicity in search, assume we handle it as a Set.
        return prev; 
      }
      const next = new Set(prev as Set<string>);
      next.delete(semester);
      return next;
    });

    setAllSelectedSurveys(prev => {
      const next = new Map(prev);
      Array.from(next.keys()).forEach(sid => {
        const s = next.get(sid);
        if (detectSurveyInfo(s).semester_name === semester) {
          next.delete(sid);
        }
      });
      return next;
    });
  }, []);

  const removeSurvey = useCallback((sid: string) => {
    setAllSelectedSurveys(prev => {
      const next = new Map(prev);
      const survey = next.get(sid);
      if (!survey) return prev;
      
      const semName = detectSurveyInfo(survey).semester_name;
      next.delete(sid);
      
      // If no surveys left for this semester in the entire selected map, 
      // then we should consider deselecting it from the main table state too.
      const stillHasSemester = Array.from(next.values()).some(s => detectSurveyInfo(s).semester_name === semName);
      if (!stillHasSemester) {
        setSelectedKeys(prevKeys => {
          if (prevKeys === "all") return prevKeys; 
          const nextKeys = new Set(prevKeys as Set<string>);
          nextKeys.delete(semName);
          return nextKeys;
        });
      }
      return next;
    });
  }, []);

  const handleConfirmAdd = async () => {
    if (allSelectedSurveys.size === 0) return;

    const promises = Array.from(allSelectedSurveys.values()).map((survey) => {
      const info = detectSurveyInfo(survey);
      return addConfig({
        variables: {
          input: {
            title: survey.title,
            sid: survey.sid,
            type: info.type || undefined,
            survey_type: type,
            semester_type: info.semester_type || undefined,
            year: info.year || undefined,
            semester_name: info.semester_name || undefined,
          },
        },
      });
    });

    await Promise.allSettled(promises);
    setAllSelectedSurveys(new Map());
    setSelectedKeys(new Set([]));
    onAddSelected();
    onClose();
  };

  const selectedList = useMemo(() => {
    const result: { name: string; count: number; surveys: any[] }[] = [];
    Array.from(allSelectedSurveys.values()).forEach(s => {
      const info = detectSurveyInfo(s);
      const semName = info.semester_name || "Khác";
      let existing = result.find(r => r.name === semName);
      if (!existing) {
        existing = { name: semName, count: 0, surveys: [] };
        result.push(existing);
      }
      existing.count++;
      existing.surveys.push(s);
    });
    return result;
  }, [allSelectedSurveys]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex justify-between items-center pr-10">
          <div className="flex items-center gap-3">
            <span>Tìm kiếm khảo sát từ UIT Survey</span>
            {allSelectedSurveys.size > 0 && (
              <Button 
                size="sm" 
                color="primary" 
                variant="flat" 
                onPress={onListOpen}
                startContent={<AiOutlineUnorderedList />}
              >
                Đã chọn {selectedList.length} học kỳ ({allSelectedSurveys.size} khảo sát)
              </Button>
            )}
          </div>
        </ModalHeader>
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
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            classNames={{
              wrapper: "max-h-[400px] overflow-auto",
            }}
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
              <TableColumn width={70}>SID</TableColumn>
              <TableColumn>Tên khảo sát</TableColumn>
              <TableColumn width={180} align="center">Tên học kỳ</TableColumn>
              <TableColumn width={70} align="center">Loại</TableColumn>
            </TableHeader>
            <TableBody
              items={groupedSurveys}
              loadingContent={<Spinner label="Đang tải..." />}
              isLoading={loading}
              emptyContent={"Không tìm thấy dữ liệu"}
            >
              {(item: any) => (
                <TableRow key={item.id}>
                    <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.sids.map((sid: string) => (
                        <span key={sid} className="text-tiny text-default-400 font-mono flex items-center gap-1">
                          {sid}
                          {existingSids.has(sid) && (
                            <Chip size="sm" variant="flat" color="success" className="h-4 px-1 text-[10px] min-w-0">Đã thêm</Chip>
                          )}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="py-1 flex flex-col gap-1">
                      {item.titles.map((title: string, idx: number) => (
                        <span key={idx} className="text-small font-medium text-default-700 line-clamp-1">
                          {title}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-small font-bold text-primary">{item.semester_name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {item.types.map((t: string) => (
                        <Chip key={t} size="sm" variant="flat" color="primary" className="border-none">
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </ModalBody>
      </ModalContent>

      <Modal isOpen={isListOpen} onClose={onListClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Danh sách khảo sát đã chọn</ModalHeader>
          <ModalBody>
            {selectedList.length === 0 ? (
              <p className="text-center py-10 text-default-400">Chưa có khảo sát nào được chọn</p>
            ) : (
              <div className="flex flex-col gap-4">
                {selectedList.map(group => (
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
                        {(s: any) => (
                          <TableRow key={s.sid}>
                            <TableCell><span className="text-tiny font-mono">{s.sid}</span></TableCell>
                            <TableCell><span className="text-small">{s.title}</span></TableCell>
                            <TableCell><span className="text-small">{detectSurveyInfo(s).type || "-"}</span></TableCell>
                            <TableCell>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => removeSurvey(s.sid)}
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
            <Button color="primary" isLoading={adding} onPress={handleConfirmAdd}>
              Xác nhận thêm các khảo sát này
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  );
};