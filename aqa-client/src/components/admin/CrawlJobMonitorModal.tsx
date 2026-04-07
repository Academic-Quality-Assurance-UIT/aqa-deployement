"use client";

import {
	CrawlJob,
	CrawlJobStatus,
	useGetCrawlJobQuery,
	useGetCrawlJobLogsQuery,
	useGetCrawlApiRequestLogQuery,
	useGetCrawlStagingDataSummaryQuery,
	useGetCrawlStagingDataQuery,
	useStopCrawlJobMutation,
} from "@/gql/graphql";
import { JsonView, darkStyles, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Progress,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Pagination,
	Divider,
	Tooltip,
	Spinner,
	Tabs,
	Tab,
} from "@heroui/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";
import {
	AiOutlineApi,
	AiOutlineClockCircle,
	AiOutlineCheckCircle,
	AiOutlineCloseCircle,
	AiOutlineExclamationCircle,
	AiOutlineDatabase,
	AiOutlineInfoCircle,
	AiOutlineReload,
	AiOutlineStop,
} from "react-icons/ai";

interface CrawlJobMonitorModalProps {
	job: CrawlJob;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export const CrawlJobMonitorModal = ({ job, isOpen, onOpenChange }: CrawlJobMonitorModalProps) => {
	const [page, setPage] = useState(1);
	const [selectedLog, setSelectedLog] = useState<any | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [stagingPage, setStagingPage] = useState(1);
	const [activeDataType, setActiveDataType] = useState<string | null>(null);
	const [stopCrawlJob, { loading: stopping }] = useStopCrawlJobMutation();
	const [lastReload, setLastReload] = useState<Date>(new Date());
	const limit = 10;

	const { data: jobData, refetch: refetchJob } = useGetCrawlJobQuery({
		variables: { id: job.crawl_job_id },
		fetchPolicy: "network-only",
		skip: !isOpen,
	});

	const currentJob = jobData?.crawlJob || job;
	const isCurrentlyRunning = currentJob.status === CrawlJobStatus.Running;

	// Update polling intervals dynamically
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isOpen && isCurrentlyRunning) {
			interval = setInterval(() => {
				handleReload();
			}, 5000);
		}
		return () => clearInterval(interval);
	}, [isOpen, isCurrentlyRunning]);

	// Fetch logs
	const { data: logsData, refetch: refetchLogs } = useGetCrawlJobLogsQuery({
		variables: {
			jobId: job.crawl_job_id,
			limit,
			offset: (page - 1) * limit,
		},
		skip: !isOpen,
	});

	const { data: stagingData, refetch: refetchStaging } = useGetCrawlStagingDataSummaryQuery({
		variables: { jobId: job.crawl_job_id },
		skip: !isOpen,
	});

	const { data: previewData, refetch: refetchPreview, loading: previewLoading } = useGetCrawlStagingDataQuery({
		variables: { 
			jobId: job.crawl_job_id,
			limit: 10,
			offset: (stagingPage - 1) * 10,
			dataType: activeDataType || undefined,
		},
		skip: !showPreview,
	});

	const stagingSummary = stagingData?.crawlStagingDataSummary;

	// Update active tab when summary is loaded and no tab selected
	useEffect(() => {
		if (stagingSummary?.byType?.length && !activeDataType) {
			setActiveDataType(stagingSummary.byType[0].type);
		}
	}, [stagingSummary, activeDataType]);

	// Detailed API logs for selected entry
	const { data: detailLogData, loading: detailLoading } = useGetCrawlApiRequestLogQuery({
		variables: {
			id: selectedLog?.api_log_id || "",
		},
		skip: !selectedLog || !selectedLog.api_log_id,
	});

	const matchedApiLog = detailLogData?.crawlApiRequestLog;

	const logs = logsData?.crawlJobLogs || [];

	const handleReload = async () => {
		setLastReload(new Date());
		await Promise.all([
			refetchJob(),
			refetchLogs(),
			refetchStaging(),
			showPreview ? refetchPreview() : Promise.resolve(),
		]);
	};

	const handleStopJob = async () => {
		if (window.confirm("Dừng quá trình thu thập đang chạy? Tất cả các dữ liệu đã thu thập sẽ được giữ lại, nhưng tiến trình sẽ stops ngay lập tức.")) {
			try {
				await stopCrawlJob({ variables: { jobId: job.crawl_job_id } });
				await handleReload();
			} catch (e) {
				console.error("Failed to stop job:", e);
			}
		}
	};

	const progress = useMemo(() => {
		if (!currentJob.total_data || currentJob.total_data === 0) return 0;
		const p = Math.round(((currentJob.progress ?? 0) / currentJob.total_data) * 100);
		return Math.min(p, 100);
	}, [currentJob.progress, currentJob.total_data]);

	const getStatusIcon = (status: CrawlJobStatus) => {
		switch (status) {
			case CrawlJobStatus.Running:
				return <AiOutlineClockCircle className="text-warning animate-pulse" size={24} />;
			case CrawlJobStatus.Completed:
				return <AiOutlineCheckCircle className="text-primary" size={24} />;
			case CrawlJobStatus.Confirmed:
				return <AiOutlineCheckCircle className="text-success" size={24} />;
			case CrawlJobStatus.Failed:
				return <AiOutlineCloseCircle className="text-danger" size={24} />;
			default:
				return <AiOutlineExclamationCircle size={24} />;
		}
	};

	const getStatusCodeColor = (code: number | null | undefined) => {
		if (!code) return "default";
		if (code >= 200 && code < 300) return "success";
		if (code >= 400) return "danger";
		return "warning";
	};

	return (
		<>
			<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="5xl"
			scrollBehavior="inside"
			backdrop="blur"
			classNames={{
				base: "bg-white dark:bg-zinc-950",
				header: "border-b border-gray-100 dark:border-zinc-800",
				footer: "border-t border-gray-100 dark:border-zinc-800",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex justify-between items-center pr-12">
							<div className="flex gap-3 items-center">
								{getStatusIcon(currentJob.status)}
								<div className="flex flex-col">
									<p className="text-lg font-bold">Giám sát tiến trình thu thập</p>
									<div className="flex items-center gap-2">
										<p className="text-[10px] text-gray-500 font-normal tracking-tight uppercase">Job ID: {currentJob.crawl_job_id}</p>
										<span className="text-[10px] text-gray-300">•</span>
										<p className="text-[10px] text-gray-500 font-normal">Cập nhật lúc: {format(lastReload, "HH:mm:ss")}</p>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{currentJob.status === CrawlJobStatus.Running && (
									<Button 
										size="sm" 
										color="danger" 
										variant="flat" 
										onPress={handleStopJob}
										isLoading={stopping}
										startContent={<AiOutlineStop />}
										className="font-bold text-[11px] h-8"
									>
										Dừng
									</Button>
								)}
								<Button 
									size="sm" 
									variant="faded" 
									onPress={handleReload}
									startContent={<AiOutlineReload className="animate-spin-slow" />}
									className="bg-gray-50 dark:bg-zinc-900 font-bold text-[11px] h-8"
								>
									Tải lại
								</Button>
							</div>
						</ModalHeader>
						<ModalBody className="py-6 flex flex-col gap-8">
							{/* Status Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1">
									<span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Trạng thái</span>
									<div className="flex items-center gap-2">
										<Chip
											color={
												currentJob.status === CrawlJobStatus.Running
													? "warning"
													: currentJob.status === CrawlJobStatus.Failed
													? "danger"
													: "success"
											}
											variant="flat"
											size="sm"
										>
											{currentJob.status}
										</Chip>
									</div>
								</div>
								<div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1">
									<span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Tiến độ câu trả lời</span>
									<div className="flex items-baseline gap-2">
										<span className="text-xl font-bold">{currentJob.progress ?? 0}</span>
										<span className="text-xs text-gray-500">/ {currentJob.total_data || "?"}</span>
									</div>
								</div>
								{((currentJob.detail_total ?? 0) > 0 || (currentJob.detail_progress ?? 0) > 0) && (
									<div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1">
										<span className="text-xs font-medium uppercase tracking-wider text-primary">DS Sinh viên</span>
										<div className="flex items-baseline gap-2">
											<span className="text-xl font-bold text-primary">{currentJob.detail_progress ?? 0}</span>
											<span className="text-xs text-gray-500">/ {currentJob.detail_total || "?"}</span>
										</div>
									</div>
								)}
								<div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1">
									<span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Hoạt động cuối</span>
									<span className="text-sm font-semibold">
										{currentJob.last_activity_at
											? format(new Date(currentJob.last_activity_at), "HH:mm:ss", { locale: vi })
											: "Chưa có"}
									</span>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<div className="flex justify-between items-end">
										<span className="text-[10px] font-bold flex items-center gap-2 uppercase text-gray-500">
											<AiOutlineDatabase /> Tiến trình câu trả lời
										</span>
										<span className="text-xs font-bold text-primary">{progress}%</span>
									</div>
									<Progress
										value={progress}
										color="primary"
										size="sm"
										radius="sm"
										showValueLabel={false}
										className="drop-shadow-sm"
									/>
								</div>

								{(currentJob.detail_total ?? 0) > 0 && (
									<div className="flex flex-col gap-2">
										<div className="flex justify-between items-end">
											<span className="text-[10px] font-bold flex items-center gap-2 uppercase text-gray-500">
												<AiOutlineDatabase className="text-primary" /> Tiến trình lấy DS sinh viên
											</span>
											<span className="text-xs font-bold text-primary">
												{Math.round(((currentJob.detail_progress || 0) / (currentJob.detail_total || 1)) * 100)}%
											</span>
										</div>
										<Progress
											value={((currentJob.detail_progress || 0) / (currentJob.detail_total || 1)) * 100}
											color="primary"
											size="sm"
											radius="sm"
											showValueLabel={false}
											className="drop-shadow-sm"
										/>
									</div>
								)}
							</div>

							{/* Staging Data Real-time */}
							{stagingData?.crawlStagingDataSummary && (
								<div className="flex flex-col gap-3">
									<span className="text-sm font-bold flex items-center gap-2">
										<AiOutlineDatabase className="text-success" /> Dữ liệu đã lưu tạm (Staging)
									</span>
									<div className="flex flex-wrap gap-2">
										{stagingData.crawlStagingDataSummary.byType.map((item) => (
											<Chip key={item.type} size="sm" variant="flat" color="secondary" className="capitalize">
												{item.type}: {item.count}
											</Chip>
										))}
										{stagingData.crawlStagingDataSummary.totalRecords === 0 && (
											<span className="text-xs text-gray-400 italic">Chưa có dữ liệu nào được lưu...</span>
										)}
										{stagingData.crawlStagingDataSummary.totalRecords > 0 && (
											<Button
												size="sm"
												variant="flat"
												color="secondary"
												onPress={() => setShowPreview(true)}
												startContent={<AiOutlineInfoCircle />}
												className="ml-2 h-7 min-w-unit-16 text-[10px] font-bold"
											>
												Xem trước dữ liệu
											</Button>
										)}
									</div>
								</div>
							)}

							<Divider />

							{/* Logs Table */}
							<div className="flex flex-col gap-4">
								<div className="flex justify-between items-center">
									<span className="text-sm font-bold flex items-center gap-2">
										<AiOutlineApi className="text-primary" /> Nhật ký cuộc gọi API
									</span>
									<div className="flex items-center gap-4">
										<span className="text-xs text-gray-500">Hiển thị {logs.length} log gần nhất</span>
										<Pagination
											total={10} // Fixed or dynamic if backend provides total
											page={page}
											onChange={setPage}
											size="sm"
											variant="flat"
										/>
									</div>
								</div>

								<Table
									aria-label="API Logs"
									removeWrapper
									classNames={{
										th: "bg-gray-50 dark:bg-zinc-900 text-gray-400 text-[10px] uppercase font-bold",
										td: "py-3 border-b border-gray-50 dark:border-zinc-900",
									}}
								>
									<TableHeader>
										<TableColumn>THỜI GIAN</TableColumn>
										<TableColumn>PHƯƠNG THỨC</TableColumn>
										<TableColumn>ENDPOINT</TableColumn>
										<TableColumn>STATUS</TableColumn>
										<TableColumn>DURATION</TableColumn>
										<TableColumn>DETAILS</TableColumn>
									</TableHeader>
									<TableBody emptyContent="Chưa có log nào cho job này.">
										{logs.map((log) => (
											<TableRow key={log.id}>
												<TableCell className="text-[10px] font-mono whitespace-nowrap">
													{format(new Date(log.timestamp), "HH:mm:ss.SSS")}
												</TableCell>
												<TableCell>
													<Chip size="sm" variant="flat" color="default" className="font-bold text-[10px]">
														{log.method}
													</Chip>
												</TableCell>
												<TableCell className="max-w-[200px] truncate">
													<Tooltip content={log.endpoint}>
														<span className="text-xs font-medium text-gray-600 dark:text-gray-300">
															{log.endpoint}
														</span>
													</Tooltip>
												</TableCell>
												<TableCell>
													<Chip
														size="sm"
														variant="flat"
														color={getStatusCodeColor(log.status_code)}
														className="font-bold whitespace-nowrap"
													>
														{log.status_code || "ERR"}
													</Chip>
												</TableCell>
												<TableCell className="text-xs font-semibold whitespace-nowrap">
													{log.duration_ms}ms
												</TableCell>
												<TableCell>
													<div className="flex gap-2">
														<Button 
															size="sm" 
															variant="flat" 
															color="default"
															onPress={() => setSelectedLog(log)}
															className="text-[10px] h-7 px-2 font-bold"
														>
															Chi tiết
														</Button>
														{log.error && (
															<Tooltip content={log.error}>
																<span className="text-danger cursor-pointer"><AiOutlineCloseCircle /></span>
															</Tooltip>
														)}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Đóng
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>

		<Modal
			isOpen={!!selectedLog}
			onOpenChange={(open) => !open && setSelectedLog(null)}
			size="3xl"
			scrollBehavior="inside"
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<p className="text-lg font-bold">Chi tiết cuộc gọi API</p>
							<p className="text-xs text-gray-500 font-normal">Thời gian: {selectedLog ? format(new Date(selectedLog.timestamp), "HH:mm:ss.SSS dd/MM/yyyy") : ""}</p>
						</ModalHeader>
						<ModalBody className="py-4">
							<div className="flex flex-col gap-4">
								<div className="grid grid-cols-4 gap-4">
									<div className="flex flex-col gap-1">
										<span className="text-[10px] text-gray-400 font-bold uppercase">Phương thức</span>
										<Chip size="sm" variant="flat" className="font-bold">{selectedLog?.method}</Chip>
									</div>
									<div className="col-span-2 flex flex-col gap-1">
										<span className="text-[10px] text-gray-400 font-bold uppercase">Endpoint</span>
										<span className="text-sm font-mono break-all">{selectedLog?.endpoint}</span>
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-[10px] text-gray-400 font-bold uppercase">Trạng thái</span>
										<Chip size="sm" variant="flat" color={getStatusCodeColor(selectedLog?.status_code)} className="font-bold">
											{selectedLog?.status_code || "ERROR"}
										</Chip>
									</div>
								</div>

								<Divider />

								{selectedLog?.metadata?.url && (
									<div className="flex flex-col gap-2">
										<span className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wider">
											<AiOutlineInfoCircle size={14} className="text-primary" /> Request URL
										</span>
										<div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
											<p className="text-[11px] font-mono break-all text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-950 p-2 rounded shadow-inner">
												{selectedLog.metadata.url}
											</p>
										</div>
									</div>
								)}

								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-2">
										<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Query Params</span>
										<div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 min-h-[100px]">
											<pre className="text-[10px] font-mono text-gray-700 dark:text-gray-300">
												{selectedLog?.metadata?.params ? JSON.stringify(selectedLog.metadata.params, null, 2) : "Không có params"}
											</pre>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Response Data</span>
										<div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 min-h-[100px] max-h-[400px] overflow-auto">
											{detailLoading ? (
												<div className="flex justify-center items-center h-20"><Spinner size="sm"/></div>
											) : (
												<pre className="text-[10px] font-mono text-gray-700 dark:text-gray-300">
													{matchedApiLog?.response_body 
														? JSON.stringify(matchedApiLog.response_body, null, 2) 
														: selectedLog?.metadata?.responseData 
															? JSON.stringify(selectedLog.metadata.responseData, null, 2)
															: "Không có data"}
												</pre>
											)}
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<span className="text-xs font-bold text-gray-500 uppercase tracking-wider italic opacity-50">Full Metadata (Debug)</span>
									<div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-auto border border-gray-100 dark:border-zinc-800 max-h-40">
										<pre className="text-[10px] font-mono text-gray-400">
											{matchedApiLog ? JSON.stringify(matchedApiLog, null, 2) : selectedLog?.metadata ? JSON.stringify(selectedLog.metadata, null, 2) : "Không có dữ liệu"}
										</pre>
									</div>
								</div>

								{selectedLog?.error && (
									<div className="flex flex-col gap-2">
										<span className="text-xs font-bold text-danger flex items-center gap-2">
											<AiOutlineCloseCircle size={14} /> Thông báo lỗi
										</span>
										<div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
											<p className="text-xs font-mono text-danger-600 dark:text-danger-400">{selectedLog.error}</p>
										</div>
									</div>
								)}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="flat" onPress={onClose}>
								Đóng
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>

		<Modal
			isOpen={showPreview}
			onOpenChange={(open) => !open && setShowPreview(false)}
			size="5xl"
			scrollBehavior="inside"
			backdrop="blur"
			classNames={{
				base: "bg-white dark:bg-zinc-950",
				header: "border-b border-gray-100 dark:border-zinc-800",
				footer: "border-t border-gray-100 dark:border-zinc-800",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 py-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/10 text-primary">
									<AiOutlineDatabase size={24} />
								</div>
								<div>
									<p className="text-xl font-bold">Xem trước dữ liệu tạm (Staging)</p>
									<p className="text-xs text-gray-500 font-normal">Hiển thị dữ liệu mới nhất đã thu thập từ nguồn bên ngoài.</p>
								</div>
							</div>
						</ModalHeader>
						<ModalBody className="py-6">
							<div className="flex flex-col gap-6">
								{/* Summary Stats */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1">
										<span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng số bản ghi</span>
										<span className="text-xl font-bold text-primary">{stagingSummary?.totalRecords || 0}</span>
									</div>
									<div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex flex-col gap-1">
										<span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Số loại dữ liệu</span>
										<span className="text-xl font-bold">{stagingSummary?.byType?.length || 0}</span>
									</div>
								</div>

								{stagingSummary?.byType && (
									<Tabs 
										selectedKey={activeDataType || ""} 
										onSelectionChange={(key) => {
											setActiveDataType(key as string);
											setStagingPage(1);
										}}
										color="primary"
										variant="underlined"
										classNames={{
											tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
											cursor: "w-full bg-primary",
											tab: "max-w-fit px-0 h-12",
											tabContent: "group-data-[selected=true]:text-primary font-bold"
										}}
									>
										{stagingSummary.byType.map((type) => (
											<Tab 
												key={type.type} 
												title={
													<div className="flex items-center space-x-2">
														<span className="capitalize">{type.type}</span>
														<Chip size="sm" variant="flat" color="default" className="font-mono">{type.count}</Chip>
													</div>
												}
											>
												<div className="mt-4">
													<Table 
														aria-label="Staging data table"
														removeWrapper
														classNames={{
															base: "border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden",
															table: "min-w-[600px]",
															th: "bg-gray-50 dark:bg-zinc-900/50 text-gray-400 font-bold uppercase text-[10px] h-12",
															td: "py-4 text-xs border-b border-gray-50 dark:border-zinc-900",
														}}
														bottomContent={
															<div className="flex w-full justify-center py-4 bg-gray-50/50 dark:bg-zinc-900/30 border-t border-gray-50 dark:border-zinc-900">
																<Pagination
																	isCompact
																	showControls
																	showShadow
																	color="primary"
																	page={stagingPage}
																	total={Math.ceil((stagingSummary?.byType?.find(t => t.type === activeDataType)?.count || 0) / 10)}
																	onChange={(page) => setStagingPage(page)}
																	size="sm"
																/>
															</div>
														}
													>
														<TableHeader>
															{(previewData?.crawlStagingData?.[0]?.data ? Object.keys(previewData.crawlStagingData[0].data) : ['VALUE']).map((key) => (
																<TableColumn key={key}>{key.replace(/_/g, ' ').toUpperCase()}</TableColumn>
															))}
														</TableHeader>
														<TableBody 
															items={previewData?.crawlStagingData || []}
															emptyContent={
																<div className="flex flex-col items-center gap-2 py-10 opacity-50">
																	<AiOutlineInfoCircle size={40} />
																	<p>Không có dữ liệu cho loại {activeDataType}</p>
																</div>
															}
															loadingContent={<Spinner color="primary" />}
															loadingState={previewLoading ? "loading" : "idle"}
														>
															{(item: any) => (
																<TableRow key={item.id}>
																	{(Object.keys(item.data || { data: item.data })).map((key) => (
																		<TableCell key={key}>
																			<div className="max-w-[300px] truncate">
																				{item.data[key] === null ? (
																					<span className="text-gray-300 italic">null</span>
																				) : typeof item.data[key] === 'boolean' ? (
																					<Chip size="sm" variant="flat" color={item.data[key] ? "success" : "danger"}>
																						{item.data[key] ? "True" : "False"}
																					</Chip>
																				) : typeof item.data[key] === 'object' ? (
																					<Tooltip content={JSON.stringify(item.data[key])}>
																						<span className="text-primary cursor-help">JSON Object</span>
																					</Tooltip>
																				) : (
																					<span className="text-gray-700 dark:text-gray-300 font-medium">
																						{String(item.data[key])}
																					</span>
																				)}
																			</div>
																		</TableCell>
																	))}
																</TableRow>
															)}
														</TableBody>
													</Table>
												</div>
											</Tab>
										))}
									</Tabs>
								)}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="flat" onPress={onClose} className="font-bold">
								Đóng
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	</>
	);
};
