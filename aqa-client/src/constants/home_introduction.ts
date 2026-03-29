import SUBJECT_ILLUSTRATION from "@assets/illustrations/subject.svg";
import CRITERIA_ILLUSTRATION from "@assets/illustrations/criteria.svg";
import COMMENT_ILLUSTRATION from "@assets/illustrations/comment.svg";

export const HOME_INTRODUCTION: IFeatureIntroduction[] = [
	{
		icon: SUBJECT_ILLUSTRATION,
		title: {
			displayName: "Môn học",
			link: "/subject",
		},
		description: "Khảo sát dựa vào điểm đánh giá trung bình của các môn học ",
		navigation_links: [
			{
				displayName: "Tìm kiếm môn học",
				description: "Tìm kiếm môn học theo tên, xem danh sách môn học",
				link: "/subject",
			},
			{
				displayName: "Xem bảng xếp hạng các môn học",
				description:
					"Xem danh sách môn học và điểm đánh giá của từng môn theo thứ tự giảm dần",
				link: "/subject/average-point",
			},
		],
	},
	{
		icon: COMMENT_ILLUSTRATION,
		title: {
			displayName: "Ý kiến",
			link: "/comment",
		},
		description: "Thống kê ý kiến của sinh viên",
		navigation_links: [
			{
				displayName: "Xem tất cả ý kiến",
				link: "/comment",
			},
		],
	},
	{
		icon: CRITERIA_ILLUSTRATION,
		title: {
			displayName: "Tiêu chí",
			link: "/criteria",
		},
		description: "Thống kê điểm đánh giá theo từng tiêu chí",
		navigation_links: [
			{
				displayName: "Xem danh sách tiêu chí",
				link: "/criteria",
			},
			{
				displayName: "Điểm đánh giá qua từng học kỳ",
				description:
					"Xem điểm đánh giá từng tiêu chí và điểm đánh giá tổng qua từng học kỳ",
				link: "/criteria/detail",
			},
		],
	},
];

export interface IFeatureIntroduction {
	icon: any;
	title: {
		displayName: string;
		link: string;
	};
	description: string;
	navigation_links: {
		displayName: string;
		description?: string;
		link: string;
	}[];
}
