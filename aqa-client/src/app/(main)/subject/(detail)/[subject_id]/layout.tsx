"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { FilterProvider } from "@/contexts/FilterContext";
import { useDetailSubjectQuery } from "@/gql/graphql";
import { Button } from "@heroui/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({
	params: { subject_id },
	children,
}: {
	params: { subject_id: string };
	children: ReactNode;
}) {
	const { data } = useDetailSubjectQuery({ variables: { id: subject_id } });
	const router = useRouter();

	return (
		<div>
			<div className="mb-6">
				<BreadCrumb />
			</div>
			{data?.subject ? (
				<>
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
						<p className="font-medium text-slate-500">{`Môn học`}</p>
					</div>
					<h1 className="page-title mb-1">
						{data.subject.display_name}
					</h1>
					<h2 className="mb-4 text-gray-600 dark:text-gray-300">
						Khoa{" "}
						<Link href={`/faculty/${data.subject.faculty?.faculty_id}`}>
							<span className=" font-semibold hover:text-sky-600 hover:dark:text-sky-500">
								{data.subject.faculty?.display_name}
							</span>
						</Link>
					</h2>
				</>
			) : null}
			<PageTabs
				lastIndex={3}
				defaultPath={`subject/${subject_id}`}
				tabs={tabs}
			/>
			<div className="mt-6">
				<FilterProvider>{children}</FilterProvider>
			</div>
		</div>
	);
}

const tabs = [
	{
		link: "",
		title: "Trang chủ",
	},
	{
		link: "points",
		title: "Điểm các lớp",
	},
	{
		link: "lecturers",
		title: "Điểm các giảng viên",
	},
	{
		link: "semesters",
		title: "Điểm trung bình qua các kỳ",
	},
	{
		link: "comments",
		title: "Ý kiến",
	},
];

interface ISubjectInfo {
	subject_id: string;
	subject_name: string;
	faculty_id: string;
	faculty_name: string;
}

// export async function generateMetadata({
// 	params: { subject_id },
// }: {
// 	params: { subject_id: string };
// }) {
// 	const res = await fetch(`${GET_SUBJECT_INFO}/${subject_id}`);
// 	const { subject_name }: ISubjectInfo = await res.json();

// 	return {
// 		title: `${subject_name} - AQA`,
// 	};
// }
