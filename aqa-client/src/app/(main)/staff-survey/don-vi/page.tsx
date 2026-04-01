"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import StaffSurveyCriteriaChart from "@/components/chart/StaffSurveyCriteriaChart";
import { ComboChart } from "@/components/ComboChart";
import StaffSurveySemesterSelector from "@/components/selectors/StaffSurveySemesterSelector";
import StaffSurveyAdditionalCommentPage from "@/components/comments/StaffSurveyAdditionalCommentPage";
import { FilterProvider } from "@/contexts/FilterContext";
import {
	useGetPointsByCategoryDonViQuery,
} from "@/gql/graphql";
import { Button, Tab, Tabs } from "@heroui/react";
import _ from "lodash";
import Link from "next/link";
import { useState } from "react";

export default function DonViPage() {
	const [semester, setSemester] = useState<string | undefined>(undefined);

	const { data: points, loading: isLoading } = useGetPointsByCategoryDonViQuery({
		variables: { semester },
		fetchPolicy: "network-only",
	});

	const chartData = (points?.getPointsByCategoryDonVi ?? []).map((point) => ({
		"Điểm đánh giá": point.avg_point,
		"Điểm trung bình":
			_.mean(points?.getPointsByCategoryDonVi.map((p) => p.avg_point)) || 0,
		name: point.category,
	}));

	return (
		<div>
			<div className=" flex items-center justify-between mb-8">
				<h1 className="page-title mb-8">Điểm đánh giá các khoa/bộ môn (Đơn vị)</h1>
				<div className="flex gap-4">
					<StaffSurveySemesterSelector
						semester={semester}
						setSemester={setSemester}
					/>
					<Link href="/staff-survey">
						<Button>
							<p className=" font-semibold">Quay lại</p>
						</Button>
					</Link>
				</div>
			</div>

			<div className=" flex flex-col gap-4">
				<FilterProvider>
					<ChartLayout
						primaryTitle="Điểm đánh giá theo đơn vị"
						secondaryTitle={""}
						legends={["Điểm đánh giá"]}
						colors={["sky"]}
						columnNum={points?.getPointsByCategoryDonVi.length || 0}
						columnSize={150}
						isFullWidth={false}
						handlerButtons={<></>}
						exportData={chartData}
						exportColumns={[
							{ key: "name", label: "Đơn vị" },
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
								colors: ["sky"],
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
			</div>
			<Tabs
				aria-label="Don vi tabs"
				className=" mt-10"
				classNames={{
					tabList: "max-w-full overflow-x-auto flex-nowrap",
				}}
			>
				{(points?.getPointsByCategoryDonVi ?? []).map((item) => (
					<Tab key={item.category} title={item.category}>
						<div className=" mt-10">
							<StaffSurveyCriteriaChart
								category={item.category}
								semester={semester}
							/>
						</div>
					</Tab>
				))}
			</Tabs>
		</div>
	);
}
