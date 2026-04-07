"use client";

import BreadCrumb from "@/components/BreadCrumb";
import CriteriaSemesterChart from "@/components/CriteriaSemesterChart";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { query, setUrlQuery } = useFilterUrlQuery();

	return (
		<FilterProvider>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<h1 className="page-title mb-4">Tiêu chí</h1>
			<PageTabs
				defaultPath="criteria"
				tabs={[
					{
						link: "",
						title: "Tất cả tiêu chí",
					},
					{
						link: "detail",
						title: "Chi tiết các tiêu chí",
					},
				]}
			/>
			<div className="mt-4 w-full p-0 flex-1">{children}</div>
		</FilterProvider>
	);
}
