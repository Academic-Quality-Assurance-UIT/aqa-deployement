"use client";

import { SemesterSelectorWithSearchParam } from "@/components/selectors/SemesterSelector";

import CommentQuantityInfo from "@/components/comments/CommentQuantityInfo";
import CommentSearchBar from "@/components/comments/CommentSearchBar";
import { FacultySelectorWithSearchParams } from "@/components/selectors/FacultySelector";
import { ProgramSelectorWithSearchParam } from "@/components/selectors/ProgramSelector";
import { SingleSubjectSelectorWithSearchParam } from "@/components/selectors/SingleSubjectSelector";
import { FilterArgs, useCommentListLazyQuery, useProfileQuery } from "@/gql/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Card } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import Loading from "../Loading";
import CommentItem from "./CommentItem";
import { useRememberValue } from "@/hooks/useRememberValue";
import { useFilter } from "@/contexts/FilterContext";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import { useIsLecturer } from "@/hooks/useIsAdmin";
import _ from "lodash";

export default function CommentPage({ defaultFilter = {}, selectors = [] }: IProps) {
	const searchParams = useSearchParams();

	const { data: profile } = useProfileQuery({
		fetchPolicy: "network-only",
	});
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	const { keyword } = useFilter();

	const roleFilter =
		profile?.profile.role === "LECTURER"
			? { lecturer_id: profile?.profile?.lecturer?.lecturer_id }
			: profile?.profile.role === "FACULTY"
			? { faculty_id: profile?.profile?.faculty?.faculty_id }
			: {};

	const query = {
		...defaultFilter,
		keyword,
		semester_id: selectors.includes("semester")
			? searchParams.get("semester")
			: undefined,
		program: selectors.includes("program")
			? searchParams.get("program")
			: undefined,
		faculty_id: selectors.includes("faculty")
			? searchParams.get("faculty")
			: undefined,
		subjects: selectors.includes("single-subject")
			? searchParams.get("subject_id")
				? [searchParams.get("subject_id")]
				: undefined
			: undefined,
		...roleFilter,
	};

	const [getCommentList, { data, loading: isLoading }] = useCommentListLazyQuery({
		fetchPolicy: "network-only",
	});

	const { dataList: comments, bottomRef } = useInfiniteScroll({
		queryFunction: getCommentList,
		variables: {
			filter: query,
			type: searchParams.get("type") ?? ["all"],
			topic: searchParams.get("topic") ?? ["all"],
		},
		isLoading,
		data: data?.comments.data,
		meta: data?.comments.meta,
	});

	const metadata = useRememberValue(data?.comments.meta);

	return (
		<div className="">
			<CommentSearchBar isLoading={!data} />
			<Card className="mt-8 mb-20 w-full p-5">
				<div className="flex flex-col gap-4 items-start ">
					<div className="w-full rounded-none flex flex-row overflow-hidden">
						<CommentQuantityInfo query={query} />
					</div>
					<div className="w-full flex flex-col gap-1">
						<p className=" px-2 font-bold">Các bộ lọc</p>
						<div className=" p-2 lg:p-0 w-full lg:w-fit grid grid-cols-2 lg:flex lg:flex-row gap-3 rounded-lg bg-transparent shadow-lg">
							{selectors.includes("semester") && (
								<SemesterSelectorWithSearchParam />
							)}
							{selectors.includes("program") && (
								<ProgramSelectorWithSearchParam />
							)}
							{selectors.includes("faculty") &&
								!(isFaculty || isLecturer) && (
									<FacultySelectorWithSearchParams />
								)}
							{selectors.includes("single-subject") && (
								<SingleSubjectSelectorWithSearchParam
									defaultFilter={defaultFilter}
								/>
							)}
						</div>
					</div>
				</div>
				<div className=" mt-10 rounded-xl">
					{_.uniqBy(comments, "comment_id").map(
						({
							comment_id,
							display_name,
							type,
							topic,
							type_list,
							class: class_,
						}) => (
							<CommentItem
								key={comment_id}
								content={display_name}
								type={type}
								topic={topic}
								type_list={type_list}
								comment_id={comment_id}
								class_id={class_?.class_id}
								isLast={false}
								classData={class_}
							/>
						)
					)}
				</div>
				{metadata?.hasNext ? <Loading /> : null}
				{!metadata?.hasNext && !isLoading ? (
					<div className="w-full flex flex-col pt-6 pb-4 items-center">
						<p className="w-fit text-lg font-semibold">
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
}
