"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useDetailFacultyQuery } from "@/gql/graphql";
import { ReactNode } from "react";

export default function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: any;
}) {
	const { data: faculty } = useDetailFacultyQuery({
		variables: { id: params.id || "" },
	});

	return (
		<FilterProvider>
			<h1 className="page-title mb-4">
				{faculty?.faculty?.display_name}
			</h1>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<PageTabs
				lastIndex={3}
				defaultPath={`faculty/${params.id}`}
				tabs={[
					{
						link: "",
						title: "Trang chủ",
					},
					{
						link: `detail`,
						title: "Chi tiết",
					},
					{
						link: `comment`,
						title: "Ý kiến",
					},
					{
						link: `compare`,
						title: "So sánh các môn học",
					},
				]}
			/>
			<div className="mt-6 w-full p-0 h-auto">{children}</div>
		</FilterProvider>
	);
}
