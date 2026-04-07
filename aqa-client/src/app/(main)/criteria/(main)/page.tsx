"use client";

import ChildrenItems from "@/components/ChildrenItems";
import CriteriaSemesterChart from "@/components/CriteriaSemesterChart";
import ClassTypeSelector from "@/components/selectors/ClassTypeSelector";
import { SemesterSelectorWithFilterUrlQuery } from "@/components/selectors/SemesterSelector";
import { useAllCriteriasQuery } from "@/gql/graphql";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { criteriaFilter } from "@/utils/criteria-filter";
import { Input } from "@heroui/react";
import { useState } from "react";

export default function Page() {
	const { query, setUrlQuery } = useFilterUrlQuery();

	const [keyword, setKeyword] = useState("");

	const { data, loading } = useAllCriteriasQuery({
		variables: {
			filter: {
				...query,
				keyword,
				class_type: query.class_type === "Online" ? "LT" : query.class_type,
			},
		},
	});

	return (
		<div className="flex flex-col gap-2">
			<CriteriaSemesterChart />
			<h2 className=" font-bold text-lg mt-6 mb-2">Danh sách các tiêu chí</h2>
			<div className="mt-2 flex flex-row items-center gap-2 p-1 bg-white dark:bg-zinc-900 border-1 border-divider rounded-xl w-fit shadow-sm">
				<p className="font-bold text-sm pl-4">Các bộ lọc: </p>
				<ClassTypeSelector isNoBorder />
				<div className=" w-[2px] h-5 bg-zinc-200" />
				<SemesterSelectorWithFilterUrlQuery isNoBorder />
			</div>
			<Input
				value={keyword}
				onChange={(e) => setKeyword(e.target.value)}
				onClear={() => setKeyword("")}
				isClearable
				type="text"
				size="md"
				placeholder="Nhập từ khóa cần tìm..."
				variant="bordered"
				className=" mt-2 w-full bg-white rounded-xl"
			/>
			<ChildrenItems
				loading={loading}
				isDisplayIndex
				items={[
					// {
					// 	display_name: "Chọn tất cả tiêu chí",
					// 	value: "all",
					// 	onClick() {
					// 		setUrlQuery(`/semester`, {
					// 			criteria_id: "",
					// 		});
					// 	},
					// },
					...(criteriaFilter(data, query) as any[]).map(
						({ display_name, criteria_id }, index) => ({
							display_name: `${display_name}`,
							value: criteria_id,
							onClick() {
								setUrlQuery(`/criteria/${criteria_id}`, {
									criteria_id,
								});
							},
						})
					),
				]}
			/>
		</div>
	);
}
