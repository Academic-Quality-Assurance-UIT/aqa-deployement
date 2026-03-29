"use client";

import { MappingItem } from "@/components/staff-survey/ChooseFileMapping";
import { ColumnSelect } from "@/components/staff-survey/ColumnSelect";
import { UICard } from "@/components/UICard";
import {
	useAddStaffSurveyDataMutation,
	useGetStaffSurveyBatchListQuery,
	useGetStaffSurveyCriteriaListQuery,
} from "@/gql/graphql";
import {
	Button,
	cn,
	Input,
	RadioGroup,
	Textarea,
	useRadio,
	VisuallyHidden,
} from "@heroui/react";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
	const router = useRouter();
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [pointData, setPointData] = useState<
		{ category: string; criteria: string; point: number; comment: string }[]
	>([]);
	const [additionalComment, setAdditionalComment] = useState<string>("");

	const { data: criteriaList } = useGetStaffSurveyCriteriaListQuery({
		fetchPolicy: "network-only",
	});
	const { data: batchList } = useGetStaffSurveyBatchListQuery({
		fetchPolicy: "network-only",
	});
	const [addSurveyData] = useAddStaffSurveyDataMutation({
		fetchPolicy: "no-cache",
	});

	const groupedCriteria = _.groupBy(
		criteriaList?.getCriteriaList || [],
		"category"
	);

	const basicInfoData = [
		{
			label: "Học vị",
			column: "academic_degree",
			name: "academic_degree",
			selected: "ĐH",
			options: ["ĐH", "ThS", "TS"],
			optionTitle: "Chọn học vị",
		},
		{
			label: "Khoa/Bộ môn",
			column: "faculty",
			name: "faculty",
			selected: undefined,
			options: [
				"VPĐU",
				"BMTL",
				"P.QHĐN",
				"P.CTSV",
				"HTTT",
				"P.TTPC-ĐBCL",
				"TT&VTS",
				"P.DLCNTT",
				"VP.CTĐB",
				"PTN.HTTT",
				"VPĐ",
				"P.SĐH&KHCN",
				"KTMT",
				"P.KHTC",
				"KHMT",
				"MMT&TT",
				"P.ĐTĐH",
				"KTTT",
				"THUVIEN",
				"BGH",
				"P.QTTB",
				"VPCĐ",
				"P.TCHC",
				"B.QLCS",
				"TTNN",
				"PTN.TTĐPT",
				"CNPM",
				"PTN.ATTT",
			],
			optionTitle: "Chọn khoa/bộ môn",
		},
		{
			label: "Học kỳ",
			column: "semester",
			name: "semester",
			selected: "2025",
			options: ["2020", "2021", "2022", "2023", "2024", "2025"],
			optionTitle: "Chọn học kỳ",
		},
		{
			label: "Tên file",
			column: "file_name",
			name: "file_name",
			selected: undefined,
			options:
				batchList?.getBatchList.map((batch) => batch.display_name ?? "") ||
				[],
			optionTitle: "Chọn tên file",
		},
	];
	const [additionData, setAdditionData] = useState<MappingItem[]>(basicInfoData);

	const handleAddData = useCallback(() => {
		setIsAdding(true);
		addSurveyData({
			variables: {
				data: {
					survey_name:
						additionData.find((item) => item.name === "file_name")
							?.selected || "",
					semester:
						additionData.find((item) => item.name === "semester")
							?.selected || "",
					academic_degree:
						additionData.find((item) => item.name === "academic_degree")
							?.selected || "",
					faculty:
						additionData.find((item) => item.name === "faculty")
							?.selected || "",
					points: pointData.map((item) => ({
						criteria_name: item.criteria,
						criteria_category: item.category,
						point: item.point,
						comment: item.comment,
						max_point: 5,
					})),
					additional_comment: additionalComment,
				},
			},
			onCompleted: () => {
				setIsAdding(false);
				router.push("/staff-survey");
			},
		});
	}, [addSurveyData, additionData, additionalComment, pointData, router]);

	useEffect(() => {
		setPointData(
			criteriaList?.getCriteriaList.map((criteria) => ({
				category: criteria.category,
				criteria: criteria.display_name,
				point: 5,
				comment: "",
			})) || []
		);
	}, [criteriaList]);

	console.log(additionData);

	return (
		<div className="flex flex-col">
			<h1 className="text-2xl font-bold mb-8">
				Thêm dữ liệu khảo sát giảng viên
			</h1>
			<div className="flex flex-col gap-8">
				<UICard
					title="Thông tin giảng viên"
					className=" px-6 py-4 flex flex-col gap-4"
				>
					{basicInfoData.map((item) => (
						<ColumnSelect
							key={item.label}
							label={item.label}
							value={
								additionData.find((data) => data.name === item.name)
									?.selected || item.selected
							}
							columns={item.options || []}
							title={item.optionTitle || "Chọn"}
							onChange={(value) => {
								setAdditionData((prev: any) => {
									const newMapping = [...prev];
									const index = newMapping.findIndex(
										(m) => m.name === item.name
									);
									if (index !== -1) {
										newMapping[index].selected = value;
									} else {
										newMapping.push({
											name: item.label,
											selected: value,
										});
									}
									return newMapping;
								});
							}}
						/>
					))}
				</UICard>
				{Object.entries(groupedCriteria).map(
					([category, criterias], index) => (
						<UICard
							key={category}
							title={category}
							className=" px-6 py-4 flex flex-col gap-4"
						>
							{criterias.map((criteria) => (
								<div
									key={criteria.display_name}
									className="flex gap-4 justify-between items-center"
								>
									<p className=" w-1/2 mr-4">
										{criteria.display_name}
									</p>
									<RadioGroup
										orientation="horizontal"
										value={
											pointData
												.find(
													(item) =>
														item.criteria ===
														criteria.display_name
												)
												?.point.toString() || "5"
										}
										onChange={(value) => {
											setPointData((prev) => {
												const existingPrev =
													structuredClone(prev);
												const existingIndex =
													existingPrev.findIndex(
														(item) =>
															item.criteria ===
															criteria.display_name
													);
												existingPrev[existingIndex] = {
													...existingPrev[existingIndex],
													point: parseInt(
														value.target.value
													),
												};
												return existingPrev;
											});
										}}
									>
										{Array(5)
											.fill("")
											.map((_, index: number) => (
												<CustomRadio
													key={index + 1}
													value={(index + 1).toString()}
												>
													{(index + 1).toString()}
												</CustomRadio>
											))}
									</RadioGroup>
									<Input
										label="Ý kiến thêm"
										onBlur={(e) => {
											setPointData((prev) => {
												const existingPrev =
													structuredClone(prev);
												const existingIndex =
													existingPrev.findIndex(
														(item) =>
															item.criteria ===
															criteria.display_name
													);
												existingPrev[existingIndex] = {
													...existingPrev[existingIndex],
													comment: e.target.value,
												};
												return existingPrev;
											});
										}}
										className=" flex-1"
									/>
								</div>
							))}
						</UICard>
					)
				)}
				<UICard
					title="Ý kiến bổ sung"
					className=" px-6 py-4 flex flex-col gap-4"
				>
					<Textarea
						rows={4}
						className="-mx-3"
						onBlur={(e) => setAdditionalComment(e.target.value)}
						placeholder="Nhập ý kiến bổ sung..."
					/>
				</UICard>
				<div className="flex justify-end">
					<Button
						color="primary"
						onPress={handleAddData}
						isLoading={isAdding}
					>
						Thêm dữ liệu
					</Button>
				</div>
			</div>
		</div>
	);
}

const CustomRadio = (props: any) => {
	const {
		Component,
		children,
		description,
		getBaseProps,
		getWrapperProps,
		getInputProps,
		getLabelProps,
		getLabelWrapperProps,
		getControlProps,
		isSelected,
	} = useRadio(props);

	return (
		<Component
			{...getBaseProps()}
			className={cn(
				"group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
				"max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 px-4 py-2",
				"data-[selected=true]:border-primary"
			)}
		>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<span {...getWrapperProps()} className=" hidden">
				<span {...getControlProps()} />
			</span>
			<div {...getLabelWrapperProps()} className="m-0">
				{children && (
					<span
						{...getLabelProps()}
						className={
							isSelected ? "font-semibold text-primary-normal" : ""
						}
					>
						{children}
					</span>
				)}
				{description && (
					<span className="text-small text-foreground opacity-70">
						{description}
					</span>
				)}
			</div>
		</Component>
	);
};
