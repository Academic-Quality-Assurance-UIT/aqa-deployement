"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import {
	useFacultiesQuery,
	useLecturerRankingQuery,
	useSemestersQuery,
} from "@/gql/graphql";
import {
	Accordion,
	AccordionItem,
	Button,
	Checkbox,
	Chip,
	Input,
	Select,
	SelectItem,
	Spinner,
} from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoTrophyOutline, IoSearch } from "react-icons/io5";
import {
	HiOutlineArrowTrendingUp,
	HiOutlineArrowTrendingDown,
} from "react-icons/hi2";
import { RiSparklingLine } from "react-icons/ri";
import { hashAndShorten } from "@/utils/lecturerIdHash";

type LecturerRankingProps = {
	facultyId?: string;
};

export default function LecturerRanking({ facultyId }: LecturerRankingProps) {
	const { query, setUrlQuery } = useFilterUrlQuery();
	const router = useRouter();
	const searchParams = useSearchParams();
	const isShowedName = searchParams.get("showLecturerName") === "true";

	// Filter UI state (local to input fields)
	const [minClasses, setMinClasses] = useState(0);
	const [limit, setLimit] = useState(10);
	const [showAll, setShowAll] = useState(false);
	const [localSemesterId, setLocalSemesterId] = useState(
		query.semester_id || ""
	);
	const [localFacultyId, setLocalFacultyId] = useState(
		facultyId || query.faculty_id || ""
	);

	// Actual query parameters (triggered by button)
	const [activeParams, setActiveParams] = useState({
		minClasses: 0,
		limit: 10,
		semesterId: query.semester_id || "",
		facultyId: facultyId || query.faculty_id || "",
	});

	// Fetch semesters & faculties for filters
	const { data: semestersData } = useSemestersQuery();
	const { data: facultiesData } = useFacultiesQuery();

	const handleSearch = () => {
		setActiveParams({
			minClasses,
			limit: showAll ? 0 : limit,
			semesterId: localSemesterId,
			facultyId: localFacultyId,
		});
	};

	// Build filter for the ranking query based on activeParams
	const rankingFilter = useMemo(
		() => ({
			semester_id: activeParams.semesterId || undefined,
			faculty_id: activeParams.facultyId || undefined,
		}),
		[activeParams.semesterId, activeParams.facultyId]
	);

	const { data, loading } = useLecturerRankingQuery({
		variables: {
			filter: rankingFilter,
			minClasses: activeParams.minClasses || 0,
			limit: activeParams.limit,
		},
		fetchPolicy: "network-only",
	});

	const items = data?.lecturerRanking?.items || [];

	// Navigate to lecturer detail with clean breadcrumbs
	const handleLecturerClick = useCallback(
		(lecturerId: string) => {
			setUrlQuery(`/lecturer/${lecturerId}`, {
				lecturer_id: lecturerId,
				semester_id: "",
				faculty_id: "",
				subjects: undefined,
				criteria_id: "",
				class_id: "",
				class_type: undefined,
			});
		},
		[setUrlQuery]
	);

	// Rank change display
	const renderRankChange = (
		currentRank: number,
		previousRank: number | null | undefined
	) => {
		if (previousRank === null || previousRank === undefined) {
			return (
				<Chip
					size="sm"
					variant="flat"
					color="secondary"
					startContent={<RiSparklingLine size={12} />}
					classNames={{ content: "font-semibold text-xs" }}
				>
					Mới
				</Chip>
			);
		}

		const change = previousRank - currentRank;
		if (change > 0) {
			return (
				<Chip
					size="sm"
					variant="flat"
					color="success"
					startContent={
						<HiOutlineArrowTrendingUp size={14} />
					}
					classNames={{ content: "font-semibold text-xs" }}
				>
					+{change}
				</Chip>
			);
		} else if (change < 0) {
			return (
				<Chip
					size="sm"
					variant="flat"
					color="danger"
					startContent={
						<HiOutlineArrowTrendingDown size={14} />
					}
					classNames={{ content: "font-semibold text-xs" }}
				>
					{change}
				</Chip>
			);
		} else {
			return (
				<Chip
					size="sm"
					variant="flat"
					color="default"
					classNames={{ content: "font-semibold text-xs" }}
				>
					—
				</Chip>
			);
		}
	};

	// Format avg point with scale 4
	const formatPoint = (point: number) => {
		return point.toFixed(2) + " / 4.0";
	};

	// Medal emoji for top 3
	const getRankDisplay = (rank: number) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return `#${rank}`;
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Filters */}
			<div className="flex flex-col gap-4 p-4 bg-content1 rounded-xl border border-divider">
				<div className="flex items-center gap-2 mb-1">
					<IoTrophyOutline size={20} className="text-primary" />
					<p className="font-bold text-foreground-900">
						Bộ lọc xếp hạng
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Semester filter */}
					<Select
						label="Học kỳ"
						placeholder="Tất cả học kỳ"
						selectedKeys={
							localSemesterId ? [localSemesterId] : []
						}
						onChange={(e) =>
							setLocalSemesterId(e.target.value)
						}
						variant="bordered"
						size="sm"
						classNames={{
							trigger: "bg-background border-1",
						}}
					>
						{(semestersData?.semesters || []).map(
							(semester) => (
								<SelectItem
									key={semester.semester_id}
								>
									{semester.display_name}
								</SelectItem>
							)
						)}
					</Select>

					{/* Faculty filter (hidden when facultyId is provided) */}
					{!facultyId && (
						<Select
							label="Khoa"
							placeholder="Tất cả khoa"
							selectedKeys={
								localFacultyId
									? [localFacultyId]
									: []
							}
							onChange={(e) =>
								setLocalFacultyId(e.target.value)
							}
							variant="bordered"
							size="sm"
							classNames={{
								trigger: "bg-background border-1",
							}}
						>
							{(
								facultiesData?.faculties.data || []
							).map((faculty) => (
								<SelectItem
									key={faculty.faculty_id}
								>
									{faculty.display_name}
								</SelectItem>
							))}
						</Select>
					)}

					{/* Min classes */}
					<Input
						label="Số lớp tối thiểu"
						type="number"
						variant="bordered"
						size="sm"
						min={0}
						value={minClasses.toString()}
						onChange={(e) =>
							setMinClasses(
								Math.max(
									0,
									parseInt(e.target.value) || 0
								)
							)
						}
						classNames={{
							inputWrapper: "bg-background border-1",
						}}
					/>

					{/* Limit / show all */}
					<div className="flex flex-col gap-2">
						<Input
							label="Số giảng viên hiển thị"
							type="number"
							variant="bordered"
							size="sm"
							min={1}
							isDisabled={showAll}
							value={limit.toString()}
							onChange={(e) =>
								setLimit(
									Math.max(
										1,
										parseInt(e.target.value) || 10
									)
								)
							}
							classNames={{
								inputWrapper: "bg-background border-1",
							}}
						/>
						<Checkbox
							size="sm"
							color="primary"
							isSelected={showAll}
							onValueChange={setShowAll}
							classNames={{
								label: "text-xs text-foreground-600 font-medium",
								wrapper: "border-2 border-primary/20 rounded-md",
							}}
						>
							Hiển thị tất cả
						</Checkbox>
					</div>
				</div>
				<div className="flex justify-end border-t border-divider pt-4 mt-2">
					<Button
						color="primary"
						variant="solid"
						onPress={handleSearch}
						startContent={<IoSearch size={18} />}
						className="px-8 font-bold"
					>
						Xem kết quả
					</Button>
				</div>
			</div>

			{/* Results */}
			{loading ? (
				<div className="flex items-center justify-center py-16">
					<Spinner size="lg" color="primary" />
					<p className="ml-3 text-foreground-500 font-medium">
						Đang tải xếp hạng...
					</p>
				</div>
			) : items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 gap-3">
					<IoTrophyOutline
						size={48}
						className="text-foreground-300"
					/>
					<p className="text-foreground-400 font-medium">
						Không tìm thấy dữ liệu xếp hạng cho bộ lọc hiện
						tại
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<p className="text-sm text-foreground-500 font-medium">
						Hiển thị {items.length} giảng viên
					</p>
					<Accordion
						variant="splitted"
						selectionMode="multiple"
						className="px-0 gap-2"
					>
						{items.map((item) => (
							<AccordionItem
								key={item.lecturer_id}
								aria-label={`Rank ${item.rank}: ${item.display_name}`}
								classNames={{
									base: "group-[.is-splitted]:shadow-small group-[.is-splitted]:bg-content1",
									title: "text-sm",
									trigger: "py-3 px-4",
									content: "px-4 pb-4",
								}}
								title={
									<div className="flex items-center justify-between w-full gap-3 pr-2">
										<div className="flex items-center gap-3 min-w-0 flex-1">
											<span className="flex-none text-lg font-bold text-primary w-10 text-center">
												{getRankDisplay(
													item.rank
												)}
											</span>
											<div className="min-w-0 flex-1">
												<button
													onClick={(
														e
													) => {
														e.stopPropagation();
														handleLecturerClick(
															item.lecturer_id
														);
													}}
													className="text-left hover:text-primary transition-colors duration-200 font-semibold truncate block max-w-full"
												>
													{item.display_name}
												</button>
												<p className="text-xs text-foreground-500 truncate">
													{item.faculty_name}{" "}
													—{" "}
													<span className="text-foreground-600">
														Đã
														dạy{" "}
														<strong>
															{
																item.total_subjects
															}
														</strong>{" "}
														môn
													</span>{" "}
													—{" "}
													<span className="text-foreground-600">
														<strong>
															{
																item.total_classes
															}
														</strong>{" "}
														lớp
													</span>
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 flex-none">
											{renderRankChange(
												item.rank,
												item.previous_rank
											)}
											<Chip
												size="sm"
												variant="shadow"
												color="primary"
												classNames={{
													content:
														"font-bold text-sm",
												}}
											>
												{formatPoint(
													item.avg_point
												)}
											</Chip>
										</div>
									</div>
								}
							>
								<div className="flex flex-col gap-2">
									<p className="text-sm font-semibold text-foreground-700 mb-1">
										Các môn đã giảng dạy
									</p>
									{item.taught_subjects &&
									item.taught_subjects.length > 0 ? (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{item.taught_subjects.map(
												(subject) => (
													<div
														key={
															subject.subject_id
														}
														className="px-3 py-2 bg-background rounded-lg border border-divider text-sm text-foreground-700 hover:bg-foreground-100 transition-colors duration-200"
													>
														{
															subject.display_name
														}
													</div>
												)
											)}
										</div>
									) : (
										<p className="text-sm text-foreground-400 italic">
											Không có dữ liệu môn học
										</p>
									)}
								</div>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			)}
		</div>
	);
}
