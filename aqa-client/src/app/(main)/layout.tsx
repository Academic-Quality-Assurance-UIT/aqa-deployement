"use client";

import { AuthenticationNavigating } from "@/components/AuthenticationNavigating";
import NavigationDrawer, { NavItem, NavSectionHeader, NavGroup } from "@/components/NavigationDrawer";
import { useProfileQuery } from "@/gql/graphql";
import { useIsAdmin, useIsFullAccess, useIsLecturer } from "@/hooks/useIsAdmin";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import PageTransition from "@/components/PageTransition";
import { Suspense } from "react";
import {
	AiOutlineCodepen,
	AiOutlineComment,
	AiOutlineHome,
	AiOutlinePieChart,
	AiOutlineSolution,
	AiOutlineUser,
	AiOutlineSetting,
	AiOutlineBank,
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
				<NavGroup label="Tổng quan" icon={AiOutlineHome}>
					<NavItem
						title="Trang chủ"
						description="Tổng quan về dữ liệu"
						link="/"
						icon={AiOutlineHome}
					/>
					<NavItem
						title="Xếp hạng giảng viên"
						description="Bảng xếp hạng giảng viên"
						link="/lecturer-ranking"
						icon={AiOutlinePieChart}
					/>
				</NavGroup>
				
				<NavGroup label="KS môn học" icon={AiOutlineComment}>
					<NavItem
						title="Ý kiến"
						description="Ý kiến của sinh viên"
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
				</NavGroup>

				{isFullAcess || isAdmin || true ? (
					<NavGroup label="KS CBNV" icon={AiOutlineSolution}>
						<NavItem
							title="Điểm các tiêu chí"
							link="/staff-survey"
							icon={AiOutlineSolution}
						/>
						<NavItem
							title="Các khoa/ bộ môn"
							link="/staff-survey-units"
							icon={AiOutlineSolution}
						/>
						<NavItem
							title="Tất cả nhận xét"
							link="/staff-survey-comments"
							icon={AiOutlineSolution}
						/>
					</NavGroup>
				) : null}

				{isAdmin ? (
					<NavGroup label="Hệ thống" icon={AiOutlineSetting}>
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
					</NavGroup>
				) : null}
			</NavigationDrawer>
			<main className="w-full h-screen overflow-y-auto px-6 lg:px-10 pt-6 pb-24 lg:pt-8 lg:pb-16 overflow-x-hidden custom-scrollbar">
				<PageTransition>
					<Suspense fallback={<p>Loading</p>}>{children}</Suspense>
				</PageTransition>
			</main>
		</div>
	);
}
