"use client";

import { FilterProvider, useFilter } from "@/contexts/FilterContext";
import {
	FilterArgs,
	GroupedPoint,
	usePointsEachSemesterLazyQuery,
} from "@/gql/graphql";
import { AreaChart } from "@tremor/react";
import { ReactNode, useEffect, useState } from "react";
import ChartLayout from "./chart/ChartLayout";
import Loading from "./Loading";
import NoData from "./NoData";
import { useDeepCompareEffect } from "react-use";
import _ from "lodash";

type Props = {
	title?: string | ReactNode;
	legend?: string;
	selectors?: ReactNode;
	query?: FilterArgs;
	overrideQueries?: FilterArgs;
	displayAverage?: boolean;
};

function InnerPointEachSemester({
	title = "Điểm trung bình qua các học kỳ",
	legend = "Điểm",
	selectors = <></>,
	query = {},
	overrideQueries = {},
	displayAverage = true,
}: Props) {
	const filter = useFilter();

	const [data, setData] = useState<(GroupedPoint & { all_average: number })[]>([]);
	const [loading, setLoading] = useState(false);

	const variables: FilterArgs & { groupEntity: string } = {
		criteria_id: filter.criteria?.criteria_id,
		faculty_id: filter.faculty?.faculty_id,
		semester_id: filter.semester?.semester_id,
		subjects: Array.from(filter.subjects.values()).length
			? Array.from(filter.subjects.values()).map(
				(subject) => subject.subject_id
			)
			: undefined,
		program: filter.program,
		groupEntity: "Semester",
	};

	const [fetchFunction] = usePointsEachSemesterLazyQuery();

	const filterDisplay = [
		{ label: 'Tiêu chí', value: filter.criteria?.display_name },
		{ label: 'Học kỳ', value: filter.semester?.display_name },
		{ label: 'Khoa/Bộ môn', value: filter.faculty?.display_name },
		{ label: 'Môn học', value: filter.subjects ? Array.from(filter.subjects.values()).map?.(d => d.display_name).join(", ") : "" },
		{ label: 'Chương trình', value: filter.program },
	].filter(d => d.value);

	useDeepCompareEffect(() => {
		let isAbort = false;

		(async () => {
			setLoading(true);

			const response = await fetchFunction({
				variables: {
					...query,
					...Object.fromEntries(
						Object.entries(variables).filter(([key, value]) => value)
					),
					...overrideQueries,
					groupEntity: "Semester",
				},
				fetchPolicy: "network-only",
			});
			const currentData = response.data?.groupedPoints.data || [];
			const averageResponse = await fetchFunction({
				variables: {
					groupEntity: "Semester",
				},
				fetchPolicy: "no-cache",
			});
			const averageData = averageResponse.data?.groupedPoints.data;
			const newData = currentData.map((data) => ({
				...data,
				all_average:
					averageData?.find((d) => d.id === data.id)?.average_point || 0,
			}));
			if (isAbort) return;
			setData(newData);
			setLoading(false);
		})();

		return () => {
			isAbort = true;
		};
	}, [query, overrideQueries, variables]);

	const chartData = loading
		? []
		: [...data]
			.sort((a, b) => {
				const [semesterA, yearA] = a.display_name?.split(", ") || [0, 0];
				const [semesterB, yearB] = b.display_name?.split(", ") || [0, 0];
				if (yearA == yearB) {
					return (
						parseInt(semesterA.toString().at(-1) || "", 10) -
						parseInt(semesterB.toString().at(-1) || "", 10)
					);
				} else {
					return (
						parseInt(yearA.toString(), 10) -
						parseInt(yearB.toString(), 10)
					);
				}
			})
			.map((point) => ({
				Điểm: point.average_point * 4,
				"Trung bình toàn trường": point.all_average * 4,
				semester_name: point.display_name,
			})) || [];

	return (
		<div className=" h-[400px] lg:h-[600px]">
			<ChartLayout
				primaryTitle={title}
				secondaryTitle={""}
				legends={[legend]}
				colors={["sky"]}
				isFullWidth
				handlerButtons={selectors}
				exportData={chartData}
				exportColumns={[
					{ key: "semester_name", label: "Học kỳ" },
					{ key: "Điểm", label: "Điểm" },
					{ key: "Trung bình toàn trường", label: "Trung bình toàn trường" },
				]}
				filterDisplay={filterDisplay}
			>
				<AreaChart
					className=" h-full"
					data={chartData}
					index="semester_name"
					categories={
						displayAverage
							? ["Điểm", "Trung bình toàn trường"]
							: ["Điểm"]
					}
					colors={["sky", "purple"]}
					yAxisWidth={50}
					minValue={1}
					maxValue={4}
					xAxisLabel="Học kỳ"
					yAxisLabel="Điểm"
					showAnimation
					rotateLabelX={{
						angle: 0,
						verticalShift: 10,
						xAxisHeight: 40,
					}}
					margin={{ bottom: 50 }}
					valueFormatter={(number: number) => {
						return `${number.toFixed(2)}`;
					}}
					showLegend
					//@ts-ignore
					noDataText={loading ? <Loading /> : <NoData />}
				/>
			</ChartLayout>
		</div>
	);
}

export default function PointEachSemester({
	title,
	legend,
	selectors,
	query,
	overrideQueries,
}: Props) {
	return (
		<FilterProvider>
			<InnerPointEachSemester
				title={title}
				legend={legend}
				selectors={selectors}
				query={query}
				overrideQueries={overrideQueries}
			/>
		</FilterProvider>
	);
}
