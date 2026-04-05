import { FilterProvider } from "@/contexts/FilterContext";
import ChartLayout from "./ChartLayout";
import { useGetPointsByCriteriaQuery, useGetStaffSurveyCommentCountQuery } from "@/gql/graphql";
import { ComboChart } from "../ComboChart";
import _ from "lodash";
import StaffSurveyCommentPage from "../comments/StaffSurveyCommentPage";

export default function StaffSurveyCriteriaChart({
	category,
	semester,
	hideChart = false,
	displayName,
	hideTitle = false,
}: {
	category: string;
	semester?: string;
	hideChart?: boolean;
	displayName?: string;
	hideTitle?: boolean;
}) {
	const { data: points, loading: isLoading } = useGetPointsByCriteriaQuery({
		variables: {
			category,
			semester,
		},
		fetchPolicy: "network-only",
	});

	const { data: commentCountData } = useGetStaffSurveyCommentCountQuery({
		variables: {
			category,
			semester,
			displayName,
		},
		fetchPolicy: "network-only",
	});

	const chartData = (points?.getPointsByCriteria ?? []).map((point) => ({
		"Điểm đánh giá": point.avg_point,
		"Điểm trung bình":
			_.mean(points?.getPointsByCriteria.map((p) => p.avg_point)) || 0,
		name: `${point.index + 1}. ${point.criteria}`,
	}));

	if (hideChart) {
		return (
			<div className=" mt-4 px-0">
				{!hideTitle && (
					<div className="flex justify-between items-center mb-6">
						<h2 className=" font-bold text-2xl text-gray-800 tracking-tight">
							Danh sách ý kiến
						</h2>
						{commentCountData?.getStaffSurveyCommentCount !==
							undefined && (
							<div className="px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200 shadow-sm">
								<span className="text-sm font-bold text-gray-500">
									Tổng cộng:{" "}
									{commentCountData.getStaffSurveyCommentCount}
								</span>
							</div>
						)}
					</div>
				)}
				<div className={hideTitle ? "mt-0" : "mt-4"}>
					<StaffSurveyCommentPage
						category={category}
						semester={semester}
						displayName={displayName}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className=" flex flex-col gap-4">
			<FilterProvider>
				<ChartLayout
					primaryTitle="Điểm đánh giá giảng viên theo tiêu chí"
					secondaryTitle={""}
					legends={["Điểm đánh giá"]}
					colors={["sky"]}
					columnNum={points?.getPointsByCriteria.length || 0}
					columnSize={100}
					isFullWidth
					handlerButtons={<></>}
					exportData={chartData}
					exportColumns={[
						{ key: "name", label: "Tiêu chí" },
						{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
						{ key: "Điểm trung bình", label: "Điểm trung bình" },
					]}
					filterDisplay={[
						{ label: "Danh mục", value: category },
						...(semester ? [{ label: "Học kỳ", value: semester }] : []),
					]}
				>
					<ComboChart
						data={chartData}
						index="name"
						enableBiaxial={false}
						showLegend={false}
						xAxisLabel="Tiêu chí"
						barSeries={{
							categories: ["Điểm đánh giá"],
							yAxisLabel: "Điểm",
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
							yAxisLabel: "Điểm",
							colors: ["pink"],
							minValue: 1,
							maxValue: 4,
							valueFormatter: (number: number) => {
								return `${number.toFixed(2)}`;
							},
						}}
					/>
					<div className=" mt-12 px-8">
						{!hideTitle && (
							<div className="flex justify-between items-center mb-4">
								<h2 className=" font-semibold text-xl">
									Danh sách ý kiến
								</h2>
								{commentCountData?.getStaffSurveyCommentCount !==
									undefined && (
									<div className="px-3 py-1 bg-gray-100 rounded-full">
										<span className="text-sm font-semibold text-gray-500">
											Tổng cộng:{" "}
											{
												commentCountData.getStaffSurveyCommentCount
											}
										</span>
									</div>
								)}
							</div>
						)}
						<div className={hideTitle ? "mt-0" : "mt-8"}>
							<StaffSurveyCommentPage
								category={category}
								semester={semester}
								displayName={displayName}
							/>
						</div>
					</div>
				</ChartLayout>
			</FilterProvider>
		</div>
	);
}

