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
		<div className="flex flex-col gap-4 mt-2 mb-16 px-2 lg:px-20">
			<div className=" my-8 lg:my-16 flex flex-col gap-4 ">
				<h1 className=" w-full text-center text-3xl font-extrabold">
					Chào mừng bạn đến với hệ thống AQA!
				</h1>
				<h2 className=" w-full text-center text-base font-base">
					Hệ thống AQA cung cấp chức năng xem điểm đánh giá và ý kiến phản
					hồi của sinh viên đối với giảng viên, hỗ trợ cải thiện chất lượng
					giảng dạy
				</h2>
			</div>
			<UICard className="w-full p-5 mt-6 flex flex-col gap-2">
				{/* <p className=" text-base font-normal mb-0">Thông tin giảng viên:</p> */}
				<p className=" text-lg lg:text-xl font-extrabold flex gap-4 items-center mb-0">
					{data?.profile.lecturer?.display_name}
					<span className=" text-base font-normal">
						{" "}
						{data?.profile.lecturer?.email}
					</span>
				</p>
				{isLecturer && (
					<p className=" text-base font-base italic flex gap-2 items-center">
						Giảng viên
					</p>
				)}
				{isFaculty && (
					<p className=" text-base font-base italic flex gap-2 items-center">
						Cán bộ quản lý khoa
						<span className=" font-semibold">
							{data?.profile.faculty?.display_name}
						</span>
					</p>
				)}
				{isFullAcess && !isAdmin && (
					<p className=" text-base font-base italic flex gap-4 items-center">
						Cán bộ quản lý nhà trường
					</p>
				)}
				{isAdmin && (
					<p className=" text-base font-base italic flex gap-4 items-center">
						Admin
					</p>
				)}
			</UICard>
		</div>
	);
}
