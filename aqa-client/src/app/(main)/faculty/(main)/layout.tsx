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
			<h1 className="font-extrabold text-3xl">Khoa/Bộ môn</h1>
			<BreadCrumb />
			<PageTabs defaultPath="faculty" tabs={tabs} />
			<div className=" w-full mt-5 p-0 h-auto">
				<FilterProvider>{children}</FilterProvider>
			</div>
		</>
	);
}
