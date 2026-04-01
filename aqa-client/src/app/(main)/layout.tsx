"use client";

import { AuthenticationNavigating } from "@/components/AuthenticationNavigating";
import NavigationDrawer, { NavItem, NavSectionHeader } from "@/components/NavigationDrawer";
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
	AiOutlineSetting,
} from "react-icons/ai";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { isFullAcess } = useIsFullAccess();
	const { isAdmin } = useIsAdmin();
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	return (
		<div className="w-screen h-screen flex flex-col-reverse lg:flex-row bg-page-bg">
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
				<NavSectionHeader label="Khảo sát môn học" />
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
					<>
						<NavSectionHeader label="Khảo sát CBNV" />
						<NavItem
							title="Điểm các tiêu chí"
							link="/staff-survey"
							icon={AiOutlineSolution}
						/>
						<NavItem
							title="Các khoa/ bộ môn"
							link="/staff-survey/units"
							icon={AiOutlineSolution}
						/>
						<NavItem
							title="Tất cả nhận xét"
							link="/staff-survey/comments"
							icon={AiOutlineSolution}
						/>
					</>
				) : null}

				{isAdmin ? (
					<>
						<NavSectionHeader label="Hệ thống" />
						<NavItem
							title="Quản lý tài khoản"
							link="/user"
							icon={AiOutlineUser}
						/>
						<NavItem
							title="Cài đặt chung"
							link="/admin-settings"
							icon={AiOutlineSetting}
						/>
					</>
				) : null}
			</NavigationDrawer>
			<main className="w-full h-screen overflow-y-auto px-6 lg:px-12 xl:px-16 pt-8 pb-24 lg:pt-10 lg:pb-16 overflow-x-hidden">
				<Suspense fallback={<p>Loading</p>}>{children}</Suspense>
			</main>
		</div>
	);
}
