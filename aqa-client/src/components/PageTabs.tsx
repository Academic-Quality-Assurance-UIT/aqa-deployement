"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { Tab, Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

export default function PageTabs({
	defaultPath,
	lastIndex = 2,
	tabs,
	className = "mt-2",
}: {
	defaultPath: string;
	lastIndex?: number;
	tabs: { link: string; title: string }[];
	className?: string;
}) {
	const router = useRouter();
	const pathname = usePathname();

	const { setUrlQuery } = useFilterUrlQuery();

	return (
		<div className="w-full overflow-x-auto py-1">
			<Tabs
				selectedKey={pathname.split("/").at(lastIndex) || ""}
				onSelectionChange={(tab) => {
					setUrlQuery(`/${defaultPath}/${tab}`, {});
				}}
				className={className}
				variant="underlined"
				color="primary"
				classNames={{
					tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
					cursor: "w-full bg-primary",
					tab: "max-w-fit px-0 h-10",
					tabContent: "group-data-[selected=true]:text-primary group-data-[selected=true]:font-bold"
				}}
				aria-label="Page tabs"
			>
				{tabs.map(({ title, link }) => (
					<Tab key={link} title={title} />
				))}
			</Tabs>
		</div>
	);
}
