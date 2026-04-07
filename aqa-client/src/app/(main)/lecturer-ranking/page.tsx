"use client";

import LecturerRanking from "@/components/lecturers/LecturerRanking";
import { FilterProvider } from "@/contexts/FilterContext";

export default function Page() {
	return (
		<div>
			<h1 className="page-title mb-6">Xếp hạng giảng viên</h1>
			<FilterProvider>
				<LecturerRanking />
			</FilterProvider>
		</div>
	);
}
