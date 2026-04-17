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
			<div className="w-full p-8 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-xl shadow-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
				{/* Decorative background element */}
				<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
				
				<div className="relative z-10">
					<p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-1">
						Chào mừng trở lại,
					</p>
					<h2 className="text-3xl font-black font-display tracking-tight flex flex-wrap items-baseline gap-3">
						{data?.profile.lecturer?.display_name || data?.profile.username}
						<span className="text-sm font-medium text-white/60 lowercase tracking-normal font-sans">
							{data?.profile.lecturer?.email || ""}
						</span>
					</h2>
					<div className="mt-4 flex flex-wrap gap-2">
						{isLecturer && (
							<span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
								Giảng viên
							</span>
						)}
						{isFaculty && (
							<span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
								Quản lý khoa: {data?.profile.faculty?.display_name}
							</span>
						)}
						{isFullAcess && !isAdmin && (
							<span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
								Cán bộ quản lý nhà trường
							</span>
						)}
						{isAdmin && (
							<span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
								Quản trị viên hệ thống
							</span>
						)}
					</div>
				</div>

				<div className="relative z-10 flex flex-col items-end">
					<div className="text-right">
						<p className="text-xs font-bold text-white/70 uppercase tracking-widest">Hệ thống</p>
						<p className="text-xl font-black font-display">AQA v2.0</p>
					</div>
				</div>
			</div>
		</div>
	);
}
