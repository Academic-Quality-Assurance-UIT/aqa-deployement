"use client";

import BreadCrumb from "@/components/BreadCrumb";
import ChildrenItems from "@/components/ChildrenItems";
import { FilterProvider } from "@/contexts/FilterContext";
import { useFacultiesQuery, useProfileQuery } from "@/gql/graphql";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { useEffect } from "react";

export default function Page({ params }: { params: any }) {
	const semester_id = params.id;
	const { query, setUrlQuery } = useFilterUrlQuery();

	const { data: profile, loading: profileLoading } = useProfileQuery({
		fetchPolicy: "network-only",
	});

	const { data, loading } = useFacultiesQuery();

	console.log({ profile });

	useEffect(() => {
		if (profile) {
			if (profile?.profile.role === "FACULTY") {
				setUrlQuery(`/faculty/${profile?.profile?.faculty?.faculty_id}`, {
					faculty_id: profile?.profile?.faculty?.faculty_id,
				});
			} else {
				setUrlQuery(`/faculty`, {});
			}
		}
	}, [profile, setUrlQuery]);

	return (
		<FilterProvider>
			<p className=" mt-5 font-semibold text-base">Chọn khoa/bộ môn</p>
			<ChildrenItems
				loading={loading}
				items={[
					{
						display_name: "Tất cả các khoa/bộ môn",
						value: "all",
						onClick() {
							setUrlQuery(`/faculty`, {});
						},
					},
					...(data?.faculties.data.map(({ display_name, faculty_id }) => ({
						display_name,
						value: faculty_id,
						onClick() {
							setUrlQuery(`/faculty/${faculty_id}`, {
								faculty_id,
							});
						},
					})) || []),
				]}
			/>
		</FilterProvider>
	);
}
