"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { Tab, Tabs } from "@heroui/react";
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
			<div className=" mt-4">
				<Tabs
					variant={"underlined"}
					color="primary"
					classNames={{
						tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
						cursor: "w-full bg-primary",
						tab: "max-w-fit px-0 h-10",
						tabContent: "group-data-[selected=true]:text-primary group-data-[selected=true]:font-bold"
					}}
					aria-label="Criteria class type"
					selectedKey={query.class_type || ""}
					onSelectionChange={(key) => {
						setUrlQuery(pathname, { class_type: key.toString() });
					}}
				>
					<Tab key="" className=" font-medium" title="Tất cả" />
					<Tab key="LT" className=" font-medium" title="Lý thuyết" />
					<Tab key="TH1" className=" font-medium" title="Thực hành 1" />
					<Tab key="TH2" className=" font-medium" title="Thực hành 2" />
					<Tab key="Online" className=" font-medium" title="Học online" />
				</Tabs>
			</div>
			<div className="mt-6 w-full p-0 h-[420px]">{children}</div>
		</FilterProvider>
	);
}
