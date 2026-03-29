"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import { FilterProvider, useFilter } from "@/contexts/FilterContext";
import _ from "lodash";
import {
	FilterArgs,
	GroupedPoint,
	Role,
	usePointsWithGroupByLazyQuery,
	useProfileQuery,
} from "@/gql/graphql";
import Loading from "@components/Loading";
import NoData from "@components/NoData";
import { BarChart } from "@tremor/react";
import { ReactNode, use, useEffect, useState } from "react";
import { ComboChart } from "../ComboChart";
import { Select, SelectItem, Tab, Tabs } from "@heroui/react";
import HistogramChart from "./HistogramChart";
import { hashAndShorten } from "@/utils/lecturerIdHash";
import { useMediaQuery } from "react-responsive";

type Props = {
	title: string;
	groupEntity: string;
	legend?: string;
	selectors?: ReactNode;
	query?: FilterArgs;
	xTitle?: string;
	averageTitle?: string;
	medianTitle?: string;
	isShowedName?: boolean;
	onClick?: (item: GroupedPoint) => any;
};

type AggregationType = "average_point" | "median_point" | "trimmed_mean_point";
type TabType = "list" | "histogram";

function InnerPointWithGroupedEntity({
	title,
	legend = "Điểm",
	selectors = <></>,
	query = {},
	xTitle = "Điểm",
	averageTitle = "Trung bình",
	medianTitle = "Trung vị",
	groupEntity,
	isShowedName = true,
	onClick = () => { },
}: Props) {
	const filter = useFilter();

	const isMobile = useMediaQuery({ maxWidth: 1024 });

	const [data, setData] = useState<GroupedPoint[]>([]);
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState<TabType>("list");
	const [aggregationField, setAggregationField] =
		useState<AggregationType>("average_point");

	const { data: profile } = useProfileQuery();

	const variables: FilterArgs & { groupEntity: string } = {
		criteria_id: filter.criteria?.criteria_id,
		faculty_id:
			profile?.profile.role === Role.Faculty
				? profile.profile.faculty?.faculty_id
				: filter.faculty?.faculty_id,
		semester_id: filter.semester?.semester_id,
		subjects: Array.from(filter.subjects.values()).length
			? Array.from(filter.subjects.values()).map(
				(subject) => subject.subject_id
			)
			: undefined,
		program: filter.program,
		groupEntity: "Semester",
	};

	const [fetchFunction] = usePointsWithGroupByLazyQuery();

	const filterDisplay = [
		{ label: 'Tiêu chí', value: filter.criteria?.display_name },
		{ label: 'Học kỳ', value: filter.semester?.display_name },
		{ label: 'Khoa/Bộ môn', value: filter.faculty?.display_name },
		{ label: 'Môn học', value: filter.subjects ? Array.from(filter.subjects.values()).map?.(d => d.display_name).join(", ") : "" },
		{ label: 'Chương trình', value: filter.program },
	].filter(d => d.value);

	useEffect(() => {
		(async () => {
			if (!profile) return;
			setLoading(true);
			const response = await fetchFunction({
				variables: {
					...query,
					...Object.fromEntries(
						Object.entries(variables).filter(([key, value]) => !!value)
					),
					[`${groupEntity.toLowerCase()}_id`]: undefined,
					groupEntity: groupEntity,
				},
				fetchPolicy: "network-only",
			});
			setData(response.data?.groupedPoints.data || []);
			setLoading(false);
		})();
	}, [JSON.stringify(query), JSON.stringify(variables), profile]);

	const averagePoint =
		data.reduce((total, value) => (total += (value[aggregationField] ?? 0) * 4), 0) /
		data.length;

	const chartData =
		[...data]
			.sort((a, b) => (b[aggregationField] ?? 0) - (a[aggregationField] ?? 0))
			.map((point) => ({
				[xTitle]: (point[aggregationField] ?? 0) * 4,
				[averageTitle]: averagePoint,
				name: isShowedName ? point.display_name : `Giảng viên ${point.id}`,
			})) || [];
	const histogramData = chartData.map((item) => ({ point: item[xTitle] as number }));

	return (
		<div className="">
			<ChartLayout
				primaryTitle={title}
				secondaryTitle={""}
				legends={[legend]}
				colors={["sky"]}
				columnNum={data.length || 0}
				columnSize={100}
				isFullWidth
				handlerButtons={selectors}
				exportData={chartData}
				exportColumns={[
					{ key: "name", label: "Tên" },
					{ key: xTitle, label: xTitle },
					{ key: averageTitle, label: averageTitle },
				]}
				filterDisplay={filterDisplay}
				exportChart={tab == "list" ? null : <HistogramChart rawData={histogramData} isExport />}
			>
				<div className=" px-6 lg:px-6 pb-4 flex flex-col gap-2 justify-start lg:flex-row lg:justify-between lg:items-center">
					<Tabs
						variant="underlined"
						selectedKey={tab}
						onSelectionChange={(value) => setTab(value as TabType)}
					>
						<Tab key="list" title="Danh sách điểm" />
						<Tab key="histogram" title="Biểu đồ Histogram" />
					</Tabs>
					<Select
						className=" pl-4 lg:pl-0 max-w-[200px] lg:max-w-[240px]"
						label="Loại điểm"
						selectedKeys={new Set([aggregationField])}
						onSelectionChange={(value) =>
							setAggregationField(
								(value.currentKey ??
									aggregationField) as AggregationType
							)
						}
						variant="bordered"
						size={isMobile ? "sm" : "md"}
					>
						<SelectItem
							key={"average_point"}
							startContent={
								<div className="w-2 h-2 bg-[#0ea5e9] rounded-full" />
							}
						>
							Điểm trung bình
						</SelectItem>
						<SelectItem
							key={"median_point"}
							startContent={
								<div className="w-2 h-2 bg-[#10b981] rounded-full" />
							}
						>
							Điểm trung vị
						</SelectItem>
						<SelectItem
							key={"trimmed_mean_point"}
							startContent={
								<div className="w-2 h-2 bg-[#fbbf24] rounded-full" />
							}
						>
							Điểm trung bình cắt 5%
						</SelectItem>
					</Select>
				</div>
				{tab == "list" ? (
					<ComboChart
						data={chartData}
						index="name"
						enableBiaxial={false}
						showLegend={false}
						xAxisLabel="Tên"
						barSeries={{
							categories: [xTitle],
							yAxisLabel: "Điểm",
							colors: [
								aggregationField === "average_point"
									? "sky"
									: aggregationField === "median_point"
										? "emerald"
										: "amber",
							],
							minValue: 1,
							maxValue: 4,
							yAxisWidth: 60,
							valueFormatter: (number: number) => {
								return `${number.toFixed(2)}`;
							},
						}}
						lineSeries={{
							categories: [averageTitle],
							showYAxis: true,
							yAxisLabel: "Điểm",
							colors: ["pink"],
							minValue: 1,
							maxValue: 4,
							valueFormatter: (number: number) => {
								return `${number.toFixed(2)}`;
							},
						}}
					/>
				) : histogramData ? (
					<HistogramChart rawData={histogramData} />
				) : null}
			</ChartLayout>
		</div>
	);
}

export default function PointWithGroupedEntity(props: Props) {
	return (
		<FilterProvider>
			<InnerPointWithGroupedEntity {...props} />
		</FilterProvider>
	);
}
