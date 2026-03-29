"use client";

import ChooseFileMapping, {
	MappingItem,
} from "@/components/staff-survey/ChooseFileMapping";
import UploadingFilePreview from "@/components/staff-survey/UploadingFilePreview";
import { UICard } from "@/components/UICard";
import {
	useAddListStaffSurveyDataMutation,
	useAddStaffSurveyDataMutation,
} from "@/gql/graphql";
import { Button, Input } from "@heroui/react";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {} from "react-icons";
import readXlsxFile from "read-excel-file";

export default function Page() {
	const router = useRouter();

	const [file, setFile] = useState<File | null>(null);
	const [data, setData] = useState<any[]>([]);
	const [surveyName, setSurveyName] = useState<string>("");
	const [isReadingFile, setIsReadingFile] = useState(false);
	const [isAddingRows, setIsAddingRows] = useState(false);
	const [addedRows, setAddedRows] = useState<number>(0);

	const [additionalMapping, setAdditionalMapping] = useState<MappingItem[]>([]);

	const [addSurveyData] = useAddStaffSurveyDataMutation({
		fetchPolicy: "no-cache",
	});
	const [addListSurveyData] = useAddListStaffSurveyDataMutation({
		fetchPolicy: "no-cache",
	});

	const fileRef = useRef<HTMLInputElement>(null);

	const pointMapping = useMemo<
		{ category: string; criterias: { name: string; original: string }[] }[]
	>(() => {
		const pointColumnRegex = /(.*?)\s*\[\d*\.?\s*(.*?)\]/;

		const columns = data?.[0] ?? [];
		const pointColumns = columns
			.filter((column: string) => column.match(pointColumnRegex))
			.map((column: string) => column.match(pointColumnRegex));

		const pointMapping = new Map<string, { name: string; original: string }[]>();

		pointColumns.forEach((match: string) => {
			const pointCategory = match[1].trim();
			const pointName = match[2].trim();

			if (!pointMapping.has(pointCategory)) {
				pointMapping.set(pointCategory, []);
			}
			pointMapping.set(pointCategory, [
				...(pointMapping.get(pointCategory) ?? []),
				{
					name: pointName,
					original: match[0].trim(),
				},
			]);
		});

		return Array.from(pointMapping.entries()).map(([key, value]) => ({
			category: key,
			criterias: value,
		}));
	}, [data]);

	const facultyMapping = useMemo<{
		category: string;
		criterias: { name: string; original: string }[];
	}>(() => {
		const pointColumnRegex = /(.*?)\s*\[\s*(.*?)\]/;

		const columns = data?.[0] ?? [];
		const pointColumns = columns
			.filter((column: string) => column.match(pointColumnRegex))
			.map((column: string) => column.match(pointColumnRegex));

		const pointMapping = new Map<string, { name: string; original: string }[]>();

		pointColumns.forEach((match: string) => {
			const pointCategory = match[1].trim();
			const pointName = match[2].trim();

			if (!pointMapping.has(pointCategory)) {
				pointMapping.set(pointCategory, []);
			}
			pointMapping.set(pointCategory, [
				...(pointMapping.get(pointCategory) ?? []),
				{
					name: pointName,
					original: match[0].trim(),
				},
			]);
		});

		return (
			Array.from(pointMapping.entries())
				.map(([key, value]) => ({
					category: key,
					criterias: value,
				}))
				.filter((item) =>
					item.category.toUpperCase().includes("ĐƠN VỊ")
				)[0] ?? {
				category: "Đơn vị",
				criterias: [],
			}
		);
	}, [data]);

	const additionalCommentsMapping = useMemo<{
		category: string;
		criterias: number[];
	}>(() => {
		const pointColumnRegex = /(.*?)\s*\[\s*(.*?)\]/;

		const columns = data?.[0] ?? [];
		const pointColumns = columns
			.map((column: string, index: number) => ({
				match: column.match(pointColumnRegex),
				column,
				index,
			}))
			.filter(({ match }: { match: any }) => match);

		const pointMapping = new Map<string, number[]>();

		pointColumns.forEach(
			({ match, index }: { match: string[]; index: number }) => {
				const pointCategory = match[1].trim();

				if (!pointMapping.has(pointCategory)) {
					pointMapping.set(pointCategory, []);
				}
				pointMapping.set(pointCategory, [
					...(pointMapping.get(pointCategory) ?? []),
					index,
				]);
			}
		);

		return (
			Array.from(pointMapping.entries())
				.map(([key, value]) => ({
					category: key,
					criterias: value,
				}))
				.filter((item) =>
					item.category.toUpperCase().startsWith("Ý KIẾN")
				)?.[0] ?? {
				category: "Ý kiến",
				criterias: [],
			}
		);
	}, [data]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	const handleImport = useCallback(async () => {
		setIsAddingRows(true);

		const columns = data?.[0] ?? [];
		const rows = data.slice(1);
		console.log({ rows });
		console.log({ additionalMapping });
		console.log({ pointMapping, facultyMapping, additionalCommentsMapping });
		console.log({ surveyName });

		const pointMappingWithoutComment = pointMapping.filter(
			(d) => d.category != "Ý kiến thêm"
		);
		const pointMappingWithoutCommentCriteriaNames =
			pointMappingWithoutComment.flatMap((d) =>
				d.criterias.map((v) => v.name)
			);
		const criteriaList = pointMapping
			.map((point, pointIndex: number) => {
				if (
					point.category == "Ý kiến thêm" ||
					point.category.startsWith("Ý kiến")
				) {
					return [];
					// return point.criterias.map((criteria, index: number) => ({
					// 	...criteria,
					// 	name: pointMappingWithoutCommentCriteriaNames[index],
					// 	category: point.category,
					// 	index: pointIndex * 100 + index,
					// }));
				} else {
					return point.criterias.map((criteria, index: number) => ({
						...criteria,
						category: point.category,
						index: pointIndex * 100 + index,
					}));
				}
			})
			.flat();
		console.log({ criteriaList });

		const sheetDataList = rows.map((row) => {
			const rowData = Object.fromEntries(
				columns.map((column: string, index: number) => [column, row[index]])
			);
			return {
				survey_name: surveyName,
				...Object.fromEntries(
					additionalMapping.map((d) => [
						d.name,
						d.column ? rowData[d.column] : d.selected,
					])
				),
				points: [
					...criteriaList.map((criteria, index: number) => ({
						max_point: 5,
						point: rowData[criteria.original] ?? 0,
						comment:
							row[
								additionalCommentsMapping.criterias[
									pointMappingWithoutCommentCriteriaNames.indexOf(
										criteria.name
									)
								]
							] ?? "",
						criteria_name: criteria.name,
						criteria_category: criteria.category,
						criteria_index: criteria.index,
					})),
					// ...facultyMapping.criterias.map((criteria, index: number) => ({
					// 	max_point: 5,
					// 	point: row[criteria.original] ?? 0,
					// 	comment:
					// 		row[
					// 			additionalCommentsMapping.criterias[
					// 				pointMappingWithoutCommentCriteriaNames.indexOf(
					// 					criteria.name
					// 				)
					// 			]
					// 		] ?? "",
					// 	criteria_name: criteria.name,
					// 	criteria_category: facultyMapping.category,
					// 	criteria_index: index,
					// })),
				].map((item) => ({
					...item,
					point: _.isNumber(item.point) ? item.point : 0,
					max_point: _.isNumber(item.max_point) ? item.max_point : 0,
				})),
			};
		});

		console.log({ pointsData: sheetDataList });

		const CHUNK_SIZE = 5;
		await Promise.all(
			_.chunk(sheetDataList, CHUNK_SIZE).map((d) => {
				return addListSurveyData({
					variables: {
						data: d,
					},
					onCompleted: () => {
						setAddedRows((prev) => prev + CHUNK_SIZE);
					},
				});
			})
		);
		setIsAddingRows(false);
		router.push("/staff-survey");
	}, [
		data,
		additionalMapping,
		pointMapping,
		facultyMapping,
		additionalCommentsMapping,
		surveyName,
		router,
		addListSurveyData,
	]);

	return (
		<div>
			<div className=" flex items-center justify-between mb-4">
				<h1 className=" text-2xl font-bold">
					Upload dữ liệu khảo sát giảng viên
				</h1>
			</div>
			<div className=" mt-8">
				<Button onPress={() => fileRef.current?.click()}>
					<p className=" font-semibold">
						{file ? file.name : "Chọn file cần upload"}
					</p>
				</Button>
				<input
					ref={fileRef}
					className=" hidden"
					type="file"
					multiple={false}
					onChange={async (e) => {
						const file = e.target.files?.[0];
						setIsReadingFile(true);
						setSurveyName(
							file?.name.split(".").slice(0, -1).join(".") ?? ""
						);
						if (file) {
							setFile(file);
							readXlsxFile(file).then((rows) => {
								setData(rows);
								setIsReadingFile(false);
							});
						}
					}}
					accept=".xlsx, .xls, .csv"
				/>
			</div>
			{data.length > 0 ? (
				<UploadingFilePreview data={data} className=" mt-6" />
			) : null}
			{file ? (
				<div className=" mt-5 flex flex-col gap-8">
					<div>
						<div>
							<h1 className=" text-xl font-semibold">
								Bước 1: Chọn các trường dữ liệu
							</h1>
							<p> Chọn các trường chứa các thông tin thêm</p>
						</div>
						<UICard className=" mt-4 px-6 py-4 max-h-[400px] overflow-y-auto">
							<ChooseFileMapping
								columns={data?.[0]}
								setMapping={(mapping) =>
									setAdditionalMapping(mapping)
								}
							/>
						</UICard>
					</div>
					<div>
						<div>
							<h1 className=" text-xl font-semibold">
								Bước 2: Tải dữ liệu lên hệ thống
							</h1>
							<p>Kiểm tra thông tin và tải dữ liệu lên hệ thống</p>
						</div>
						<UICard className=" mt-4 px-6 py-4 max-h-[400px] overflow-y-auto flex flex-col gap-4">
							<p className=" px-4">
								Đã tìm thấy{" "}
								<span className=" font-semibold">
									{data.length - 1}
								</span>{" "}
								dòng dữ liệu trong file
							</p>
							<Input
								label="Tên khảo sát"
								placeholder="Nhập tên khảo sát (để phân biệt với các khảo sát khác)"
								required
								value={surveyName}
								onChange={(e) => setSurveyName(e.target.value)}
							/>
							<div className=" flex gap-4 items-center">
								<Button
									color="primary"
									className=" w-fit"
									onPress={handleImport}
									isLoading={isAddingRows}
								>
									<p>Tải dữ liệu vào hệ thống </p>
								</Button>

								{isAddingRows ? (
									<p>
										Đang thêm{" "}
										<b>
											{addedRows} / {data.length - 1}
										</b>
									</p>
								) : null}
							</div>
						</UICard>
					</div>
				</div>
			) : null}
		</div>
	);
}
