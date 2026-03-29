"use client";

import BreadCrumb from "@/components/BreadCrumb";
import LecturerShowToggle from "@/components/LecturerHiddenToggle";
import PageTabs from "@/components/PageTabs";
import TextLink from "@/components/TextLink";
import { useDetailClassQuery } from "@/gql/graphql";
import { hashAndShorten } from "@/utils/lecturerIdHash";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export default function DetailClassPage({
	params: { id },
	children,
}: {
	params: { id: string };
	children: ReactNode;
}) {
	// const response = await fetch(GET_CLASS_INFORMATION(params.id));
	// const classInfo: ClassInfo = await response.json();
	const { data: classData } = useDetailClassQuery({ variables: { id } });
	const classInfo = classData?.class;

	const searchParams = useSearchParams();
	const isShowedName = searchParams.get("showLecturerName") === "true";

	return (
		<div>
			<h1 className="font-extrabold text-2xl">
				{classInfo?.display_name} - {classInfo?.subject.display_name}
			</h1>
			<div className="flex gap-4 items-end">
				<h2 className="mt-3 text-gray-600 dark:text-gray-300">
					<>
						Giảng viên{" "}
						<TextLink
							href={`/lecturer/${classInfo?.lecturer.lecturer_id}`}
							filter={{
								lecturer_id: classInfo?.lecturer.lecturer_id ?? "",
								class_id: undefined,
							}}
						>
							{isShowedName
								? classInfo?.lecturer.display_name
								: hashAndShorten(
										classInfo?.lecturer.lecturer_id ?? ""
								  )}
						</TextLink>
					</>
				</h2>
				<LecturerShowToggle />
			</div>
			<BreadCrumb />
			<PageTabs
				lastIndex={3}
				defaultPath={`class/${id}`}
				tabs={[
					{
						link: "",
						title: "Trang chủ",
					},
					{
						link: "comment",
						title: "Ý kiến",
					},
				]}
			/>
			<div className=" mt-10">{children}</div>
		</div>
	);
}

type ClassInfo = {
	class_id: string;
	class_name: string;
	class_type: string;
	program: string;
	subject_id: string;
	subject_name: string;
	lecturer_id: string;
	lecturer_name: string;
	// total: number;
	// attend: number;
	semester_id: string;
	semester_name: string;
	points: {
		point: number;
		max_point: number;
		criteria_id: string;
		criteria_name: string;
	}[];
};
