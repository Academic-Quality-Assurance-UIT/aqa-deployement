"use client";

import { AuthenticationNavigating } from "@/components/AuthenticationNavigating";
import NavigationDrawer, { NavItem } from "@/components/NavigationDrawer";
import { useProfileQuery } from "@/gql/graphql";
import { useIsAdmin, useIsFullAccess, useIsLecturer } from "@/hooks/useIsAdmin";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import { Suspense } from "react";
import {
	AiOutlineCodepen,
	AiOutlineComment,
	AiOutlineHome,
	AiOutlinePieChart,
	AiOutlineSolution,
	AiOutlineUser,
} from "react-icons/ai";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { isFullAcess } = useIsFullAccess();
	const { isAdmin } = useIsAdmin();
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	return (
		<div className=" w-screen h-screen flex flex-col-reverse lg:flex-row">
			<Suspense fallback={<div></div>}>
				<AuthenticationNavigating data={data} loading={loading} />
			</Suspense>
			<NavigationDrawer>
				<NavItem
					title="Trang chủ"
					description="Tổng quan về dữ liệu"
					link="/"
					icon={AiOutlineHome}
				/>
				<NavItem
					title="Ý kiến"
					description="Ý kiến của sinh viên về giảng viên"
					link="/comment"
					icon={AiOutlineComment}
					subItems={[
						{
							title: "Tất cả",
							link: "/comment",
						},
						{
							title: "Tích cực",
							link: "/comment?type=positive",
						},
						{
							title: "Tiêu cực",
							link: "/comment?type=negative",
						},
					]}
				/>
				{isFullAcess || isFaculty ? (
					<NavItem
						title="Tra cứu dữ liệu"
						link="/criteria"
						selectedLinks={[
							"class",
							"faculty",
							"lecturer",
							"semester",
							"subject",
						]}
						icon={AiOutlinePieChart}
					/>
				) : isLecturer ? (
					<NavItem
						title="Tra cứu dữ liệu"
						link={`/lecturer/${data?.profile.lecturer?.lecturer_id}`}
						icon={AiOutlinePieChart}
					/>
				) : null}
				{isFullAcess || isAdmin || true ? (
					<NavItem
						title="Khảo sát giảng viên"
						link="/staff-survey"
						icon={AiOutlineSolution}
					/>
				) : null}
				{/* {isFullAcess || isAdmin ? (
					<NavItem
						title="Tạo biểu đồ bằng AI"
						link="/ai-generate"
						icon={AiOutlineCodepen}
					/>
				) : null} */}
				{isAdmin ? (
					<NavItem
						title="Quản lý tài khoản"
						link="/user"
						icon={AiOutlineUser}
					/>
				) : null}
			</NavigationDrawer>
			<main className="w-full h-screen overflow-y-auto xl:px-20 px-4 lg:px-16 lg:pl-12 pt-6 pb-24 lg:pt-12 lg:pb-10 overflow-x-hidden">
				<Suspense fallback={<p>Loading</p>}>{children}</Suspense>
			</main>
		</div>
	);
}
