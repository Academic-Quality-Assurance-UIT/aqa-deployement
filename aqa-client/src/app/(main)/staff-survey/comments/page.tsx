"use client";

import StaffSurveySemesterSelector from "@/components/selectors/StaffSurveySemesterSelector";
import StaffSurveyAllCommentsPage from "@/components/comments/StaffSurveyAllCommentsPage";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
	const [semester, setSemester] = useState<string | undefined>(undefined);

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">Tất cả nhận xét</h1>
				<div className="flex gap-3">
					<StaffSurveySemesterSelector
						semester={semester}
						setSemester={setSemester}
					/>
					<Link href="/staff-survey/add">
						<Button color="primary" variant="flat">
							<p className="font-bold">Thêm dữ liệu mới</p>
						</Button>
					</Link>
					<Link href="/staff-survey/upload">
						<Button color="primary" variant="flat">
							<p className="font-bold">Tải dữ liệu lên</p>
						</Button>
					</Link>
				</div>
			</div>

			<div className=" mt-10">
				<StaffSurveyAllCommentsPage semester={semester} />
			</div>
		</div>
	);
}
