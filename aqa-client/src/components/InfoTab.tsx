"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import useNavigate from "@/hooks/useNavigate";
import { Card, Spinner } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function InfoTab({
	icon,
	title,
	type,
	number,
	isLoading,
}: {
	icon: string;
	title: string;
	type: string;
	number?: number;
	isLoading: boolean;
	defaultChecked?: boolean;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { setUrlQuery } = useFilterUrlQuery();

	return (
		<Card radius="none" shadow="none" isPressable className=" flex-none lg:flex-none">
			<label
				htmlFor={title}
				className=" w-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer transition-all rounded-md pt-2"
				onClick={() => {
					setUrlQuery(pathname, {}, { type: [type] });
				}}
			>
				<input
					id={title}
					name="comment_tab"
					className="peer hidden"
					type="radio"
					checked={
						searchParams.get("type") === type ||
						(type === "all" && !searchParams.has("type"))
					}
					onChange={() => {}}
				/>
				<div className="px-2 lg:px-4 grid place-items-center lg:place-items-start">
					<div className="flex flex-row items-start gap-2 pr-5 ">
						<Image src={icon} width={15} height={15} alt="icon" />
						<p className="text-sm font-medium text-gray-500 dark:text-gray-300">
							{title}
						</p>
					</div>
					<div className="">
						{number === undefined ? (
							<Spinner className="mt-2 w-fit" />
						) : (
							<p className="text-xl lg:text-2xl font-bold mt-2 pr-1 lg:pr-5 text-start">
								{number.toLocaleString("en-US") || 0}
							</p>
						)}
					</div>
				</div>
				<div className="w-full h-1 mt-1 bg-transparent peer-checked:bg-sky-900 transition-all" />
			</label>
		</Card>
	);
}
