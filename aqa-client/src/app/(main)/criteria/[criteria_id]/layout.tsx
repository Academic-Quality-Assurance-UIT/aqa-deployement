"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useDetailCriteriaQuery } from "@/gql/graphql";
import { ReactNode } from "react";

export default function Layout({
	params: { criteria_id },
	children,
}: {
	params: {
		criteria_id: string;
	};
	children: ReactNode;
}) {
	const { data } = useDetailCriteriaQuery({ variables: { id: criteria_id } });

	return (
		<FilterProvider>
			<p className="font-medium text-slate-500">{`Tiêu chí`}</p>
			<h1 className="page-title mt-1 mb-4">
				{data?.criteria?.display_name || ""}
			</h1>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<PageTabs
				defaultPath={`criteria/${criteria_id}`}
				lastIndex={3}
				tabs={[
					{
						link: "",
						title: "Trang chủ",
					},
					{
						link: "detail",
						title: "Chi tiết",
					},
				]}
			/>
			<div className="mt-6 w-full p-0 h-[420px]">{children}</div>
		</FilterProvider>
	);
}
