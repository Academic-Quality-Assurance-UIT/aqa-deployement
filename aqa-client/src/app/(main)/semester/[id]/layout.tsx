"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useDetailFacultyQuery, useSemestersQuery } from "@/gql/graphql";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { Button } from "@heroui/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({
	children,
	params: { id },
}: {
	children: ReactNode;
	params: { id: string };
}) {
	const { query } = useFilterUrlQuery();
	const router = useRouter();

	const { data: semesters } = useSemestersQuery();

	const semester = semesters?.semesters?.find(
		(v) => v.semester_id === query.semester_id
	);

	return (
		<FilterProvider>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<div className="flex items-center gap-1 -ml-2 mb-1">
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={() => router.back()}
					className="text-slate-500"
				>
					<RiArrowLeftSLine size={20} />
				</Button>
				<p className="font-medium text-slate-500">{`Học kỳ`}</p>
			</div>
			<h1 className="page-title mt-1 mb-4">
				{semester?.display_name || ""}
			</h1>
			<PageTabs
				lastIndex={3}
				defaultPath={`semester/${query.semester_id}`}
				tabs={[
					{
						link: "",
						title: "Trang chủ",
					},
					{
						link: `comment`,
						title: "Ý kiến",
					},
				]}
			/>
			<div className="mt-6 w-full p-0 h-[420px]">{children}</div>
		</FilterProvider>
	);
}
