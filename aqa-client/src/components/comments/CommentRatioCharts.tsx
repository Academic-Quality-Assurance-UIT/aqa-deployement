"use client";

import { useCommentStatisticsQuery, FilterArgs } from "@/gql/graphql";
import { useState, useMemo } from "react";
import { Accordion, AccordionItem, Tabs, Tab, Switch, Chip, Select, SelectItem } from "@heroui/react";
import { BarChart, AreaChart, Color } from "@tremor/react";
import ChartLayout from "../chart/ChartLayout";
import Loading from "../Loading";
import NoData from "../NoData";
import { LuChartLine, LuChartBar } from "react-icons/lu";

interface IProps {
	query: FilterArgs;
	type?: string[];
	topic?: string[];
}

const SENTIMENT_LABELS: Record<string, string> = {
	positive: "Tích cực",
	negative: "Tiêu cực",
	neutral: "Trung tính",
};

const TOPIC_LABELS: Record<string, string> = {
	lecturer: "Giảng viên",
	training_program: "Chương trình đào tạo",
	facility: "Cơ sở vật chất",
	others: "Khác",
    Unknown: "Chưa phân loại"
};

const SENTIMENT_COLORS: Record<string, Color> = {
	"Tích cực": "emerald",
	"Tiêu cực": "rose",
	"Trung tính": "amber",
};

const TOPIC_COLORS: Record<string, Color> = {
	"Giảng viên": "emerald",
	"Chương trình đào tạo": "purple",
	"Cơ sở vật chất": "rose",
	"Khác": "amber",
    "Chưa phân loại": "blue"
};

export default function CommentRatioCharts({
	query,
	type = ["all"],
	topic = ["all"],
}: IProps) {
	const [groupBy, setGroupBy] = useState<"semester" | "year">("semester");
	const [chartType, setChartType] = useState<"area" | "bar">("area");
	const [activeTab, setActiveTab] = useState<string>("total");

	const { data, loading } = useCommentStatisticsQuery({
		variables: {
			filter: query,
			groupBy: groupBy,
			type: type,
			topic: topic,
		},
		fetchPolicy: "network-only",
	});

	const processedData = useMemo(() => {
		if (!data?.commentStatistics) return [];

		return data.commentStatistics.map((item) => {
			const sentiments: Record<string, number> = {};
			Object.entries(item.sentiments).forEach(([key, val]) => {
				sentiments[SENTIMENT_LABELS[key] || key] = val as number;
			});

			const topics: Record<string, number> = {};
			Object.entries(item.topics).forEach(([key, val]) => {
				topics[TOPIC_LABELS[key] || key] = val as number;
			});

			return {
				label: item.label,
				"Tổng số ý kiến": item.total,
				...sentiments,
				...topics,
			};
		});
	}, [data]);

	const sentimentCategories = useMemo(() => {
		const cats = new Set<string>();
		data?.commentStatistics.forEach((item) => {
			Object.keys(item.sentiments).forEach((key) => {
				cats.add(SENTIMENT_LABELS[key] || key);
			});
		});
		return Array.from(cats);
	}, [data]);

	const topicCategories = useMemo(() => {
		const cats = new Set<string>();
		data?.commentStatistics.forEach((item) => {
			Object.keys(item.topics).forEach((key) => {
				cats.add(TOPIC_LABELS[key] || key);
			});
		});
		return Array.from(cats);
	}, [data]);

	const chartData = useMemo(() => {
		if (activeTab === "total") return processedData;
		if (chartType === "bar") return processedData;

		// Normalize to percentages for AreaChart
		return processedData.map((item) => {
			const newItem = { ...item } as any;
			const categories = activeTab === "sentiment" ? sentimentCategories : topicCategories;
			const sum = categories.reduce((acc, cat) => acc + (item[cat as keyof typeof item] as number || 0), 0);
			
			if (sum > 0) {
				categories.forEach((cat) => {
					newItem[cat] = ((item[cat as keyof typeof item] as number || 0) / sum) * 100;
				});
			}
			return newItem;
		});
	}, [processedData, activeTab, chartType, sentimentCategories, topicCategories]);

	const chartTitles: Record<string, string> = {
		total: "Tổng số ý kiến theo thời gian",
		sentiment: `Phân loại theo cảm xúc (${chartType === "area" ? "%" : "Số lượng"})`,
		topic: `Phân loại theo khía cạnh (${chartType === "area" ? "%" : "Số lượng"})`,
	};

	const handlerButtons = (
		<div className="flex flex-row gap-6 items-center flex-wrap lg:flex-nowrap">
			<div className="flex items-center gap-3">
				<p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Nhóm theo:</p>
				<Select
					size="sm"
					variant="bordered"
					className="w-40"
					selectedKeys={[groupBy]}
					onChange={(e) => setGroupBy(e.target.value as any)}
					disallowEmptySelection
					classNames={{
						trigger: "h-9 min-h-9 border-default-200 shadow-sm",
						value: "text-sm font-semibold",
					}}
				>
					<SelectItem key="semester" value="semester">Theo học kỳ</SelectItem>
					<SelectItem key="year" value="year">Theo năm học</SelectItem>
				</Select>
			</div>

			{activeTab !== "total" && (
				<div className="flex items-center gap-3 lg:border-l lg:pl-6 border-gray-200">
					<p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Dạng biểu đồ:</p>
					<Select
						size="sm"
						variant="bordered"
						className="w-40"
						selectedKeys={[chartType]}
						onChange={(e) => setChartType(e.target.value as any)}
						disallowEmptySelection
						classNames={{
							trigger: "h-9 min-h-9 border-default-200 shadow-sm",
							value: "text-sm font-semibold",
						}}
					>
						<SelectItem key="area" textValue="Tỉ lệ (%)" startContent={<LuChartLine size={16} />}>
							Tỉ lệ (%)
						</SelectItem>
						<SelectItem key="bar" textValue="Số lượng" startContent={<LuChartBar size={16} />}>
							Số lượng
						</SelectItem>
					</Select>
				</div>
			)}
		</div>
	);

	const renderChart = () => {
		if (loading) return <div className="h-[400px] flex items-center justify-center"><Loading /></div>;
		if (processedData.length === 0) return <div className="h-[400px] flex items-center justify-center"><NoData /></div>;

		if (activeTab === "total") {
			return (
				<BarChart
					className="h-[400px] mt-4"
					data={processedData}
					index="label"
					categories={["Tổng số ý kiến"]}
					colors={["cyan"]}
					valueFormatter={(number: number) => Intl.NumberFormat("vi-VN").format(number)}
					showAnimation
					yAxisWidth={56}
					rotateLabelX={{ angle: 0, verticalShift: 10, xAxisHeight: 40 }}
					margin={{ bottom: 30, right: 20 }}
				/>
			);
		}

		const categories = activeTab === "sentiment" ? sentimentCategories : topicCategories;
		const colors = categories.map(cat => (activeTab === "sentiment" ? SENTIMENT_COLORS[cat] : TOPIC_COLORS[cat]) || "gray");

		if (chartType === "area") {
			return (
				<AreaChart
					className="h-[400px] mt-4"
					data={chartData}
					index="label"
					categories={categories}
					colors={colors}
					stack={true}
					minValue={0}
					maxValue={100}
					valueFormatter={(number: number) => `${number.toFixed(1)}%`}
					showAnimation
					yAxisWidth={56}
					showGradient={false}
					intervalType={0}
					rotateLabelX={{ angle: 0, verticalShift: 10, xAxisHeight: 40 }}
					margin={{ bottom: 30, right: 20 }}
				/>
			);
		} else {
			return (
				<BarChart
					className="h-[400px] mt-4"
					data={chartData}
					index="label"
					categories={categories}
					colors={colors}
					valueFormatter={(number: number) => Intl.NumberFormat("vi-VN").format(number)}
					showAnimation
					yAxisWidth={56}
					intervalType={0}
					rotateLabelX={{ angle: 0, verticalShift: 10, xAxisHeight: 40 }}
					margin={{ bottom: 30, right: 20 }}
				/>
			);
		}
	};

	return (
		<div className="mt-6 mb-0">
			<Accordion variant="splitted" className="px-0" selectionMode="multiple">
				<AccordionItem
					key="comment-charts"
					aria-label="Biểu đồ thống kê ý kiến"
					title={
						<div className="flex items-center gap-2">
							<span className="font-bold text-lg pb-2 text-primary-dark">Thống kê ý kiến phản hồi</span>
							<Chip size="sm" color="primary" variant="flat" className="font-bold uppercase tracking-wider text-[10px]">Mới</Chip>
						</div>
					}
					subtitle="Xem thống kê tổng quan, tỉ lệ cảm xúc và khía cạnh theo thời gian"
				>
					<div className="p-2 pt-0">
						<div className="flex flex-col gap-6">
							<Tabs
								aria-label="Chart Tabs"
								variant="underlined"
								selectedKey={activeTab}
								onSelectionChange={(key) => setActiveTab(key as string)}
								classNames={{
									tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
									cursor: "w-full bg-primary",
									tab: "max-w-fit px-0 h-12",
									tabContent: "group-data-[selected=true]:text-primary font-semibold"
								}}
							>
								<Tab key="total" title="Tổng số ý kiến" />
								<Tab key="sentiment" title="Phân loại theo cảm xúc" />
								<Tab key="topic" title="Phân loại theo khía cạnh" />
							</Tabs>

							<ChartLayout
								primaryTitle={chartTitles[activeTab]}
								legends={[]}
								colors={activeTab === "total" ? ["cyan"] : (activeTab === "sentiment" ? sentimentCategories.map(c => SENTIMENT_COLORS[c] || "gray") : topicCategories.map(c => TOPIC_COLORS[c] || "gray"))}
								handlerButtons={handlerButtons}
								showLegend={true}
                                isFullWidth
							>
								{renderChart()}
							</ChartLayout>
						</div>
					</div>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
