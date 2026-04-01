"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import ClassTypeSelector from "@/components/selectors/ClassTypeSelector";
import { SemesterSelectorWithFilterUrlQuery } from "@/components/selectors/SemesterSelector";
import { FilterProvider } from "@/contexts/FilterContext";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { query, setUrlQuery } = useFilterUrlQuery();

	return (
		<FilterProvider>
			<h1 className="page-title mb-4">Tiêu chí</h1>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<PageTabs
				defaultPath="criteria"
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
			<div className="mt-4 flex flex-row items-center gap-2 p-1 bg-white dark:bg-zinc-900 border-1 border-divider rounded-xl w-fit shadow-sm">
				<ClassTypeSelector isNoBorder />
				<div className=" w-[2px] h-5 bg-zinc-200" />
				<SemesterSelectorWithFilterUrlQuery isNoBorder />
			</div>
			<div className="mt-6 w-full p-0 h-[420px]">{children}</div>
		</FilterProvider>
	);
}
