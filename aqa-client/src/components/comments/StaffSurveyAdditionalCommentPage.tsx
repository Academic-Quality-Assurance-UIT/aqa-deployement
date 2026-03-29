"use client";

import { useGetAdditionalCommentsQuery } from "@/gql/graphql";
import { Card } from "@heroui/react";
import Loading from "../Loading";
import CommentItem from "./CommentItem";

export default function StaffSurveyAdditionalCommentPage({
	semester,
}: {
	semester?: string;
}) {
	const { data, loading: isLoading } = useGetAdditionalCommentsQuery({
		variables: { semester },
		fetchPolicy: "network-only",
	}) as any;

	const comments = (data?.getAdditionalComments ?? []) as any[];

	return (
		<div className="">
			<Card className="mt-0 mb-20 w-full p-5 shadow-none border-none">
				<div className="flex justify-between items-center mb-4 px-2">
					<h3 className="text-lg font-bold text-gray-700">Ý kiến đóng góp khác</h3>
					{!isLoading && (
						<div className="px-3 py-1 bg-gray-100 rounded-full">
							<span className="text-sm font-semibold text-gray-500">
								Tổng cộng: {comments.length}
							</span>
						</div>
					)}
				</div>
				<div className=" mt-0 rounded-xl">
					{comments.map(({ additional_comment, display_name, faculty }: any, i: number) => (
						<CommentItem
							key={`${display_name}-${i}`}
							content={additional_comment ?? ""}
							type={"neutral"}
							type_list={[]}
							topic={""}
							comment_id={i.toString()}
							isLast={false}
							clickable={false}
							// secondary={
							// 	<p className="font-medium text-sm text-left whitespace-pre-wrap text-gray-400">
							// 		Khoa/Bộ môn: <span className=" font-semibold">{faculty || "N/A"}</span>
							// 	</p>
							// }
						/>
					))}
				</div>
				{isLoading ? <Loading /> : null}
				{!isLoading && comments.length === 0 ? (
					<div className="w-full flex flex-col pt-6 pb-4 items-center">
						<p className="w-fit text-lg font-semibold">
							Không còn ý kiến nào
						</p>
					</div>
				) : null}
			</Card>
		</div>
	);
}
