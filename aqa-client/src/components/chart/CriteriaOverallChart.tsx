"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import PointEachSemester from "../PointEachSemester";
import FacultySelector from "../selectors/FacultySelector";
import ProgramSelector from "../selectors/ProgramSelector";
import SubjectSelector from "../selectors/SubjectSelector";
import { Role } from "@/gql/graphql";
import { FilterProvider } from "@/contexts/FilterContext";
import { Chip } from "@heroui/react";
import _ from "lodash";

export default function CriteriaOverallChart() {
	const { query, role } = useFilterUrlQuery();

	const currentRoleName =
		role === Role.Admin || role == Role.FullAccess
			? "toàn trường"
			: role == Role.Faculty
				? "khoa/bộ môn"
				: "giảng viên";

	return (
		<PointEachSemester
			query={query}
			title={<span className=" flex items-center gap-2">{`Điểm đánh giá trung bình của ${currentRoleName} qua từng học kỳ`} <Chip color="success"><span className=" font-semibold">{_.capitalize(currentRoleName)}</span></Chip></span>}
			legend="Điểm đánh giá"
			selectors={
				<>
					<ProgramSelector />
					{role == Role.Admin || role == Role.FullAccess ? (
						<FacultySelector />
					) : null}
					<SubjectSelector />
				</>
			}
		/>
	);
}

export function CurrentLecturerOverallChart() {
	const { currentLecturerId, role } = useFilterUrlQuery();

	return role === Role.Lecturer ? null : (
		<div className=" shadow-2xl rounded-2xl">
			<PointEachSemester
				overrideQueries={{
					lecturer_id: currentLecturerId,
				}}
				title={<span className=" flex items-center gap-2">{`Điểm đánh giá trung bình của giảng viên qua từng học kỳ`} <Chip color="primary"><span className=" font-semibold">Giảng viên</span></Chip></span>}
				legend="Điểm đánh giá"
				selectors={
					<>
						<ProgramSelector />
						<SubjectSelector />
					</>
				}
			/>
		</div>
	);
}

const dataFormatter = (number: number) => {
	return `${number.toFixed(2)}`;
};

interface IChartData {
	display_name: string;
	criteria_id: string;
	point: number;
	index: number;
	num: number;
}

const LEGEND = "Độ hài lòng";
