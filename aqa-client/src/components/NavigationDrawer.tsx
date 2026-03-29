"use client";

import { Button, Card, CardBody, Tooltip } from "@heroui/react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	FunctionComponent,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import usePersistentState from "@/hooks/usePersistentState";
import NAV_ICON from "@assets/nav.svg";
import { IoLogInOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import ThemeSwitcher from "./ThemeSwitcher";
import { UICard } from "./UICard";
import { useMediaQuery } from "react-responsive";

export default function NavigationDrawer({ children }: { children?: ReactNode }) {
	const [open, setOpen] = usePersistentState("nav-open", false);

	const toggleDrawer = useCallback(() => {
		setOpen((prev) => !prev);
	}, [setOpen]);

	return (
		<NavigationDrawerContext.Provider value={{ isOpen: open }}>
			<nav className=" z-50 bg-white lg:bg-transparent fixed bottom-0 left-0 lg:relative lg:top-0 lg:left-0 w-screen lg:w-fit lg:h-screen group bg-transparent lg:px-5 lg:pt-12 flex flex-col shadow-large transition-all xl:shadow-none xl:hover:shadow-2xl">
				<div
					className={`bg-card lg:bg-transparent lg:-mt-20 py-1 lg:h-full flex flex-row items-center lg:flex-col gap-0 lg:gap-4 ${
						open ? "justify-center" : "justify-center"
					}`}
				>
					{children}
				</div>
			</nav>
		</NavigationDrawerContext.Provider>
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

	const { isOpen } = useContext(NavigationDrawerContext);
	const [isHover, setIsHover] = useState(false);

	const subRef = useRef<HTMLUListElement>(null);
	const isMobile = useMediaQuery({ maxWidth: 1024 }); // lg breakpoint
	const iconSize = isMobile ? 20 : 24;

	const isSelected =
		pathname.split("/")[1] === link.split("/")[1] ||
		selectedLinks.includes(pathname.split("/")[1]);

	useEffect(() => {
		router.prefetch(link);
	}, [link, router]);

	return (
		<UICard
			className={twMerge(
				"group/nav h-fit w-16 lg:!w-fit transition-all flex flex-shrink flex-col hover:w-32 lg:flex-none !rounded-2xl overflow-hidden ",
				isSelected ? " bg-transparent" : "",
				className
			)}
			onMouseOver={() => setIsHover(true)}
			onMouseLeave={() => setTimeout(() => setIsHover(false), 0)}
		>
			<Tooltip
				placement="right"
				content={
					<div className=" flex flex-col gap-1 px-2 py-1">
						<p className="font-bold">{title}</p>
						{description ? (
							<p className="text-sm">{description}</p>
						) : null}
					</div>
				}
				color="primary"
				offset={20}
			>
				<Card
					isPressable
					onPress={() => router.push(link)}
					className={`rounded-none lg:rounded-2xl h-fit transition-all bg-transparent active:bg-gray-400 hover:bg-gray-300 shadow-sm ${
						isOpen ? "shadow-none" : ""
					} ${isSelected ? " !bg-navbar-selected" : ""}`}
					style={isSelected ? { color: "white" } : {}}
				>
					<CardBody className="flex h-fit p-4 group-hover/nav:p-1 group-active/nav:p-1 lg:!p-4">
						<div
							className={`flex-1 flex flex-row items-start transition-all `}
						>
							<div className="lg:w-[24px] w-full flex flex-col gap-1 items-center lg:grid lg:place-items-center">
								{Icon ? (
									<Icon
										color={isSelected ? "white" : "black"}
										width={iconSize}
										size={iconSize}
									/>
								) : null}
								<div className="group-hover/nav:block group-active/nav:block hidden lg:!hidden">
									<p
										className="font-semibold text-xs text-wrap text-center"
										style={{ maxWidth: "100%" }}
									>
										{title}
									</p>
								</div>
							</div>
							<div
								className={`${
									isOpen ? " ml-2 w-48" : "w-0"
								} h-6 relative overflow-hidden transition-all`}
							>
								<p className="whitespace-nowrap font-semibold text-base h-fit w-fit absolute top-0 left-3 transition-all duration-100`">
									{title}
								</p>
							</div>
						</div>
					</CardBody>
				</Card>
			</Tooltip>
			{/* {subItems ? (
				<div
					className={`  pl-3 ${
						isOpen ? "" : "w-0"
					} overflow-hidden transition-all`}
					style={{
						height:
							isOpen && isHover && subRef?.current
								? subRef.current.getBoundingClientRect().height
								: 0,
					}}
				>
					<ul
						ref={subRef}
						className="pb-3 pl-3 mt-3 w-full list-none border-l-3 border-l-blue-800"
					>
						{subItems?.map(({ title, link }) => (
							<Link href={link} key={link}>
								<li
									className={` my-1 rounded-xl p-2 ${
										pathname === link
											? ""
											: "hover:bg-primary-hover"
									} cursor-pointer transition-all ${
										pathname === link
											? " bg-primary-normal text-black hover:text-black "
											: ""
									}`}
								>
									<p className=" font-semibold text-sm">
										{" "}
										{title}
									</p>
								</li>
							</Link>
						))}
					</ul>
				</div>
			) : null} */}
		</UICard>
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
