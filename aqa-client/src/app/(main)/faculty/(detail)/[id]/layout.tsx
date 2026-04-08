"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useDetailFacultyQuery } from "@/gql/graphql";
import { Button } from "@heroui/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
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
	const router = useRouter();

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
				<p className="font-medium text-slate-500">{`Khoa`}</p>
			</div>
			<h1 className="page-title mt-1 mb-4">
				{faculty?.faculty?.display_name || ""}
			</h1>
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
