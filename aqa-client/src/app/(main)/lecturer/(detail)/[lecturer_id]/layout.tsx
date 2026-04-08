"use client";

import BreadCrumb from "@/components/BreadCrumb";
import LecturerShowToggle from "@/components/LecturerHiddenToggle";
import PageTabs from "@/components/PageTabs";
import { useIsLecturer } from "@/hooks/useIsAdmin";
import useLecturerInfo from "@/hooks/useLecturerInfo";
import { hashAndShorten } from "@/utils/lecturerIdHash";
import { Button } from "@heroui/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

export default function Layout({
	params: { lecturer_id },
	children,
}: {
	params: { lecturer_id: string };
	children: ReactNode;
}) {
	const { lecturer } = useLecturerInfo(lecturer_id);
	const router = useRouter();

	const { isLecturer } = useIsLecturer();

	const searchParams = useSearchParams();

	const isShowedName = searchParams.get("showLecturerName") === "true";

	return (
		<div>
			{isLecturer ? null : (
				<div className="mb-6">
					<BreadCrumb />
				</div>
			)}
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
				<p className="font-medium text-slate-500">{`Giảng viên`}</p>
			</div>
			<div className="flex gap-4 items-end mb-4">
				<h1 className="page-title">
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
			<PageTabs
				lastIndex={3}
				defaultPath={`lecturer/${lecturer_id}`}
				tabs={tabs}
			/>
			<div className="mt-6"> {children}</div>
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
