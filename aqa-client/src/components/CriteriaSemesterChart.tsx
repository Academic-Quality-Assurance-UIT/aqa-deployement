"use client";

import { useCriteriaSemesterStatsQuery, useGetSettingQuery } from "@/gql/graphql";
import { BarChart, Text } from "@tremor/react";
import Loading from "./Loading";
import NoData from "./NoData";
import ChartLayout from "./chart/ChartLayout";

export default function CriteriaSemesterChart() {
	const { data, loading, error } = useCriteriaSemesterStatsQuery();
	const { data: settingData } = useGetSettingQuery({
		variables: { key: "filter_year" },
	});

	if (loading) return <Loading />;
	if (error) return <Text>Error loading chart: {error.message}</Text>;

	const rawData = data?.criteriaSemesterStats || [];
	const filterYear = parseInt(settingData?.getSetting?.value || "0", 10);

	const sortedData = [...rawData].sort((a, b) => {
		const [, yearA] = a.semester?.split(", ") || ["", ""];
		const [, yearB] = b.semester?.split(", ") || ["", ""];
		const semesterA = a.semester?.split(", ")[0] || "";
		const semesterB = b.semester?.split(", ")[0] || "";

		if (yearA === yearB) {
			return (
				parseInt(semesterA.at(-1) || "0", 10) -
				parseInt(semesterB.at(-1) || "0", 10)
			);
		}
		return parseInt(yearA || "0", 10) - parseInt(yearB || "0", 10);
	});

	let filteredData = sortedData;
	if (filterYear > 0 && sortedData.length > 0) {
		const maxYear = sortedData.reduce((max, item) => {
			const year = parseInt(item.semester?.split(", ")[1] || "0", 10);
			return year > max ? year : max;
		}, 0);

		if (maxYear > 0) {
			filteredData = sortedData.filter((item) => {
				const year = parseInt(item.semester?.split(", ")[1] || "0", 10);
				return year >= maxYear - filterYear + 1;
			});
		}
	}

	const chartData = filteredData.map((item) => ({
		semester: item.semester,
		"Lý thuyết": item.lt,
		"Hình thức 1": item.ht1,
		"Hình thức 2": item.ht2,
	}));

	if (chartData.length === 0) return <NoData />;

	return (
		<div className="h-[450px] mt-6">
			<ChartLayout
				primaryTitle="Số lượng tiêu chí theo loại hình qua các học kỳ"
				secondaryTitle="Thống kê số lượng tiêu chí khảo sát riêng biệt cho từng loại hình lớp học"
				legends={["Lý thuyết", "Hình thức 1", "Hình thức 2"]}
				colors={["blue", "emerald", "amber"]}
				isFullWidth
				handlerButtons={<></>}
				exportData={chartData}
				exportColumns={[
					{ key: "semester", label: "Học kỳ" },
					{ key: "Lý thuyết", label: "Lý thuyết" },
					{ key: "Hình thức 1", label: "Hình thức 1" },
					{ key: "Hình thức 2", label: "Hình thức 2" },
				]}
			>
				<BarChart
					className="mt-6 h-full"
					data={chartData}
					index="semester"
					categories={["Lý thuyết", "Hình thức 1", "Hình thức 2"]}
					colors={["sky", "emerald", "indigo"]}
					yAxisWidth={48}
					showAnimation
					showLegend
				/>
			</ChartLayout>
		</div>
	);
}
