"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import StaffSurveyCriteriaChart from "@/components/chart/StaffSurveyCriteriaChart";
import { ComboChart } from "@/components/ComboChart";
import StaffSurveySemesterSelector from "@/components/selectors/StaffSurveySemesterSelector";
import { FilterProvider } from "@/contexts/FilterContext";
import { useGetPointsByCategoryDonViQuery } from "@/gql/graphql";
import { Button, Tab, Tabs } from "@heroui/react";
import _ from "lodash";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
	const [semester, setSemester] = useState<string | undefined>(undefined);

	const { data: unitPoints } = useGetPointsByCategoryDonViQuery({
		variables: { semester },
		fetchPolicy: "network-only",
	});

	const unitChartData = (unitPoints?.getPointsByCategoryDonVi ?? []).map((point) => ({
		"Điểm đánh giá": point.avg_point,
		"Điểm trung bình":
			_.mean(unitPoints?.getPointsByCategoryDonVi.map((p) => p.avg_point)) || 0,
		name: point.category,
	}));

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">Điểm đánh giá các khoa/ bộ môn</h1>
				<div className="flex gap-3">
					<StaffSurveySemesterSelector
						semester={semester}
						setSemester={setSemester}
					/>
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

			<div className=" mt-8 flex flex-col gap-4">
				<FilterProvider>
					<ChartLayout
						primaryTitle="Điểm đánh giá theo đơn vị"
						secondaryTitle={""}
						legends={["Điểm đánh giá"]}
						colors={["sky"]}
						columnNum={unitPoints?.getPointsByCategoryDonVi.length || 0}
						columnSize={150}
						isFullWidth={false}
						handlerButtons={<></>}
						exportData={unitChartData}
						exportColumns={[
							{ key: "name", label: "Đơn vị" },
							{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
							{ key: "Điểm trung bình", label: "Điểm trung bình" },
						]}
						filterDisplay={semester ? [{ label: "Học kỳ", value: semester }] : []}
					>
						<ComboChart
							data={unitChartData}
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

				<Tabs
					aria-label="Unit tabs"
					className=" mt-10"
					classNames={{
						tabList: "max-w-full overflow-x-auto flex-nowrap custom-scrollbar pb-2",
					}}
				>
					{(unitPoints?.getPointsByCategoryDonVi ?? []).map((item) => (
						<Tab key={item.category} title={item.category}>
							<div className=" mt-10">
								<StaffSurveyCriteriaChart
									category={"ĐƠN VỊ"}
									displayName={item.category}
									semester={semester}
									hideChart={true}
								/>
							</div>
						</Tab>
					))}
				</Tabs>
			</div>
		</div>
	);
}
