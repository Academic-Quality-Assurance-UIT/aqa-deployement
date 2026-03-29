"use client";

import { useEffect, useState } from "react";
import { ColumnSelect } from "./ColumnSelect";

export type MappingItem = {
	name: string;
	column?: string;
	selected?: string;
	options?: string[];
	optionTitle?: string;
};

type PropTypes = {
	columns: string[];
	setMapping: (mappings: MappingItem[]) => void;
} & Pick<React.ComponentPropsWithoutRef<"div">, "className">;

const defaultColumns = [
	{
		label: "Nội dung cần cải thiện thêm",
		name: "additional_comment",
		column: "Quý Thầy/Cô muốn Nhà trường cải thiện các nội dung:",
	},
	{
		label: "Học vị",
		name: "academic_degree",
		column: "attribute_5",
	},
	{
		label: "Khoa/Bộ môn",
		name: "faculty",
		column: "attribute_6",
	},
	{
		label: "Học kỳ",
		name: "semester",
		selected: "2025",
		options: [
			"2015",
			"2016",
			"2017",
			"2018",
			"2019",
			"2020",
			"2021",
			"2022",
			"2023",
			"2024",
			"2025",
		],
		optionTitle: "Chọn học kỳ",
	},
];

export default function ChooseFileMapping({
	columns,
	setMapping,
	className,
}: PropTypes) {
	const [mapping, setMappingState] =
		useState<(MappingItem & { label: string })[]>(defaultColumns);

	useEffect(() => {
		setMapping(mapping);
	}, [mapping, setMapping]);

	return (
		<div className={className}>
			{mapping.map((item) => (
				<ColumnSelect
					key={item.label}
					columns={!item.options ? columns : item.options || []}
					title={item.optionTitle}
					label={item.label}
					value={item.column ?? item.selected}
					onChange={(value) => {
						setMappingState((prev: any) => {
							const newMapping = [...prev];
							const index = newMapping.findIndex(
								(m) => m.label === item.label
							);
							if (index !== -1) {
								newMapping[index].column = value;
								newMapping[index].selected = value;
							} else {
								newMapping.push({
									name: item.name,
									column: value,
								});
							}
							return newMapping;
						});
					}}
				/>
			))}
		</div>
	);
}
