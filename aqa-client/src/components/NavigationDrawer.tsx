"use client";

import { Tooltip, Avatar } from "@heroui/react";

import { usePathname, useRouter } from "next/navigation";
import {
	FunctionComponent,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import usePersistentState from "@/hooks/usePersistentState";
import { IoLogOutOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useMediaQuery } from "react-responsive";
import { useProfileQuery } from "@/gql/graphql";

export default function NavigationDrawer({ children }: { children?: ReactNode }) {
	const [open, setOpen] = usePersistentState("nav-open", true);
	const isMobile = useMediaQuery({ maxWidth: 1024 });

	const toggleDrawer = useCallback(() => {
		setOpen((prev) => !prev);
	}, [setOpen]);

	return (
		<NavigationDrawerContext.Provider value={{ isOpen: open }}>
			{/* Mobile bottom nav */}
			{isMobile ? (
				<nav className="z-50 bg-white fixed bottom-0 left-0 w-screen border-t border-gray-200 shadow-lg">
					<div className="bg-white py-1 flex flex-row items-center justify-center gap-0">
						<MobileContext.Provider value={true}>
							{children}
						</MobileContext.Provider>
					</div>
				</nav>
			) : (
				/* Desktop: single text sidebar */
				<div className="flex flex-row h-screen flex-shrink-0 relative">
					<div
						className={`sidebar-text-panel flex flex-col h-full transition-sidebar overflow-hidden ${open ? "w-[260px]" : "w-0 border-0"}`}
					>
						{/* Header with brand + toggle */}
						<div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
							<div className="flex items-center gap-2.5">
								<div className="w-8 h-8 rounded-lg bg-navbar-selected flex items-center justify-center">
									<span className="text-white font-bold text-xs">A</span>
								</div>
								<span className="font-semibold text-sm text-gray-800">AQA System</span>
							</div>
							<button
								onClick={toggleDrawer}
								className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
							>
								<IoChevronBackOutline size={14} />
							</button>
						</div>

						{/* Navigation items */}
						<div className="flex-1 flex flex-col overflow-y-auto py-3">
							{children}
						</div>

						{/* User profile at bottom */}
						<SidebarUserProfile />
					</div>

					{/* Collapsed expand button */}
					{!open && (
						<button
							onClick={toggleDrawer}
							className="absolute left-2 top-4 z-10 w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-400 shadow-sm transition-colors"
						>
							<IoChevronForwardOutline size={14} />
						</button>
					)}
				</div>
			)}
		</NavigationDrawerContext.Provider>
	);
}

function SidebarUserProfile() {
	const { data } = useProfileQuery({ fetchPolicy: "cache-first" });
	const router = useRouter();

	const displayName = data?.profile?.lecturer?.display_name || data?.profile?.username || "User";
	const roleLabel = data?.profile?.role === "ADMIN" ? "Admin" : data?.profile?.role === "FULL_ACCESS" ? "Quản lý" : data?.profile?.role === "FACULTY" ? "Cán bộ khoa" : "Giảng viên";

	return (
		<div className="border-t border-gray-100 p-3">
			<div className="flex items-center gap-3 px-2 py-2">
				<Avatar
					name={displayName.charAt(0)}
					size="sm"
					className="bg-gray-200 text-gray-600 flex-shrink-0"
				/>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
					<p className="text-xs text-gray-400 truncate">{roleLabel}</p>
				</div>
			</div>
			<button
				onClick={() => router.push("/sign-out")}
				className="sidebar-nav-item w-full mt-1 text-gray-500 hover:text-red-600 hover:bg-red-50"
			>
				<IoLogOutOutline size={18} />
				<span className="text-sm">Đăng xuất</span>
			</button>
		</div>
	);
}

// Context for mobile bottom nav rendering
const MobileContext = createContext(false);

export function NavSectionHeader({ label }: { label: string }) {
	const isMobile = useContext(MobileContext);

	if (isMobile) return null;

	return <div className="sidebar-section-label">{label}</div>;
}

export function NavItem({
	title,
	description,
	link,
	icon: Icon,
	subItems,
	selectedLinks = [],
	className,
}: INavItemProps) {
	const pathname = usePathname();
	const router = useRouter();
	const isMobileCtx = useContext(MobileContext);
	const isMobile = useMediaQuery({ maxWidth: 1024 });
	const iconSize = isMobile ? 20 : 18;

	const isSelected =
		pathname === link ||
		pathname.split("/")[1] === link.split("/")[1] ||
		selectedLinks.includes(pathname.split("/")[1]);

	useEffect(() => {
		router.prefetch(link);
	}, [link, router]);

	// Mobile bottom bar
	if (isMobileCtx) {
		return (
			<Tooltip placement="top" content={title} color="primary">
				<button
					onClick={() => router.push(link)}
					className={twMerge(
						"flex flex-col items-center justify-center w-16 py-2 rounded-xl transition-all",
						isSelected ? "bg-navbar-selected text-white" : "text-gray-500 hover:bg-gray-100",
						className
					)}
				>
					{Icon && (
						<Icon
							color={isSelected ? "white" : "#6b7280"}
							width={iconSize}
							size={iconSize}
						/>
					)}
					<span className={twMerge(
						"text-[10px] mt-1 font-medium",
						isSelected ? "text-white" : "text-gray-500"
					)}>{title.length > 6 ? title.substring(0, 6) + ".." : title}</span>
				</button>
			</Tooltip>
		);
	}

	// Desktop: text sidebar nav item
	return (
		<Tooltip
			placement="right"
			content={
				<div className="flex flex-col gap-0.5 px-1 py-0.5">
					<p className="font-medium text-xs">{title}</p>
					{description ? <p className="text-xs opacity-80">{description}</p> : null}
				</div>
			}
			color="primary"
			offset={12}
		>
			<button
				onClick={() => router.push(link)}
				className={twMerge(
					"sidebar-nav-item block",
					isSelected ? "active" : "",
					className
				)}
			>
				{Icon && (
					<Icon
						color={isSelected ? "white" : "#6b7280"}
						width={iconSize}
						size={iconSize}
					/>
				)}
				<span className="truncate">{title}</span>
			</button>
		</Tooltip>
	);
}

const NavigationDrawerContext = createContext({ isOpen: false });

export type INavigationDrawerContext = {
	isOpen: boolean;
};

export type INavItemProps = INavItem & {
	icon?: FunctionComponent<{ width?: number; size?: number; color: string }>;
	selectedLinks?: string[];
	subItems?: INavItem[];
} & Pick<React.ComponentProps<"div">, "className">;

export type INavItem = {
	title: string;
	description?: string;
	link: string;
};
