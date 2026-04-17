"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import StaffSurveyCriteriaChart from "@/components/chart/StaffSurveyCriteriaChart";
import { ComboChart } from "@/components/ComboChart";
import StaffSurveyAdditionalCommentPage from "@/components/comments/StaffSurveyAdditionalCommentPage";
import StaffSurveyAllCommentsPage from "@/components/comments/StaffSurveyAllCommentsPage";
import { FilterProvider } from "@/contexts/FilterContext";
import {
	useGetPointsByCategoryDonViQuery,
	useGetPointsByCategoryQuery,
	useGetStaffSurveyPointsByYearQuery,
} from "@/gql/graphql";
import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	Card,
	CardBody,
	Spinner,
	Tab,
	Tabs,
} from "@heroui/react";
import _ from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
	IoArrowBackOutline,
	IoChevronBackOutline,
	IoChevronForwardOutline,
} from "react-icons/io5";

export default function SemesterStaffSurveyPage() {
	const params = useParams();
	const router = useRouter();
	const semester =
		typeof params.year === "string" ? decodeURIComponent(params.year) : "";

	const [activeView, setActiveView] = useState<number | null>(null);

	// 1. Query for Categories (View 1 & Top Chart)
	const { data: points, loading: loadingPoints } = useGetPointsByCategoryQuery({
		variables: { semester, showUnit: false },
		fetchPolicy: "cache-first",
	});

	// 2. Query for Units (View 2)
	const { data: unitPoints, loading: loadingUnits } =
		useGetPointsByCategoryDonViQuery({
			variables: { semester },
			fetchPolicy: "cache-first",
		});

	// 3. Query for Year Average (Line trend in chart)
	const { data: pointsByYear } = useGetStaffSurveyPointsByYearQuery({
		fetchPolicy: "cache-first",
	});

	const categories = useMemo(
		() => points?.getPointsByCategory ?? [],
		[points]
	);
	const unitCategories = useMemo(
		() => unitPoints?.getPointsByCategoryDonVi ?? [],
		[unitPoints]
	);

	const currentSemesterTrueAvg = useMemo(() => {
		const found = pointsByYear?.getStaffSurveyPointsByYear.find(
			(y) => y.year === semester
		);
		return found?.avg_point || 0;
	}, [semester, pointsByYear]);

	// Top Chart Data
	const topChartData = useMemo(() => {
		return categories.map((point) => ({
			"Điểm đánh giá": point.avg_point,
			"Điểm trung bình": currentSemesterTrueAvg,
			name: point.category,
			color: "sky",
		}));
	}, [categories, currentSemesterTrueAvg]);

	// Unit Chart Data (for View 2)
	const unitChartData = useMemo(() => {
		const avg = _.mean(unitCategories.map((p) => p.avg_point)) || 0;
		return unitCategories.map((point) => ({
			"Điểm đánh giá": point.avg_point,
			"Điểm trung bình": avg,
			name: point.category,
		}));
	}, [unitCategories]);

	const menuItems = [
		{
			id: 1,
			title: "Điểm đánh giá/ý kiến cho từng danh mục",
			description: "Chi tiết điểm và nhận xét theo các tiêu chí khảo sát",
		},
		{
			id: 2,
			title: "Điểm đánh giá/ý kiến dành cho các đơn vị",
			description: "So sánh điểm giữa các khoa, phòng ban và trung tâm",
		},
		{
			id: 3,
			title: "Tất cả ý kiến đánh giá",
			description: "Tổng hợp toàn bộ nhận xét từ sinh viên và giảng viên",
		},
	];

	const loading = loadingPoints;

	const renderDetailView = () => {
		if (!activeView) return null;

		const selectedItem = menuItems.find((item) => item.id === activeView);

		return (
			<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-400">
				{/* DETAIL HEADER */}
				<div className="flex items-center gap-4 mb-2">
					<Button
						isIconOnly
						variant="flat"
						color="primary"
						className="rounded-full"
						onPress={() => setActiveView(null)}
					>
						<IoChevronBackOutline size={22} />
					</Button>
					<h2 className="page-title !text-2xl">
						{selectedItem?.title}
					</h2>
				</div>

				<Card className="border-none shadow-sm overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
					<CardBody className="p-6">
						{activeView === 1 && (
							<div className="flex flex-col w-full">
								<Tabs
									aria-label="Survey Categories"
									color="primary"
									variant="underlined"
									classNames={{
										tabList:
											"max-w-full overflow-x-auto flex-nowrap custom-scrollbar pb-2",
										cursor: "w-full bg-primary",
										tab: "max-w-fit px-4 h-12",
										tabContent:
											"group-data-[selected=true]:text-primary font-semibold",
									}}
								>
									<Tab key="additional_comment" title="Ý kiến khác">
										<div className="mt-4">
											<StaffSurveyAdditionalCommentPage
												semester={semester}
											/>
										</div>
									</Tab>
									{categories.map((item, idx) => (
										<Tab key={item.category} title={item.category}>
											<div
												className="mt-4 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
												style={{ animationDelay: `${idx * 40}ms` }}
											>
												<StaffSurveyCriteriaChart
													category={item.category}
													semester={semester}
												/>
											</div>
										</Tab>
									))}
								</Tabs>
							</div>
						)}

						{activeView === 2 && (
							<div className="flex flex-col gap-10">
								<FilterProvider>
									<ChartLayout
										primaryTitle="Điểm đánh giá theo đơn vị"
										secondaryTitle=""
										legends={["Điểm đánh giá"]}
										colors={["sky"]}
										columnNum={unitCategories.length}
										columnSize={150}
										isFullWidth={false}
										height={580}
										handlerButtons={<></>}
										exportData={unitChartData}
										exportColumns={[
											{ key: "name", label: "Đơn vị" },
											{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
											{
												key: "Điểm trung bình",
												label: "Điểm trung bình",
											},
										]}
									>
										<ComboChart
											data={unitChartData}
											index="name"
											enableBiaxial={false}
											showLegend={false}
											interval={0}
											tickGap={0}
											xAxisTickAngle={10}
											barSeries={{
												categories: ["Điểm đánh giá"],
												yAxisLabel: "",
												colors: ["sky"],
												minValue: 1,
												maxValue: 4,
												yAxisWidth: 60,
												valueFormatter: (number: number) =>
													number.toFixed(2),
											}}
											lineSeries={{
												categories: ["Điểm trung bình"],
												showYAxis: true,
												yAxisLabel: "",
												colors: ["pink"],
												minValue: 1,
												maxValue: 4,
												valueFormatter: (number: number) =>
													number.toFixed(2),
											}}
										/>
									</ChartLayout>
								</FilterProvider>

								<div className="flex flex-col gap-4">
									<h3 className="font-bold text-xl text-gray-800 ml-2">
										Chi tiết từng đơn vị
									</h3>
									<Tabs
										aria-label="Unit Categories"
										color="primary"
										variant="underlined"
										classNames={{
											tabList:
												"max-w-full overflow-x-auto flex-nowrap custom-scrollbar pb-2",
											cursor: "w-full bg-primary",
											tab: "max-w-fit px-4 h-12",
											tabContent:
												"group-data-[selected=true]:text-primary font-semibold",
										}}
									>
										{unitCategories.map((item) => (
											<Tab key={item.category} title={item.category}>
												<div className="mt-2">
													<StaffSurveyCriteriaChart
														category={"ĐƠN VỊ"}
														displayName={item.category}
														semester={semester}
														hideChart={true}
														hideTitle={true}
													/>
												</div>
											</Tab>
										))}
									</Tabs>
								</div>
							</div>
						)}

						{activeView === 3 && (
							<div className="mt-2">
								<StaffSurveyAllCommentsPage semester={semester} />
							</div>
						)}
					</CardBody>
				</Card>
			</div>
		);
	};

	return (
		<div className="pb-20 pt-4">
			{/* BREADCRUMBS */}
			<div className="mb-8">
				<Breadcrumbs
					variant="light"
					size="sm"
					classNames={{
						list: "bg-white dark:bg-zinc-800/50 p-2 px-4 rounded-xl shadow-sm border border-divider/50",
					}}
				>
					<BreadcrumbItem onPress={() => router.push("/staff-survey")}>
						Khảo sát giảng viên
					</BreadcrumbItem>
					<BreadcrumbItem className="font-bold text-primary">
						Báo cáo chi tiết năm {semester}
					</BreadcrumbItem>
				</Breadcrumbs>
			</div>

			{/* PAGE HEADER */}
			<div className="page-header flex flex-col justify-start !items-start gap-4 mb-10">
				<Button
					variant="flat"
					color="primary"
					size="sm"
					onPress={() => router.push("/staff-survey")}
					startContent={<IoArrowBackOutline size={18} />}
					className="font-bold rounded-xl"
				>
					Quay lại
				</Button>
				<h1 className="page-title !text-3xl">
					Báo cáo chi tiết năm {semester}
				</h1>
			</div>

			{loading ? (
				<div className="h-[50vh] flex items-center justify-center">
					<Spinner
						size="lg"
						color="primary"
						label="Đang tải báo cáo..."
						className="font-semibold"
					/>
				</div>
			) : (
				<div className="flex flex-col gap-10">
					{/* TOP CHART SECTION */}
					<div className="transition-all animate-in fade-in duration-700">
						<FilterProvider>
							<ChartLayout
								primaryTitle="Điểm đánh giá giảng viên theo danh mục"
								secondaryTitle={""}
								legends={["Điểm đánh giá"]}
								colors={["sky"]}
								columnNum={categories.length}
								columnSize={150}
								isFullWidth={false}
								height={520}
								handlerButtons={<></>}
								exportData={topChartData}
								exportColumns={[
									{ key: "name", label: "Danh mục" },
									{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
									{ key: "Điểm trung bình", label: "Điểm trung bình" },
								]}
								filterDisplay={[{ label: "Học kỳ", value: semester }]}
							>
								<ComboChart
									data={topChartData}
									index="name"
									enableBiaxial={false}
									showLegend={false}
									interval={0}
									tickGap={0}
									xAxisTickAngle={10}
									barSeries={{
										categories: ["Điểm đánh giá"],
										yAxisLabel: "",
										colors: ["sky"],
										minValue: 1,
										maxValue: 4,
										yAxisWidth: 60,
										valueFormatter: (number: number) =>
											number.toFixed(2),
									}}
									lineSeries={{
										categories: ["Điểm trung bình"],
										showYAxis: true,
										yAxisLabel: "",
										colors: ["pink"],
										minValue: 1,
										maxValue: 4,
										valueFormatter: (number: number) =>
											number.toFixed(2),
									}}
								/>
							</ChartLayout>
						</FilterProvider>
					</div>

					{/* CONTENT AREA */}
					<div className="w-full min-h-[400px]">
						{!activeView ? (
							<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
								<h3 className="font-bold text-xl text-gray-800 ml-2 uppercase tracking-wide opacity-70">
									Nội dung báo cáo
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{menuItems.map((item, idx) => (
										<Card
											key={item.id}
											isPressable
											onPress={() => setActiveView(item.id)}
											className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-zinc-900 border border-transparent hover:border-primary/20"
											style={{ animationDelay: `${idx * 100}ms` }}
										>
											<CardBody className="py-10 px-8 flex flex-col items-start gap-5">
												<div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
													<div className="text-2xl font-bold">
														{item.id}
													</div>
												</div>
												<div className="flex flex-col gap-2">
													<p className="text-xl font-bold text-black dark:text-white leading-tight lg:min-h-[3.5rem] flex items-center">
														{item.title}
													</p>
													<p className="text-sm text-default-500 dark:text-default-400 line-clamp-2">
														{item.description}
													</p>
												</div>
												<div className="mt-4 flex items-center text-primary font-bold text-sm gap-2 opacity-100 transition-opacity duration-300">
													Xem chi tiết
													<IoChevronForwardOutline className="text-xl group-hover:translate-x-1 transition-transform" />
												</div>
											</CardBody>
										</Card>
									))}
								</div>
							</div>
						) : (
							renderDetailView()
						)}
					</div>
				</div>
			)}
		</div>
	);
}
