"use client";

import BreadCrumb from "@/components/BreadCrumb";
import LecturerShowToggle from "@/components/LecturerHiddenToggle";
import PageTabs from "@/components/PageTabs";
import { useIsLecturer } from "@/hooks/useIsAdmin";
import useLecturerInfo from "@/hooks/useLecturerInfo";
import { hashAndShorten } from "@/utils/lecturerIdHash";
import { useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

export default function Layout({
	params: { lecturer_id },
	children,
}: {
	params: { lecturer_id: string };
	children: ReactNode;
}) {
	const { lecturer } = useLecturerInfo(lecturer_id);

	const { isLecturer } = useIsLecturer();

	const searchParams = useSearchParams();

	const isShowedName = searchParams.get("showLecturerName") === "true";

	return (
		<div>
			<div className="flex gap-4">
				<h1 className="font-extrabold text-2xl">
					{isShowedName ? (
						lecturer.display_name
					) : (
						<span className=" text-slate-500">
							Giảng viên {hashAndShorten(lecturer_id)}
						</span>
					)}
				</h1>
				<LecturerShowToggle />
			</div>
			{isLecturer ? null : <BreadCrumb />}
			<PageTabs
				lastIndex={3}
				defaultPath={`lecturer/${lecturer_id}`}
				tabs={tabs}
			/>
			<div className="mt-4"> {children}</div>
		</div>
	);
}

const tabs = [
	{
		link: "",
		title: "Trang chủ",
	},
	{
		link: "classes",
		title: "Tất cả các lớp",
	},
	{
		link: "semesters",
		title: "Điểm trung bình qua các học kỳ",
	},
	{
		link: "comments",
		title: "Ý kiến",
	},
];
