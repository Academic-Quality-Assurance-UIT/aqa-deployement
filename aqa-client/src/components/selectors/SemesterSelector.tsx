"use client";

import SemesterIcon from "@/assets/SemesterIcon";
import { useFilter } from "@/contexts/FilterContext";
import { Semester, useSemestersQuery } from "@/gql/graphql";
import useNavigate from "@/hooks/useNavigate";
import { useRememberValue } from "@/hooks/useRememberValue";
import {
	Accordion,
	AccordionItem,
	Button,
	Checkbox,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { useCallback, useEffect, useMemo, useRef } from "react";
import OptionButton from "../OptionButton";

type FilterType = {
	lecturer_id?: string;
};

type SemesterSelectorProps = {
	semester?: Semester;
	semesterIds?: string[];
	onChangeSelection?: (semester: Semester | undefined, semesterIds: string[]) => any;
	semesters: Semester[];
	isNoBorder?: boolean;
} & SemesterPropType;

function SemesterSelector_({
	semester,
	semesterIds = [],
	onChangeSelection,
	semesters,
	isNoBorder = false,
}: SemesterSelectorProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const currentSelectedRef = useRef<any>();

	// Support for both simple single selection and multi-select tracking
	const effectiveIds = useMemo(() => {
		if (semesterIds && semesterIds.length > 0) return semesterIds;
		if (semester?.semester_id) return [semester.semester_id];
		return [];
	}, [semesterIds, semester]);

	const hasValue = effectiveIds.length > 0;

	const buttonText = useMemo(() => {
		if (effectiveIds.length > 1) {
			const found = semesters.find((s) => s.semester_id === effectiveIds[0]);
			return `Năm học ${found?.year || "Khác"}`;
		} else if (effectiveIds.length === 1) {
			const found = semesters.find((s) => s.semester_id === effectiveIds[0]);
			return found?.display_name || "1 Học kỳ";
		}
		return "Chọn học kỳ";
	}, [effectiveIds, semesters]);

	const groupedSemesters = useMemo(() => {
		const groups: Record<string, Semester[]> = {};
		for (const sem of semesters) {
			const year = sem.year || "Khác";
			if (!groups[year]) groups[year] = [];
			groups[year].push(sem);
		}
		const sortedGroups: Record<string, Semester[]> = {};
		Object.keys(groups)
			.sort((a, b) => b.localeCompare(a))
			.forEach((key) => {
				sortedGroups[key] = groups[key];
			});
		return sortedGroups;
	}, [semesters]);

	const handleClearAll = useCallback(
		(onClose: () => void) => {
			onChangeSelection?.({ display_name: "Tất cả học kỳ", semester_id: "" }, []);
			onClose();
		},
		[onChangeSelection]
	);

	const updateSelections = useCallback(
		(newIds: string[]) => {
			let matchingSemester: Semester | undefined = undefined;
			if (newIds.length === 0) {
				matchingSemester = { display_name: "Tất cả học kỳ", semester_id: "" };
			} else if (newIds.length === 1) {
				matchingSemester = semesters.find((s) => s.semester_id === newIds[0]);
			}
			onChangeSelection?.(matchingSemester, newIds);
		},
		[semesters, onChangeSelection]
	);

	const toggleSemester = (id: string, checked: boolean) => {
		if (checked) {
			const targetSem = semesters.find((s) => s.semester_id === id);
			const targetYear = targetSem?.year;
			// Clear other years, only keep same year
			const newIds = effectiveIds.filter((semId) => {
				const s = semesters.find((x) => x.semester_id === semId);
				return s?.year === targetYear;
			});
			if (!newIds.includes(id)) newIds.push(id);
			updateSelections(newIds);
		} else {
			const newIds = effectiveIds.filter((x) => x !== id);
			updateSelections(newIds);
		}
	};

	const toggleYear = (yearSemesters: Semester[], checked: boolean) => {
		if (checked) {
			// Overwrite to only select this year
			const newIds = yearSemesters.map((s) => s.semester_id);
			updateSelections(newIds);
		} else {
			// Deselect this year
			let newIds = [...effectiveIds];
			yearSemesters.forEach((sem) => {
				newIds = newIds.filter((x) => x !== sem.semester_id);
			});
			updateSelections(newIds);
		}
	};

	useEffect(() => {
		if (isOpen && currentSelectedRef.current) {
			currentSelectedRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [isOpen]);

	return (
		<>
			<OptionButton
				onPress={onOpen}
				hasValue={hasValue}
				isNoBorder={isNoBorder}
			>
				{buttonText}
			</OptionButton>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				scrollBehavior="inside"
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex justify-between items-center gap-2">
								<p>Chọn học kỳ</p>
								<Button
									size="sm"
									variant="flat"
									color="danger"
									onPress={() => handleClearAll(onClose)}
								>
									Bỏ chọn tất cả
								</Button>
							</ModalHeader>
							<ModalBody className="pb-8 pt-3">
								<Accordion selectionMode="multiple" className="px-0">
									{Object.entries(groupedSemesters).map(([year, sems]) => {
										const yearIds = sems.map((s) => s.semester_id);
										const selectedCount = yearIds.filter((id) =>
											effectiveIds.includes(id)
										).length;
										const isAllSelected =
											selectedCount === yearIds.length && yearIds.length > 0;
										const isIndeterminate =
											selectedCount > 0 && selectedCount < yearIds.length;

										return (
											<AccordionItem
												key={year}
												aria-label={`Năm ${year}`}
												className="border-b-small"
												title={
													<div className="flex items-center gap-3">
														<Checkbox
															isSelected={isAllSelected}
															isIndeterminate={isIndeterminate}
															onChange={(e) => toggleYear(sems, e.target.checked)}
															radius="sm"
															classNames={{ wrapper: "border-2 border-default-300 bg-default-100 rounded-md" }}
														/>
														<span className="font-medium text-black">
															Năm {year}
														</span>
													</div>
												}
											>
												<div className="flex flex-col gap-3 pl-8 pb-4">
													{sems.map((sem) => {
														const isSelected = effectiveIds.includes(
															sem.semester_id
														);
														return (
															<Checkbox
																key={sem.semester_id}
																isSelected={isSelected}
																onChange={(e) =>
																	toggleSemester(
																		sem.semester_id,
																		e.target.checked
																	)
																}
																radius="sm"
																classNames={{ wrapper: "border-2 border-default-300 bg-default-100 rounded-md" }}
																className={
																	isSelected ? "font-medium text-primary" : ""
																}
															>
																{sem.display_name}
															</Checkbox>
														);
													})}
												</div>
											</AccordionItem>
										);
									})}
								</Accordion>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default function SemesterSelector({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const { semester, setSemester, semesterIds, setSemesterIds } = useFilter();
	const { data } = useSemestersQuery();

	const onChangeSelection = useCallback(
		(sem: Semester | undefined, ids: string[]) => {
			setSemesterIds(ids);
			setSemester(sem);
		},
		[setSemesterIds, setSemester]
	);

	return (
		<SemesterSelector_
			semester={semester}
			semesterIds={semesterIds}
			onChangeSelection={onChangeSelection}
			semesters={data?.semesters || []}
			{...props}
		/>
	);
}

export function SemesterSelectorWithSearchParam({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const semesterId = searchParams.get("semester");

	const { data: semesters } = useSemestersQuery();
	const data = useRememberValue(semesters);

	const semester = useMemo<Semester | undefined>(() => {
		const semesterList = data?.semesters;
		if (semesterList?.length || 0 > 0) {
			if (semesterId)
				return semesterList?.find((v) => v.semester_id == semesterId);
		}
	}, [data?.semesters, semesterId]);

	const onChangeSelection = useCallback(
		(sem: Semester | undefined, ids: string[]) => {
			if (ids && ids.length > 0) {
				navigate.replace({ semester: ids.join(",") });
			} else {
				navigate.replace({ semester: "" });
			}
		},
		[navigate]
	);

	return (
		<SemesterSelector_
			semester={semester}
			semesterIds={semesterId ? semesterId.split(",") : []}
			onChangeSelection={onChangeSelection}
			semesters={data?.semesters || []}
			{...props}
		/>
	);
}

type SemesterPropType = {
	isNoBorder?: boolean;
};

export function SemesterSelectorWithFilterUrlQuery({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const { query, setUrlQuery } = useFilterUrlQuery();
	const pathname = usePathname();

	const { data: semestersData } = useSemestersQuery();

	const semester = useMemo<Semester | undefined>(() => {
		const semesterList = semestersData?.semesters;
		if (semesterList && semesterList.length > 0) {
			if (query.semester_id)
				return semesterList.find((v) => v.semester_id === query.semester_id);
		}
	}, [semestersData?.semesters, query.semester_id]);

	const onChangeSelection = useCallback(
		(sem: Semester | undefined, ids: string[]) => {
			setUrlQuery(pathname, {
				semester_id: sem?.semester_id || "",
				semester_ids: ids,
			});
		},
		[setUrlQuery, pathname]
	);

	return (
		<SemesterSelector_
			semester={semester}
			semesterIds={
				query.semester_ids || (query.semester_id ? [query.semester_id] : [])
			}
			onChangeSelection={onChangeSelection}
			semesters={semestersData?.semesters || []}
			{...props}
		/>
	);
}
