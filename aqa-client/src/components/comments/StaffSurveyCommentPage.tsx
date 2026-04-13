"use client";

import CommentSearchBar from "@/components/comments/CommentSearchBar";
import {
	FilterArgs,
	useGetPointWithCommentByCriteriaLazyQuery,
} from "@/gql/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRememberValue } from "@/hooks/useRememberValue";
import { Card } from "@heroui/react";
import Loading from "../Loading";
import CommentItem from "./CommentItem";

export default function StaffSurveyCommentPage({
	defaultFilter = {},
	selectors = [],
	category,
	semester,
	displayName,
}: IProps) {
	const [getCommentList, { data, loading: isLoading }] =
		useGetPointWithCommentByCriteriaLazyQuery();

	const { dataList: comments, bottomRef } = useInfiniteScroll({
		queryFunction: getCommentList,
		variables: { category, semester, displayName },
		isLoading,
		data: data?.getPointWithCommentByCriteria.data,
		meta: data?.getPointWithCommentByCriteria.meta,
	});

	const metadata = useRememberValue(data?.getPointWithCommentByCriteria.meta);

	return (
		<div className="">
			<Card className="mt-0 mb-20 w-full p-5">
				<div className=" mt-0 rounded-xl">
					{comments.map(({ comment, criteria, index, point }, i) => (
						<CommentItem
							key={comment}
							content={comment ?? ""}
							type={"neutral"}
							type_list={[]}
							topic={""}
							comment_id={comment ?? i.toString()}
							isLast={false}
							clickable={false}
							secondary={
								<p className="font-medium text-sm text-left whitespace-pre-wrap	text-gray-400">
									Tiêu chí{" "}
									<span className=" text-gray-500">
										{criteria}
									</span>{" "}
									- Điểm:{" "}
									<span className="font-bold text-gray-500">
										{point?.toFixed(2) ?? "N/A"}
									</span>
								</p>
							}
						/>
					))}
				</div>
				{metadata?.hasNext && isLoading ? <Loading /> : null}
				{!metadata?.hasNext && !isLoading ? (
					<div className="w-full flex flex-col pt-6 pb-4 items-center">
						<p className="w-fit text-base font-semibold">
							Không còn ý kiến nào
						</p>
					</div>
				) : null}
				<div ref={bottomRef} key={"bottom-comment"} />
			</Card>
		</div>
	);
}

interface IProps {
	defaultFilter?: FilterArgs;
	selectors?: SelectorType[];
	category: string;
	semester?: string;
	displayName?: string;
}

