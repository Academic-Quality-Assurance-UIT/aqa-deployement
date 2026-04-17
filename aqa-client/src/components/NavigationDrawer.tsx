"use client";

import { Tooltip, Avatar, Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

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
						className={`sidebar-text-panel flex flex-col h-full transition-sidebar overflow-hidden ${open ? "w-[var(--sidebar-text-width)]" : "w-0 border-0"}`}
					>
						{/* Header with brand + toggle */}
						<div className="flex flex-col items-start gap-2 px-6 py-8">
							<span
								className="text-base text-primary select-none cursor-pointer hover:opacity-80 transition-opacity"
								style={{ fontFamily: "'Pacifico', cursive" }}
								onClick={() => router.push("/")}
							>
								UIT - AQA
							</span>
							<span className="text-xs text-primary transition-opacity">Hệ thống trực quan hóa dữ liệu khảo sát</span>
						</div>

						{/* Navigation items */}
						<div className="flex-1 flex flex-col overflow-y-auto py-2 custom-scrollbar">
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
		<div className="border-t border-gray-100 p-3 bg-primary-light/30">
			<div className="flex items-center gap-2.5 px-1.5 py-1.5 mb-1.5">
				<Avatar
					name={displayName.charAt(0)}
					size="sm"
					className="w-7 h-7 bg-primary text-white flex-shrink-0 font-bold text-[10px]"
				/>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-bold text-primary-dark truncate">{displayName}</p>
					<p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider truncate">{roleLabel}</p>
				</div>
			</div>
			<button
				onClick={() => router.push("/sign-out")}
				className="sidebar-nav-item w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
			>
				<IoLogOutOutline size={16} />
				<span className="text-xs font-semibold">Đăng xuất</span>
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

export function NavGroup({ label, icon: Icon, children }: { label?: string; icon?: any; children: ReactNode }) {
	const isMobile = useContext(MobileContext);
	const pathname = usePathname();
	const isMobileView = useMediaQuery({ maxWidth: 1024 });

	if (isMobile) {
		return (
			<Popover placement="top" showArrow offset={20} classNames={{
				content: "p-0 min-w-[220px] bg-white shadow-2xl border border-slate-100 rounded-2xl overflow-hidden"
			}}>
				<PopoverTrigger>
					<button
						className={twMerge(
							"flex flex-col items-center justify-center w-20 px-2 py-2 rounded-xl transition-all outline-none",
							"text-slate-400 hover:bg-slate-50 active:scale-95"
						)}
					>
						{Icon && (
							<Icon
								size={22}
							/>
						)}
						<span className="text-[10px] mt-1 font-bold tracking-tight opacity-80 whitespace-nowrap">{label || "Menu"}</span>
					</button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="w-full flex flex-col p-2">
						{label && (
							<div className="px-4 py-2 border-b border-slate-50 mb-1">
								<p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{label}</p>
							</div>
						)}
						<div className="flex flex-col gap-1">
							{children}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<div className="flex flex-col">
			{label && <NavSectionHeader label={label} />}
			{children}
		</div>
	);
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

	// Mobile bottom bar / Popover Item
	if (isMobileCtx) {
		return (
			<button
				onClick={() => router.push(link)}
				className={twMerge(
					"w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:bg-primary-light/50 text-left",
					isSelected ? "bg-primary-light text-primary font-bold shadow-sm shadow-primary/10" : "text-slate-600 hover:bg-slate-50"
				)}
			>
				{Icon && (
					<div className={twMerge(
						"flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
						isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
					)}>
						<Icon size={18} />
					</div>
				)}
				<div className="flex flex-col min-w-0">
					<span className="text-sm truncate">{title}</span>
					{description && <span className="text-[10px] opacity-60 font-medium truncate">{description}</span>}
				</div>
			</button>
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
