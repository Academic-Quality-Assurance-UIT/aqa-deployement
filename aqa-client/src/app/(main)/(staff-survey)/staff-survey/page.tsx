"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import { ComboChart } from "@/components/ComboChart";
import StaffSurveySemesterSelector from "@/components/selectors/StaffSurveySemesterSelector";
import { FilterProvider } from "@/contexts/FilterContext";
import {
	useGetStaffSurveyPointsByCategoryAndYearQuery,
	useGetPointsByCategoryQuery,
	useGetStaffSurveyPointsByYearQuery,
	useGetSurveySemesterListQuery,
} from "@/gql/graphql";
import {
	Button,
	Card,
	CardBody,
} from "@heroui/react";
import { Color, LineChart } from "@tremor/react";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";

const COLORS: Color[] = [
	"sky",
	"cyan",
	"indigo",
	"orange",
	"violet",
	"teal",
	"lime",
	"fuchsia",
	"emerald",
	"green",
	"red",
	"stone",
	"yellow",
];

export default function Page() {
	const [semester, setSemester] = useState<string | undefined>(undefined);
	const [showUnit, setShowUnit] = useState<boolean>(false);
	const router = useRouter();

	// Query for 1st chart (Semester filtered)
	const { data: points } = useGetPointsByCategoryQuery({
		variables: { semester, showUnit },
		fetchPolicy: "network-only",
	});

	// Query for 2nd chart (Year trends)
	const { data: pointsByYear } = useGetStaffSurveyPointsByYearQuery({
		fetchPolicy: "network-only",
	});

	// Query for 3rd chart (Category/Year trends)
	const { data: pointsByCategoryAndYear } = useGetStaffSurveyPointsByCategoryAndYearQuery({
		fetchPolicy: "network-only",
	});

	// Query for Semester List
	const { data: semesterListData } = useGetSurveySemesterListQuery();

	const currentSemesterTrueAvg = useMemo(() => {
		if (semester) {
			const found = pointsByYear?.getStaffSurveyPointsByYear.find(
				(y) => y.year === semester
			);
			if (found) return found.avg_point;
		}
		// Fallback for "All semesters"
		return (
			_.mean(
				(pointsByYear?.getStaffSurveyPointsByYear ?? []).map(
					(p) => p.avg_point
				)
			) || 0
		);
	}, [semester, pointsByYear]);

	const chartData = useMemo(() => {
		return (points?.getPointsByCategory ?? []).map((point) => ({
			"Điểm đánh giá": point.avg_point,
			"Điểm trung bình": currentSemesterTrueAvg,
			name: point.category,
			isUnit: point.is_unit,
			// Use a different color for Unit bars if it's a unit
			color: point.is_unit ? "emerald" : "sky",
		}));
	}, [points, currentSemesterTrueAvg]);

	const lineChartData = (pointsByYear?.getStaffSurveyPointsByYear ?? []).map((item) => ({
		name: item.year,
		"Điểm trung bình": item.avg_point,
	})).sort((a, b) => a.name.localeCompare(b.name));

	const categoryYearChartData = useMemo(() => {
		const raw = pointsByCategoryAndYear?.getStaffSurveyPointsByCategoryAndYear ?? [];
		const years = Array.from(new Set(raw.map((d) => d.year))).sort();
		return years.map((year) => {
			const row: any = { name: year };
			raw.filter((d) => d.year === year).forEach((d) => {
				row[d.category] = d.avg_point;
			});
			return row;
		});
	}, [pointsByCategoryAndYear]);

	const categories = Array.from(
		new Set(
			(pointsByCategoryAndYear?.getStaffSurveyPointsByCategoryAndYear ?? []).map(
				(d) => d.category
			)
		)
	);

	const handleSemesterClick = (sem: string) => {
		router.push(`/staff-survey/semester/${encodeURIComponent(sem)}`);
	};

	return (
		<div className="pb-20">
			<div className="page-header">
				<h1 className="page-title leading-tight">Điểm khảo sát giảng viên</h1>
				<div className="flex gap-3 flex-wrap">
					<Link href="/staff-survey-add">
						<Button color="primary" variant="flat">
							<p className="font-bold">Thêm dữ liệu mới</p>
						</Button>
					</Link>
					<Link href="/staff-survey-upload">
						<Button color="primary" variant="flat">
							<p className="font-bold">Tải dữ liệu lên</p>
						</Button>
					</Link>
				</div>
			</div>

			<div className=" mt-8 flex flex-col gap-10">
				{/* 1. CHART BY CATEGORY */}
				<FilterProvider>
					<ChartLayout
						primaryTitle="Điểm đánh giá giảng viên theo danh mục"
						secondaryTitle={""}
						legends={["Điểm đánh giá"]}
						colors={["sky"]}
						columnNum={points?.getPointsByCategory.length || 0}
						columnSize={150}
						isFullWidth={false}
						handlerButtons={
							<div className="flex gap-4 items-center">
								<Button
									variant="light"
									color={showUnit ? "primary" : "default"}
									onPress={() => setShowUnit(!showUnit)}
									className="group px-2 min-w-0 h-10 transition-all hover:bg-primary-50 rounded-lg flex gap-2"
								>
									<div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${showUnit ? "bg-primary border-primary" : "border-gray-300 bg-white"}`}>
										{showUnit && (
											<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
										)}
									</div>
									<span className={`text-sm ${showUnit ? "text-primary" : "text-gray-500"}`}>
										Hiển thị các đơn vị
									</span>
								</Button>
								<div className="h-6 w-[1px] bg-gray-200"></div>
								<StaffSurveySemesterSelector
									semester={semester}
									setSemester={setSemester}
								/>
							</div>
						}
						exportData={chartData}
						exportColumns={[
							{ key: "name", label: "Danh mục" },
							{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
							{ key: "Điểm trung bình", label: "Điểm trung bình" },
						]}
						filterDisplay={semester ? [{ label: "Học kỳ", value: semester }] : []}
					>
						<ComboChart
							data={chartData}
							index="name"
							enableBiaxial={false}
							showLegend={false}
							barSeries={{
								categories: ["Điểm đánh giá"],
								yAxisLabel: "",
								colors: chartData.map(d => d.color as any),
								minValue: 1,
								maxValue: 4,
								yAxisWidth: 60,
								valueFormatter: (number: number) => {
									return `${number.toFixed(2)}`;
								},
							}}
							lineSeries={{
								categories: ["Điểm trung bình"],
								showYAxis: true,
								yAxisLabel: "",
								colors: ["pink"],
								minValue: 1,
								maxValue: 4,
								valueFormatter: (number: number) => {
									return `${number.toFixed(2)}`;
								},
							}}
						/>
					</ChartLayout>
				</FilterProvider>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
					{/* 2. POINT BY YEAR CHART */}
					<ChartLayout
						primaryTitle="Điểm khảo sát theo năm (Xu hướng)"
						secondaryTitle=""
						legends={["Điểm trung bình"]}
						colors={["sky"]}
						columnNum={lineChartData.length}
						columnSize={100}
						isFullWidth={true}
						handlerButtons={<></>}
						exportData={lineChartData}
						exportColumns={[
							{ key: "name", label: "Năm" },
							{ key: "Điểm trung bình", label: "Điểm TB" },
						]}
					>
						<div className="h-[400px]">
							<LineChart
								className="h-full mt-4"
								data={lineChartData}
								index="name"
								categories={["Điểm trung bình"]}
								colors={["sky"]}
								yAxisWidth={60}
								minValue={1}
								maxValue={4}
								valueFormatter={(number: number) => `${number.toFixed(2)}`}
								showLegend={false}
								showAnimation
							/>
						</div>
					</ChartLayout>

					{/* 3. POINT BY CATEGORY & YEAR CHART */}
					<ChartLayout
						primaryTitle="Điểm theo danh mục qua các năm"
						secondaryTitle=""
						legends={categories}
						colors={COLORS}
						columnNum={categoryYearChartData.length}
						columnSize={100}
						isFullWidth={true}
						handlerButtons={<></>}
						exportData={categoryYearChartData}
						exportColumns={[
							{ key: "name", label: "Năm" },
							...categories.map((c) => ({ key: c, label: c })),
						]}
					>
						<div className="h-[400px]">
							<LineChart
								className="h-full mt-4"
								data={categoryYearChartData}
								index="name"
								categories={categories}
								colors={COLORS}
								yAxisWidth={60}
								minValue={1}
								maxValue={4}
								valueFormatter={(number: number) => `${number.toFixed(2)}`}
								showLegend={true}
								showAnimation
							/>
						</div>
					</ChartLayout>
				</div>

				<div className="mt-10">
					<h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">
						Danh sách học kỳ khảo sát
					</h2>
					<div className="flex flex-col gap-3">
						{(semesterListData?.getSurveySemesterList ?? []).map((sem) => (
							<Card
								key={sem}
								isPressable
								onPress={() => handleSemesterClick(sem)}
								className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] bg-default-50"
							>
								<CardBody className="py-4 px-6 flex flex-row items-center justify-between bg-white">
									<div className="flex flex-col">
										<p className="text-xs text-default-500 font-medium uppercase tracking-wider">Năm khảo sát</p>
										<p className="text-lg font-bold text-black">{sem}</p>
									</div>
									<IoChevronForwardOutline className="text-default-400 text-xl" />
								</CardBody>
							</Card>
						))}
					</div>
				</div>
			</div>

		</div>
	);
}
