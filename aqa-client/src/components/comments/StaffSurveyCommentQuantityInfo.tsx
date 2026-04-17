"use client";

import InfoTab from "@/components/InfoTab";

import ALL_COMMENT_ICON from "@assets/all_comment.svg";
import NEGATIVE_COMMENT_ICON from "@assets/negative_comment.svg";
import POSITIVE_COMMENT_ICON from "@assets/positive_comment.svg";
import NEUTRLA_COMMENT_ICON from "@assets/neutral_comment.svg";

import {
	useStaffSurveyCommentQuantityEachTopicQuery,
	useStaffSurveyCommentSummaryQuery,
} from "@/gql/graphql";
import { useRememberValue } from "@/hooks/useRememberValue";
import { usePathname, useSearchParams } from "next/navigation";
import { Tab, Tabs } from "@heroui/react";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";

type Props = {
	semester?: string;
};

export default function StaffSurveyCommentQuantityInfo({ semester }: Props) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { setUrlQuery } = useFilterUrlQuery();

	const { data: commentQuantity, loading: isLoading } = useStaffSurveyCommentSummaryQuery({
		variables: { semester: semester },
        fetchPolicy: "network-only"
	});

	const { data: commentQuantityByTopic, loading: isLoadingTopic } =
		useStaffSurveyCommentQuantityEachTopicQuery({
			variables: {
				semester: semester,
				type: searchParams.get("type") ?? "all",
			},
            fetchPolicy: "network-only"
		});

	const data = useRememberValue(commentQuantity);

	return (
		<div className=" w-full">
			<div className=" w-full overflow-x-auto">
				<div className=" w-full px-8 lg:px-0 lg:pr-0 grid grid-cols-2 lg:flex lg:flex-row gap-y-2 gap-x-4 lg:gap-2 mb-4">
					<InfoTab
						type="all"
						icon={ALL_COMMENT_ICON}
						title="Tất cả"
						isLoading={isLoading}
						number={data?.all?.quantity}
					/>
					<InfoTab
						type="positive"
						icon={POSITIVE_COMMENT_ICON}
						title="Tích cực"
						isLoading={isLoading}
						number={data?.positive?.quantity}
					/>
					<InfoTab
						type="negative"
						icon={NEGATIVE_COMMENT_ICON}
						title="Tiêu cực"
						isLoading={isLoading}
						number={data?.negative?.quantity}
					/>
					<InfoTab
						type="neutral"
						icon={NEUTRLA_COMMENT_ICON}
						title="Trung tính"
						isLoading={isLoading}
						number={data?.neutral?.quantity}
					/>
				</div>
			</div>
			{!isLoadingTopic ? (
				<div className="w-full overflow-x-auto py-1">
					<Tabs
						variant="solid"
						onSelectionChange={(value) =>
							setUrlQuery(pathname, {}, { topic: value })
						}
                        selectedKey={searchParams.get("topic") ?? "all"}
					>
						<Tab key="all" title="Tất cả" />
						<Tab
							key="hạ tầng CNTT"
							title={
								<p>
									Hạ tầng CNTT{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.it_infrastructure?.quantity ?? 0})
									</span>
								</p>
							}
						/>
						<Tab
							key="cơ sở vật chất"
							title={
								<p>
									Cơ sở vật chất{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.facilities?.quantity ?? 0})
									</span>
								</p>
							}
						/>
						<Tab
							key="môi trường/điều kiện làm việc"
							title={
								<p>
									Môi trường làm việc{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.working_environment?.quantity ?? 0})
									</span>
								</p>
							}
						/>
						<Tab
							key="CTĐT"
							title={
								<p>
									Chương trình ĐT{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.training_program?.quantity ?? 0})
									</span>
								</p>
							}
						/>
						<Tab
							key="đào tạo, bồi dưỡng"
							title={
								<p>
									Đào tạo - Bồi dưỡng{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.training_fostering?.quantity ?? 0})
									</span>
								</p>
							}
						/>
						<Tab
							key="không xác định/không liên quan"
							title={
								<p>
									Khác{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.unknown?.quantity ?? 0})
									</span>
								</p>
							}
						/>
						<Tab
							key="ĐƠN VỊ"
							title={
								<p>
									Đơn vị{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.unit?.quantity ?? 0})
									</span>
								</p>
							}
						/>
					</Tabs>
				</div>
			) : null}
		</div>
	);
}
