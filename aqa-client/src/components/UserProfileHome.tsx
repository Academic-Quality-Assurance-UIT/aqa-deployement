"use client";

import { useProfileQuery } from "@/gql/graphql";
import { useIsAdmin, useIsFullAccess, useIsLecturer } from "@/hooks/useIsAdmin";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import { UICard } from "./UICard";

export default function UserProfileHome() {
	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { isFullAcess } = useIsFullAccess();
	const { isAdmin } = useIsAdmin();
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	return (
		<div className="flex flex-col gap-4 mb-8">
			<UICard className="w-full p-5 flex flex-col gap-2">
				<p className="text-lg lg:text-xl font-bold flex gap-4 items-center mb-0 text-gray-900">
					{data?.profile.lecturer?.display_name}
					<span className="text-sm font-normal text-gray-500">
						{" "}
						{data?.profile.lecturer?.email}
					</span>
				</p>
				{isLecturer && (
					<p className="text-sm font-normal italic flex gap-2 items-center text-gray-500">
						Giảng viên
					</p>
				)}
				{isFaculty && (
					<p className="text-sm font-normal italic flex gap-2 items-center text-gray-500">
						Cán bộ quản lý khoa
						<span className="font-semibold text-gray-700">
							{data?.profile.faculty?.display_name}
						</span>
					</p>
				)}
				{isFullAcess && !isAdmin && (
					<p className="text-sm font-normal italic flex gap-4 items-center text-gray-500">
						Cán bộ quản lý nhà trường
					</p>
				)}
				{isAdmin && (
					<p className="text-sm font-normal italic flex gap-4 items-center text-gray-500">
						Admin
					</p>
				)}
			</UICard>
		</div>
	);
}
