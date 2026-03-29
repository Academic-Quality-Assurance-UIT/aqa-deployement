"use client";

import PointWithCompare from "@/components/chart/PointWithCompare";
import { useAllSubjectsQuery, useFacultiesQuery } from "@/gql/graphql";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { Checkbox, cn } from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";

export default function Page({ params }: { params: any }) {
	const { query } = useFilterUrlQuery();
	const { data: subjects, loading } = useAllSubjectsQuery({
		variables: {
			filter: { ...query, faculty_id: params.id, criteria_id: "" },
		},
		fetchPolicy: "network-only",
	});

	const [chosen, setChosen] = useState<Map<string, boolean>>(new Map());

	const chosenDebounce = useDebounce(chosen, 800);

	return subjects ? (
		<div className="pb-4">
			<PointWithCompare
				queries={[
					{ ...query, faculty_id: "", name: "Trung bình toàn trường" },
					...subjects.subjects.data
						.filter((subject) => chosenDebounce.get(subject.subject_id))
						.map((subject) => ({
							...query,
							subjects: [subject.subject_id],
							name: subject.display_name,
						})),
				]}
				groupEntity="Semester"
			/>
			<div className=" mt-10 grid grid-cols-2 items-stretch gap-x-2 gap-y-2">
				{subjects.subjects.data.map((subject) => (
					<Checkbox
						key={subject.subject_id}
						aria-label={subject.display_name ?? ""}
						classNames={{
							base: cn(
								"inline-flex w-full max-w-3xl bg-content1 !m-0",
								"hover:bg-content2 items-center justify-start",
								"cursor-pointer rounded-lg gap-2 p-3 border-2 border-transparent",
								"data-[selected=true]:border-primary"
							),
							label: "w-full",
						}}
						isSelected={chosen.get(subject.subject_id)}
						onValueChange={() =>
							setChosen((prev) => {
								const newValue = new Map(prev);
								newValue.set(
									subject.subject_id,
									!chosen.get(subject.subject_id)
								);
								return newValue;
							})
						}
					>
						<div className="w-full flex justify-between gap-2">
							<p>{subject.display_name}</p>
						</div>
					</Checkbox>
				))}
			</div>
		</div>
	) : null;
}
