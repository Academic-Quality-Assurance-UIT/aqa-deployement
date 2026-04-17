"use client";

import StaffSurveyAllCommentsPage from "@/components/comments/StaffSurveyAllCommentsPage";

export default function Page() {
	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">Tất cả nhận xét</h1>
			</div>

			<div className=" mt-10">
				<StaffSurveyAllCommentsPage />
			</div>
		</div>
	);
}
