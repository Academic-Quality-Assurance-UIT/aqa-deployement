"use client";

import { useFilter } from "@/contexts/FilterContext";
import { Button, Input, Spinner } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";

export default function CommentSearchBar({ isLoading }: { isLoading: boolean }) {
	const { setKeyword } = useFilter();

	const searchParams = useSearchParams();

	const [searchText, setSearchText] = useState(searchParams.get("keyword") || "");

	const keyword = searchParams.get("keyword") || "";
	useEffect(() => {
		setSearchText(keyword);
	}, [keyword]);

	return (
		<div className="flex flex-row items-center mt-8 gap-2 lg:gap-5">
			<Input
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						setKeyword(searchText);
					}
				}}
				startContent={<IoIosSearch />}
				onClear={() => {
					setSearchText("");
					setKeyword("");
				}}
				isClearable
				type="text"
				size="md"
				placeholder="Nhập từ khóa cần tìm..."
				variant="bordered"
				className=" rounded-xl w-full bg-white"
			/>
			<Button
				onPress={() => {
					if (searchText == "" || isLoading) return;
					setKeyword(searchText);
				}}
				disabled={isLoading}
				className=""
				variant="shadow"
				color="primary"
				size="md"
			>
				{isLoading ? (
					<Spinner color="success" size={"sm"} />
				) : (
					<div className=" px-3 flex gap-2 items-center">
						<AiOutlineSearch size={20} />
						<p className=" font-medium">Tìm kiếm</p>
					</div>
				)}
			</Button>
		</div>
	);
}
