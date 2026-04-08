"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const tabs = [
	{
		link: "",
		title: "Trang chủ",
	},
	{
		link: "compare-semesters",
		title: "So sánh giữa các khoa",
	},
	// {
	// 	link: "point-per-year",
	// 	title: "Thống kê điểm trung bình qua các năm",
	// },
];

export default function Layout({ children }: { children: ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		tabs.forEach(({ link }) => router.prefetch(`/faculty/${link}`));
	}, [router]);

	return (
		<>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			<h1 className="page-title mb-4">Khoa/Bộ môn</h1>
			<PageTabs defaultPath="faculty" tabs={tabs} />
			<div className="mt-6 w-full p-0 h-auto">
				<FilterProvider>{children}</FilterProvider>
			</div>
		</>
	);
}
