import {
	Role,
	useDetailClassQuery,
	useDetailCriteriaQuery,
	useDetailFacultyQuery,
	useDetailSubjectQuery,
	useSemestersQuery,
} from "@/gql/graphql";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import useLecturerInfo from "@/hooks/useLecturerInfo";
import { useAuth } from "@/stores/auth.store";
import { useMemo } from "react";

export function useDisplayNameOfUrlFilter() {
	const { authData } = useAuth();

	const { query } = useFilterUrlQuery();

	const { data: criteria } = useDetailCriteriaQuery({
		variables: { id: query?.criteria_id || "" },
		skip: !query?.criteria_id,
	});

	const { data: semesters } = useSemestersQuery({
		skip: !query?.semester_id,
	});

	const { data: faculty } = useDetailFacultyQuery({
		variables: { id: query?.faculty_id || "" },
		skip: !query.faculty_id,
	});

	const { data: subject } = useDetailSubjectQuery({
		variables: { id: query?.subjects?.at(0) || "" },
		skip: !query?.subjects?.length,
	});

	const { lecturer } = useLecturerInfo(query.lecturer_id || "");

	const { data: classData } = useDetailClassQuery({
		variables: { id: query?.class_id || "" },
		skip: !query?.class_id,
	});

	const paths = useMemo(
		() => [
			{
				title: "Tiêu chí",
				link: "criteria",
				field: "criteria_id",
				className: "",
				value: query?.criteria_id,
				name: criteria?.criteria?.display_name,
				defaultValue: { criteria_id: "" },
			},
			{
				title: "Học kỳ",
				link: "semester",
				field: "semester_id",
				value: query?.semester_id,
				name: semesters?.semesters?.find(
					(semester) => semester.semester_id === query.semester_id
				)?.display_name,
				defaultValue: { semester_id: "" },
			},
			...(authData?.user?.role !== Role.Faculty
				? [
						{
							title: "Khoa",
							link: "faculty",
							field: "faculty_id",
							value: query?.faculty_id,
							name: faculty?.faculty?.display_name,
							defaultValue: { faculty_id: "" },
						},
				  ]
				: []),
			{
				title: "Môn học",
				link: "subject",
				field: "subjects",
				value: query?.subjects?.at(0),
				name: subject?.subject?.display_name,
				defaultValue: { subjects: undefined },
			},
			{
				title: "Giảng viên",
				link: "lecturer",
				field: "lecturer_id",
				value: query?.lecturer_id,
				name: lecturer.display_name,
				defaultValue: { lecturer_id: "" },
			},
			{
				title: "Lớp",
				link: "class",
				field: "class_id",
				value: query?.class_id,
				name: classData?.class?.display_name,
				defaultValue: { class_id: "" },
			},
		],
		[
			authData?.user?.role,
			classData?.class?.display_name,
			criteria?.criteria?.display_name,
			faculty?.faculty?.display_name,
			lecturer.display_name,
			query?.class_id,
			query?.criteria_id,
			query?.faculty_id,
			query?.lecturer_id,
			query.semester_id,
			query?.subjects,
			semesters?.semesters,
			subject?.subject?.display_name,
		]
	);

	return paths.filter((path) => !!path.value);
}
