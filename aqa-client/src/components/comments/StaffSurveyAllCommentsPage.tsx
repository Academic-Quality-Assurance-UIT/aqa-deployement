"use client";

import {
	useGetAllCommentsLazyQuery,
} from "@/gql/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRememberValue } from "@/hooks/useRememberValue";
import { Card, Input, Button, Spinner } from "@heroui/react";
import Loading from "../Loading";
import CommentItem from "./CommentItem";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";

export default function StaffSurveyAllCommentsPage({
	semester,
}: {
	semester?: string;
}) {
	const [keyword, setKeyword] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");

	const [getCommentList, { data, loading: isLoading }] =
		useGetAllCommentsLazyQuery({
			fetchPolicy: "network-only",
		});

	const { dataList: comments, bottomRef } = useInfiniteScroll({
		queryFunction: getCommentList,
		variables: { semester, keyword: searchKeyword },
		isLoading,
		data: data?.getAllComments.data,
		meta: data?.getAllComments.meta,
	});

	const metadata = useRememberValue(data?.getAllComments.meta);

	return (
		<div className="">
			<div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
				<p className="text-xl font-bold text-gray-800">
					Tổng số nhận xét: {data?.getAllComments.meta.total_item ?? 0}
				</p>
				<div className="flex flex-row items-center gap-2 lg:gap-4 w-full md:max-w-xl">
					<Input
						value={keyword}
						onValueChange={setKeyword}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setSearchKeyword(keyword);
							}
						}}
						startContent={<IoIosSearch className="text-gray-400" />}
						onClear={() => {
							setKeyword("");
							setSearchKeyword("");
						}}
						isClearable
						type="text"
						size="md"
						placeholder="Nhập từ khóa cần tìm..."
						variant="bordered"
						className="rounded-xl w-full bg-white"
					/>
					<Button
						onPress={() => {
							if (isLoading) return;
							setSearchKeyword(keyword);
						}}
						disabled={isLoading}
						variant="shadow"
						color="primary"
						size="md"
						className="min-w-[120px]"
					>
						{isLoading ? (
							<Spinner color="white" size="sm" />
						) : (
							<div className="flex gap-2 items-center">
								<AiOutlineSearch size={20} />
								<p className="font-medium">Tìm kiếm</p>
							</div>
						)}
					</Button>
				</div>
			</div>
			<Card className="mt-0 mb-20 w-full p-6 shadow-sm border border-divider">
				<div className=" mt-0 rounded-xl space-y-2">
					{comments.map(({ comment, criteria, point }, i) => (
						<CommentItem
							key={`${comment}-${i}`}
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
				{metadata?.hasNext ? <Loading /> : null}
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
