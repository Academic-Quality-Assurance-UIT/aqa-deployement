"use client";

import { BarChart } from "@/components/chart/BarChart";
import PieChart from "@/components/chart/PieChart";
import Loading from "@/components/Loading";
import NoData from "@/components/NoData";
import { UICard } from "@/components/UICard";
import { useChartGenerating } from "@/hooks/useChartGenerating";
import {
	Accordion,
	AccordionItem,
	Button,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { useRef, useState } from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import { FcComboChart } from "react-icons/fc";
import { IoMdSend } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";

const sampleQuestions = [
	"Tỉ lệ ý kiến tiêu cực/ tổng bình luận của mỗi khoa (dùng biểu đồ tròn)",
	"Điểm đánh giá trung bình của từng khoa trong học kỳ 1, năm học 2021-2022",
	"Top 5 giảng viên có điểm đánh giá cao nhất học kỳ 1, năm học 2021-2022",
	"Số lượng ý kiến tiêu cực qua mỗi học kỳ",
	"Biểu đồ số lượng sinh viên tham gia khảo sát qua các học kỳ",
];

export default function Page() {
	const searchRef = useRef<HTMLInputElement>(null);

	const [isInitial, setIsInitial] = useState<boolean>(true);

	const [question, setQuestion] = useState<string>("");
	const [isGenerated, setIsGenerated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [genereatedData, setGeneratedData] = useState<any | null>(null);

	const [error, setError] = useState<string | null>(null);

	const { generateChart } = useChartGenerating({
		onStart: () => {
			setLoading(true);
			setIsInitial(false);
			setQuestion(searchRef.current?.value ?? "");
		},
		onComplete: (data) => {
			setGeneratedData(data);
			setIsGenerated(true);
			setIsInitial(false);
		},
		onError: (error) => {
			setError(error.message);
		},
		onSetteled: () => {
			setLoading(false);
		},
	});

	return (
		<UICard className="w-full h-full rounded-3xl shadow-none">
			<div className="flex flex-col py-24 gap-12 items-center justify-center h-full ">
				{isInitial ? (
					<>
						<div className=" flex flex-col items-center gap-1">
							<h1 className="flex items-center gap-2 text-4xl font-bold mb-4">
								AQA -{" "}
								<span className=" text-pink-500">Assistant</span>
								<span className=" mx-2">
									<FcComboChart size={40} />
								</span>
							</h1>
							<p className=" text-lg font-medium">
								Nhập câu hỏi, AI sẽ lập tức chuyển đổi dữ liệu thành{" "}
								<span className=" pb-[3px] border-b-4 border-b-pink-500">
									biểu đồ{" "}
								</span>{" "}
								và bảng biểu trực quan.
							</p>
						</div>
						<div className="flex items-center w-1/2 px-6 py-3 rounded-2xl shadow-md bg-white">
							<input
								ref={searchRef}
								defaultValue={question}
								type="text"
								placeholder="Hỏi bất kỳ câu hỏi nào..."
								className="!bg-white outline-none border-none flex-1 "
								disabled={loading}
							/>
							<Button
								isIconOnly={true}
								variant="light"
								isLoading={loading}
								onPress={() => {
									if (searchRef.current) {
										const question = searchRef.current.value;
										if (question) {
											generateChart(question);
										}
									}
								}}
							>
								<IoMdSend size={20} />
							</Button>
						</div>
					</>
				) : (
					<div className="w-1/2 flex flex-col items-center gap-1">
						<p className=" text-base text-center mb-1">Câu hỏi</p>
						<p className=" mb-2 text-xl font-semibold text-center">
							{question}
						</p>
						{loading ? (
							<Button className="bg-transparent" isLoading>
								Đang tải...
							</Button>
						) : (
							<Button
								className=""
								color="primary"
								onPress={() => {
									setIsInitial(true);
									setIsGenerated(false);
									setGeneratedData(null);
									setError(null);
								}}
							>
								<TfiReload /> Chỉnh sửa yêu cầu
							</Button>
						)}
					</div>
				)}

				{isInitial ? (
					<div className=" w-1/2 pl-2 flex flex-col gap-2">
						<p className=" pb-2 font-semibold">Câu hỏi gợi ý</p>
						{sampleQuestions.map((question, index) => (
							<Button
								key={index}
								variant="light"
								className="w-fit ml-8 text-left px-5 py-4 rounded-2xl shadow-2xl bg-white hover:bg-gray-100"
								onPress={() => {
									if (searchRef.current) {
										searchRef.current.value = question;
									}
								}}
							>
								<BsArrowReturnRight /> {question}
							</Button>
						))}
					</div>
				) : null}

				{isGenerated && genereatedData ? (
					<>
						<div className=" w-2/3 flex flex-col items-center gap-4">
							{(genereatedData.chart_type == "bar" ||
								genereatedData.chart_type == "line") && (
									<div className="w-full h-fit px-12 py-8 pt-10 flex flex-col items-center bg-white shadow-md rounded-3xl">
										<div className=" w-full h-[500px] mt-4 mb-10">
											<BarChart
												className=" w-full h-full"
												//@ts-ignore
												yTitle={genereatedData.metadata.y_axis}
												xTitle={genereatedData.metadata.x_axis}
												data={
													genereatedData.chartData?.length
														? genereatedData.metadata.series.map(
															(d: any, i: number) => ({
																label: d.label,
																data:
																	genereatedData.chartData?.map(
																		(
																			v: any
																		) => ({
																			x: v[
																				genereatedData
																					.metadata
																					.x_axis_column
																			],
																			y: v[
																				d
																					.column_name
																			] as number,
																			type: genereatedData.chart_type,
																			id: v[
																				d
																					.column_name
																			],
																		})
																	) || [],
																backgroundColor:
																	COLORS[i]
																		.backgroundColor,
																borderColor:
																	COLORS[i]
																		.borderColor,
																type: genereatedData.chart_type,
															})
														)
														: undefined
												}
												valueFormatter={genereatedData.metadata.series.map(
													() => (d: any) => d
												)}
												noDataText={
													loading ? <Loading /> : <NoData />
												}
												onClick={({ index, data }) => { }}
												hasY1={false}
											/>
										</div>
										<p className=" text-center mb-1 font-semibold">
											{genereatedData.chart_title}
										</p>
										<p className=" text-center text-sm">
											{genereatedData.chart_description}
										</p>
									</div>
								)}
							{genereatedData.chart_type == "table" && (
								<Table aria-label="Example static collection table">
									<TableHeader>
										{genereatedData.metadata.columns.map(
											(column: any) => (
												<TableColumn key={column.label}>
													{column.label}
												</TableColumn>
											)
										)}
									</TableHeader>
									<TableBody>
										{genereatedData.chartData.map((row: any) => (
											<TableRow
												key={
													row[
													genereatedData.metadata.index
													]
												}
											>
												{genereatedData.metadata.columns.map(
													(column: any) => (
														<TableCell
															key={column.label}
														>
															{row[column.column_name]}
														</TableCell>
													)
												)}
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
							{genereatedData.chart_type == "pie" ? (
								<div className="w-full h-fit px-12 py-8 pt-10 flex flex-col items-center bg-white shadow-md rounded-3xl">
									<div className=" w-full h-[500px] mt-4 mb-10">
										<PieChart
											data={genereatedData.chartData}
											title={genereatedData.chart_title}
											description={
												genereatedData.chart_description
											}
											labels={genereatedData.metadata.labels}
										/>
									</div>
									<p className=" text-center mb-1 font-semibold">
										{genereatedData.chart_title}
									</p>
									<p className=" text-center text-sm">
										{genereatedData.chart_description}
									</p>
								</div>
							) : null}
						</div>
						<Accordion
							className=" w-2/3 !shadow-md !mx-0"
							variant="shadow"
						>
							<AccordionItem
								key="1"
								aria-label="SQL Query"
								title={<p className=" font-medium">SQL Query</p>}
							>
								<p className=" whitespace-pre-wrap font-mono">
									{prettySQL(genereatedData.query)}
								</p>
							</AccordionItem>
						</Accordion>
					</>
				) : (
					<p className="text-red-500">{error}</p>
				)}
			</div>
		</UICard>
	);
}

const COLORS = [
	{
		backgroundColor: "oklch(68.5% 0.169 237.323)",
		borderColor: "oklch(44.3% 0.11 240.79)",
		color: "sky",
	},
	{
		backgroundColor: "oklch(45.9% 0.187 3.815)",
		borderColor: "oklch(45.9% 0.187 3.815)",
		color: "pink",
	},
	{
		backgroundColor: "oklch(79.5% 0.184 86.047)",
		borderColor: "oklch(47.6% 0.114 61.907)",
		color: "green",
	},
	{
		backgroundColor: "oklch(72.3% 0.219 149.579)",
		borderColor: "oklch(44.8% 0.119 151.328)",
		color: "yellow",
	},
];

function prettySQL(sql: string) {
	return sql.replaceAll(/\b(SELECT|FROM|INNER|WHERE)\b/gi, "\n$1").trim();
}
