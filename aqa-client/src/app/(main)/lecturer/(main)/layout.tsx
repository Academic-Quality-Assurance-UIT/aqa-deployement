"use client";

import BreadCrumb from "@/components/BreadCrumb";
import LecturerShowToggle from "@/components/LecturerHiddenToggle";
import PageTabs from "@/components/PageTabs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const tabs = [
	{
		link: "",
		title: "Trang chủ",
	},
	{
		link: "list",
		title: "Danh sách giảng viên",
	},
	{
		link: "compare",
		title: "So sánh giảng viên",
	},
];

export default function Layout({ children }: { children: ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		tabs.forEach(({ link }) => router.prefetch(`/lecturer/${link}`));
	}, [router]);

	return (
		<>
			<div className="flex gap-4 items-end mb-4">
				<h1 className="page-title">Giảng viên</h1>
				<LecturerShowToggle />
			</div>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<PageTabs defaultPath="lecturer" tabs={tabs} />
			<div className="mt-6 w-full p-0 h-[420px]">{children}</div>
		</>
	);
}
