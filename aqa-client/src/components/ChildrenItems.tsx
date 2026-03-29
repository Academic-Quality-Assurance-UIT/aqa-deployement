"use client";

import { Button } from "@heroui/react";
import Loading from "./Loading";
import NoData from "./NoData";
import EmptyDataMessage from "./EmptyDataMessage";
import { usePathname } from "next/navigation";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { useDisplayNameOfUrlFilter } from "@/hooks/useDisplayNameOfUrlFilter";
import { AiOutlineClose } from "react-icons/ai";
import _ from "lodash";

type Props = {
	items: {
		display_name: string;
		value: string;
		onClick: (value: string) => any;
	}[];
	isSort?: boolean;
	loading?: boolean;
	isDisplayIndex?: boolean;
};

export default function ChildrenItems({
	items,
	loading,
	isSort = true,
	isDisplayIndex,
}: Props) {
	const pathName = usePathname();
	const { setUrlQuery } = useFilterUrlQuery();
	const currentFilter = useDisplayNameOfUrlFilter();

	const currentTab = pathName.split("/")[0];
	const currentTabFilter = currentFilter.find(
		(filter) => filter.link == currentTab
	);

	return (
		<div className=" flex-1 py-6 flex flex-col items-start gap-4">
			{loading !== false ? (
				<Loading />
			) : items.length > 1 ||
			  (items.length === 1 && items.at(0)?.value !== "all") ? (
				<>
					<Button
						variant={"shadow"}
						color={"primary"}
						onPress={() =>
							items.find((v) => v.value === "all")?.onClick?.("all")
						}
						className=" w-full"
					>
						<p className=" text-start font-semibold">
							{items.find((v) => v.value === "all")?.display_name}
						</p>
					</Button>
					<div className=" border-1 border-foreground-300 w-full flex flex-col rounded-xl overflow-hidden">
						{[...items]
							.sort((a, b) =>
								isSort
									? a.display_name < b.display_name
										? -1
										: 1
									: 0
							)
							.filter((v) => v.value !== "all")
							.map(({ display_name, value, onClick }, index) => (
								<div
									key={display_name}
									className="px-4 py-3 border-b-1 border-foreground-300 bg-background cursor-pointer hover:bg-foreground-100 duration-200 active:bg-foreground-200"
									onClick={() => onClick(value)}
								>
									<p className=" text-start font-semibold">
										{`${
											isDisplayIndex ? `${index + 1}. ` : ""
										}${display_name}`}
									</p>
								</div>
							))}
					</div>
				</>
			) : (
				<EmptyDataMessage
					reason={
						<div className=" flex flex-col items-center gap-6">
							<p className=" w-full text-center font-medium text-foreground-400">
								Không tìm thấy dữ liệu cho bộ lọc hiện tại
							</p>
							<div className=" max-w-sm px-6 py-4 rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col gap-1">
								<p className=" mb-3 font-semibold text-gray-600">
									Bộ lọc hiện tại
								</p>
								{currentFilter?.map((filter) => (
									<div
										key={filter.link}
										className=" flex flex-grow items-center gap-1"
									>
										<p className=" flex-none w-24 text-gray-600">
											{filter.title}
										</p>
										<p className=" font-semibold">
											{filter.name}
										</p>
										<Button
											variant={"flat"}
											className=" -mr-2 flex-none ml-auto p-0"
											isIconOnly
											onPress={() =>
												setUrlQuery(
													pathName,
													filter.defaultValue
												)
											}
										>
											<AiOutlineClose size={14} />
										</Button>
									</div>
								))}
								<Button
									variant={"shadow"}
									color={"primary"}
									className=" mt-5"
									onPress={() =>
										setUrlQuery(pathName, {
											criteria_id: "",
											semester_id: "",
											faculty_id: "",
											subjects: undefined,
											lecturer_id: "",
											program: "",
											class_type: "",
											class_id: "",
											[currentTabFilter?.field ?? ""]:
												currentTabFilter?.value,
										})
									}
								>
									<p className=" text-start font-semibold">
										Xóa bộ lọc
									</p>
								</Button>
							</div>
						</div>
					}
				/>
			)}
		</div>
	);
}
