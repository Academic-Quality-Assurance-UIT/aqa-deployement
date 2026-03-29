"use client";

import InfoTab from "@/components/InfoTab";

import ALL_COMMENT_ICON from "@assets/all_comment.svg";
import NEGATIVE_COMMENT_ICON from "@assets/negative_comment.svg";
import POSITIVE_COMMENT_ICON from "@assets/positive_comment.svg";
import NEUTRLA_COMMENT_ICON from "@assets/neutral_comment.svg";

import {
	useCommentQuantityEachTopicQuery,
	useCommentQuantityQuery,
} from "@/gql/graphql";
import { useRememberValue } from "@/hooks/useRememberValue";
import { usePathname, useSearchParams } from "next/navigation";
import { Tab, Tabs } from "@heroui/react";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";

type Props = {
	subject_id?: string | null;
	lecturer_id?: string;
	query: IFilter;
};

export default function CommentQuantityInfo({ query }: Props) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { setUrlQuery } = useFilterUrlQuery();

	const { data: commentQuantity, loading: isLoading } = useCommentQuantityQuery({
		variables: { filter: query },
	});
	const { data: commentQuantityByTopic, loading: isLoadingTopic } =
		useCommentQuantityEachTopicQuery({
			variables: {
				filter: query,
				type: searchParams.get("type") ?? "all",
			},
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
						number={data?.all.quantity}
					/>
					<InfoTab
						type="positive"
						icon={POSITIVE_COMMENT_ICON}
						title="Tích cực"
						isLoading={isLoading}
						number={data?.positive.quantity}
					/>
					<InfoTab
						type="negative"
						icon={NEGATIVE_COMMENT_ICON}
						title="Tiêu cực"
						isLoading={isLoading}
						number={data?.negative.quantity}
					/>
					<InfoTab
						type="neutral"
						icon={NEUTRLA_COMMENT_ICON}
						title="Trung tính"
						isLoading={isLoading}
						number={data?.neutral.quantity}
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
					>
						<Tab key="all" title="Tất cả" />
						<Tab
							key="lecturer"
							title={
								<p>
									Giảng viên{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.lecturer.quantity})
									</span>
								</p>
							}
						/>
						<Tab
							key="training_program"
							title={
								<p>
									Chương trình đào tạo{" "}
									<span className="font-semibold">
										(
										{
											commentQuantityByTopic?.training_program
												.quantity
										}
										)
									</span>
								</p>
							}
						/>
						<Tab
							key="facility"
							title={
								<p>
									Cơ sở vật chất{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.facility.quantity})
									</span>
								</p>
							}
						/>
						<Tab
							key="others"
							title={
								<p>
									Khác{" "}
									<span className="font-semibold">
										({commentQuantityByTopic?.others.quantity})
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
