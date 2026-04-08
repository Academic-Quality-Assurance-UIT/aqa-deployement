"use client";

import {
	useSemestersQuery,
	useRunTopicAssignmentMutation,
	useTopicAssignmentPreviewLazyQuery,
	useGetCrawlJobsQuery,
	CrawlJobType,
	CrawlJobStatus,
} from "@/gql/graphql";
import {
	Button,
	Select,
	SelectItem,
	Chip,
	Spinner,
	Progress,
	Accordion,
	AccordionItem,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
	AiOutlinePlayCircle,
	AiOutlineHistory,
	AiOutlineEye,
	AiOutlineThunderbolt,
} from "react-icons/ai";

const TOPIC_LABELS: Record<string, { label: string; color: "primary" | "success" | "warning" | "danger" | "default" }> = {
	lecturer: { label: "Giảng viên", color: "primary" },
	training_program: { label: "Chương trình ĐT", color: "success" },
	facility: { label: "Cơ sở vật chất", color: "warning" },
	others: { label: "Khác", color: "default" },
};

const SENTIMENT_LABELS: Record<string, { label: string; color: "success" | "danger" | "default" }> = {
	positive: { label: "Tích cực", color: "success" },
	negative: { label: "Tiêu cực", color: "danger" },
	neutral: { label: "Trung lập", color: "default" },
};

export const TopicAssignmentManager = () => {
	const [selectedSemesters, setSelectedSemesters] = useState<Set<string>>(
		new Set()
	);

	// Queries
	const { data: semesterData, loading: semesterLoading } =
		useSemestersQuery();
	const {
		data: jobsData,
		loading: jobsLoading,
		refetch: refetchJobs,
		startPolling,
		stopPolling,
	} = useGetCrawlJobsQuery({
		variables: { type: CrawlJobType.TopicAssignment },
		fetchPolicy: "network-only",
	});

	const [
		fetchPreview,
		{ data: previewData, loading: previewLoading },
	] = useTopicAssignmentPreviewLazyQuery({
		fetchPolicy: "network-only",
	});

	const [runTopicAssignment, { loading: runLoading }] =
		useRunTopicAssignmentMutation();

	const semesters = useMemo(
		() => semesterData?.semesters || [],
		[semesterData]
	);

	const topicJobs = useMemo(
		() =>
			(jobsData?.crawlJobs || []).filter(
				(j: any) => j.type === CrawlJobType.TopicAssignment
			),
		[jobsData]
	);

	const latestJob = topicJobs[0];
	const isRunning = latestJob?.status === CrawlJobStatus.Running;
	const history = topicJobs.slice(0, 10);

	// Poll while job is running
	useEffect(() => {
		if (isRunning) {
			startPolling(3000);
		} else {
			stopPolling();
		}
		return () => stopPolling();
	}, [isRunning, startPolling, stopPolling]);

	// Fetch preview when semester selection changes
	const handlePreview = useCallback(() => {
		const ids = Array.from(selectedSemesters);
		fetchPreview({
			variables: {
				semesterIds: ids.length > 0 ? ids : undefined,
				limit: 20,
				offset: 0,
			},
		});
	}, [selectedSemesters, fetchPreview]);

	const handleRun = async () => {
		const ids = Array.from(selectedSemesters);
		try {
			await runTopicAssignment({
				variables: {
					semesterIds:
						ids.length > 0 ? ids : undefined,
				},
			});
			refetchJobs();
		} catch (err) {
			console.error("Failed to run topic assignment:", err);
		}
	};

	const handleSelectAll = () => {
		if (selectedSemesters.size === semesters.length) {
			setSelectedSemesters(new Set());
		} else {
			setSelectedSemesters(
				new Set(semesters.map((s: any) => s.semester_id))
			);
		}
	};

	const getStatusChip = (status: CrawlJobStatus) => {
		switch (status) {
			case CrawlJobStatus.Running:
				return (
					<Chip color="warning" variant="dot" size="sm">
						Đang chạy
					</Chip>
				);
			case CrawlJobStatus.Completed:
				return (
					<Chip color="success" variant="flat" size="sm">
						Hoàn thành
					</Chip>
				);
			case CrawlJobStatus.Failed:
				return (
					<Chip color="danger" variant="flat" size="sm">
						Lỗi
					</Chip>
				);
			case CrawlJobStatus.Abandoned:
				return (
					<Chip color="default" variant="flat" size="sm">
						Đã hủy
					</Chip>
				);
			default:
				return (
					<Chip variant="flat" size="sm">
						{status}
					</Chip>
				);
		}
	};

	const preview = previewData?.topicAssignmentPreview;

	return (
		<div className="flex flex-col gap-6">
			{/* Semester Selection */}
			<div className="flex flex-col gap-4 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl">
				<div className="flex flex-col sm:flex-row gap-4 sm:items-end">
					<div className="flex-1">
						<Select
							label="Chọn học kỳ"
							placeholder="Chọn học kỳ để phân loại"
							selectionMode="multiple"
							selectedKeys={selectedSemesters}
							onSelectionChange={(keys) =>
								setSelectedSemesters(
									keys as Set<string>
								)
							}
							isLoading={semesterLoading}
							variant="bordered"
							className="w-full"
							classNames={{
								trigger:
									"bg-background min-h-12",
							}}
						>
							{semesters.map((s: any) => (
								<SelectItem
									key={s.semester_id}
									textValue={s.display_name}
								>
									{s.display_name}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="flex gap-2">
						<Button
							size="md"
							variant="flat"
							onPress={handleSelectAll}
							className="font-bold"
						>
							{selectedSemesters.size ===
							semesters.length
								? "Bỏ chọn tất cả"
								: "Chọn tất cả"}
						</Button>
						<Button
							size="md"
							variant="flat"
							color="secondary"
							startContent={<AiOutlineEye />}
							onPress={handlePreview}
							isLoading={previewLoading}
							className="font-bold"
						>
							Xem trước
						</Button>
					</div>
				</div>

				{/* Preview Stats */}
				{preview && (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
						<div className="p-4 bg-background rounded-xl border border-gray-100 dark:border-gray-800">
							<p className="text-xs text-gray-400 mb-1">
								Tổng bình luận
							</p>
							<p className="text-2xl font-bold text-foreground">
								{preview.totalComments.toLocaleString()}
							</p>
						</div>
						<div className="p-4 bg-background rounded-xl border border-gray-100 dark:border-gray-800">
							<p className="text-xs text-gray-400 mb-1">
								Đã phân loại
							</p>
							<p className="text-2xl font-bold text-green-500">
								{preview.assignedComments.toLocaleString()}
							</p>
						</div>
						<div className="p-4 bg-background rounded-xl border border-gray-100 dark:border-gray-800">
							<p className="text-xs text-gray-400 mb-1">
								Chưa phân loại
							</p>
							<p className="text-2xl font-bold text-orange-500">
								{preview.unassignedComments.toLocaleString()}
							</p>
						</div>
					</div>
				)}

				{/* Run Button */}
				<div className="flex gap-3 items-center mt-2">
					<Button
						color="secondary"
						variant="flat"
						size="md"
						startContent={
							!runLoading && !isRunning ? (
								<AiOutlinePlayCircle size={18} />
							) : undefined
						}
						onPress={handleRun}
						isLoading={runLoading}
						isDisabled={isRunning}
						className="font-bold px-6"
					>
						{isRunning
							? "Đang xử lý..."
							: "Chạy phân loại"}
					</Button>
					{isRunning && latestJob && (
						<div className="flex-1 flex items-center gap-3">
							<Spinner size="sm" />
							<div className="flex-1">
								<Progress
									value={
										latestJob.progress ||
										0
									}
									maxValue={
										latestJob.total_data ||
										100
									}
									size="sm"
									color="secondary"
									className="flex-1"
									showValueLabel
									label={`${latestJob.progress || 0}/${latestJob.total_data || "?"} bình luận`}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Latest Job Error */}
				{latestJob?.status === CrawlJobStatus.Failed && (
					<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 text-xs">
						Lỗi:{" "}
						{latestJob.error_message ||
							"Không rõ nguyên nhân"}
					</div>
				)}

				{/* Latest Job Success */}
				{latestJob?.status === CrawlJobStatus.Completed &&
					latestJob.summary && (
						<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-400 text-sm">
							✓ Hoàn thành:{" "}
							{latestJob.summary.success || 0}{" "}
							thành công,{" "}
							{latestJob.summary.failed || 0} lỗi /{" "}
							{latestJob.summary.total || 0} tổng
						</div>
					)}
			</div>

			{/* Comment Preview Table */}
			{preview && preview.samples.length > 0 && (
				<div className="flex flex-col gap-2 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl">
					<h4 className="font-semibold text-sm text-foreground mb-2">
						Xem trước bình luận ({preview.samples.length}{" "}
						mẫu)
					</h4>
					<div className="overflow-x-auto max-h-80 overflow-y-auto">
						<Table
							aria-label="Comment preview"
							removeWrapper
							isCompact
							classNames={{
								th: "text-xs",
								td: "text-xs",
							}}
						>
							<TableHeader>
								<TableColumn>NỘI DUNG</TableColumn>
								<TableColumn>CHỦ ĐỀ</TableColumn>
								<TableColumn>CẢM XÚC</TableColumn>
								<TableColumn>HỌC KỲ</TableColumn>
							</TableHeader>
							<TableBody>
								{preview.samples.map(
									(
										sample: any,
										idx: number
									) => (
										<TableRow
											key={
												sample.comment_id ||
												idx
											}
										>
											<TableCell className="max-w-xs truncate">
												{sample.display_name ||
													"—"}
											</TableCell>
											<TableCell>
												{sample.topic ? (
													<Chip
														size="sm"
														variant="flat"
														color={
															TOPIC_LABELS[
																sample
																	.topic
															]
																?.color ||
															"default"
														}
													>
														{TOPIC_LABELS[
															sample
																.topic
														]
															?.label ||
															sample.topic}
													</Chip>
												) : (
													<span className="text-gray-400 italic">
														Chưa có
													</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex gap-1 flex-wrap">
													{sample.type_list &&
													sample
														.type_list
														.length >
														0 ? (
														sample.type_list.map(
															(
																t: string
															) => (
																<Chip
																	key={
																		t
																	}
																	size="sm"
																	variant="dot"
																	color={
																		SENTIMENT_LABELS[
																			t
																		]
																			?.color ||
																		"default"
																	}
																>
																	{SENTIMENT_LABELS[
																		t
																	]
																		?.label ||
																		t}
																</Chip>
															)
														)
													) : (
														<span className="text-gray-400 italic">
															—
														</span>
													)}
												</div>
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{sample.semester_name ||
													"—"}
											</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			{/* Run History */}
			{history.length > 0 && (
				<Accordion variant="light" className="px-0">
					<AccordionItem
						key="topic-history"
						aria-label="Topic Assignment History"
						title={
							<span className="text-xs text-gray-400 flex items-center gap-1">
								<AiOutlineHistory /> Lịch sử phân
								loại gần nhất
							</span>
						}
						className="text-xs"
					>
						<div className="flex flex-col gap-1">
							{history.map((h: any) => (
								<div
									key={h.crawl_job_id}
									className="flex justify-between items-center text-[11px] py-2 px-2 border-b border-gray-50 dark:border-zinc-900 last:border-0"
								>
									<span className="text-gray-500">
										{h.started_at
											? format(
													new Date(
														h.started_at
													),
													"HH:mm dd/MM/yyyy",
													{
														locale: vi,
													}
												)
											: "—"}
									</span>
									<div className="flex items-center gap-2">
										{h.summary && (
											<span className="text-gray-400 font-mono">
												{h.summary
													.success ||
													0}
												/
												{h.summary
													.total || 0}
											</span>
										)}
										{getStatusChip(
											h.status
										)}
									</div>
								</div>
							))}
						</div>
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);
};
