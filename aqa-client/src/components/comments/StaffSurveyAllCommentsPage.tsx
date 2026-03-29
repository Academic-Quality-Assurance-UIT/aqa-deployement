"use client";

import {
	useGetAllCommentsLazyQuery,
	useGetPointsByCategoryDonViQuery,
} from "@/gql/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRememberValue } from "@/hooks/useRememberValue";
import { Card, Input, Button, Spinner } from "@heroui/react";
import Loading from "../Loading";
import CommentItem from "./CommentItem";
import { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineDownload } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import * as XLSX from "xlsx";

export default function StaffSurveyAllCommentsPage({
	semester,
}: {
	semester?: string;
}) {
	const [keyword, setKeyword] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");

	const [getCommentList, { data, loading: isLoading }] =
		useGetAllCommentsLazyQuery({
			fetchPolicy: "network-only",
		});

	const { dataList: comments, bottomRef } = useInfiniteScroll({
		queryFunction: getCommentList,
		variables: { semester, keyword: searchKeyword },
		isLoading,
		data: data?.getAllComments.data,
		meta: data?.getAllComments.meta,
	});

	const metadata = useRememberValue(data?.getAllComments.meta);

	const [isExporting, setIsExporting] = useState(false);

	const { data: unitPoints } = useGetPointsByCategoryDonViQuery({
		variables: { semester },
		fetchPolicy: "network-only",
	});

	const [getExportCommentList] = useGetAllCommentsLazyQuery({
		fetchPolicy: "no-cache",
	});

	const handleExportExcel = async () => {
		setIsExporting(true);
		try {
			let allData: any[] = [];
			let page = 0;
			let hasNext = true;

			const units = unitPoints?.getPointsByCategoryDonVi.map(u => u.category) || [];

			while (hasNext) {
				const res = await getExportCommentList({
					variables: { semester, keyword: searchKeyword, page },
				});
				const resData = res.data?.getAllComments.data || [];
				const meta = res.data?.getAllComments.meta;
				
				allData = [...allData, ...resData];
				
				if (meta && meta.hasNext) {
					hasNext = true;
					page++;
				} else {
					hasNext = false;
				}
			}

			const excelData = allData.map(item => {
				const isUnit = units.includes(item.criteria || "");
				return {
					"Nhận xét": item.comment || "",
					"Tiêu chí": isUnit ? "" : (item.criteria || ""),
					"Đơn vị": isUnit ? (item.criteria || "") : "",
				};
			});

			const worksheet = XLSX.utils.json_to_sheet(excelData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Tất cả nhận xét");

			const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
			const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
            
            const safeSemester = semester ? semester.replace(/[<>:"\/\\|?*]/g, "-") : "";
			link.download = `Tat_ca_nhan_xet${safeSemester ? `_${safeSemester}` : ""}.xlsx`;
			
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Export failed", error);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="">
			<div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
				<p className="text-xl font-bold text-gray-800">
					Tổng số nhận xét: {data?.getAllComments.meta.total_item ?? 0}
				</p>
				<div className="flex flex-row items-center gap-2 lg:gap-4 w-full md:max-w-2xl">
					<Input
						value={keyword}
						onValueChange={setKeyword}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setSearchKeyword(keyword);
							}
						}}
						startContent={<IoIosSearch className="text-gray-400" />}
						onClear={() => {
							setKeyword("");
							setSearchKeyword("");
						}}
						isClearable
						type="text"
						size="md"
						placeholder="Nhập từ khóa cần tìm..."
						variant="bordered"
						className="rounded-xl w-full bg-white"
					/>
					<Button
						onPress={() => {
							if (isLoading) return;
							setSearchKeyword(keyword);
						}}
						disabled={isLoading}
						variant="shadow"
						color="primary"
						size="md"
						className="min-w-[120px]"
					>
						{isLoading ? (
							<Spinner color="white" size="sm" />
						) : (
							<div className="flex gap-2 items-center">
								<AiOutlineSearch size={20} />
								<p className="font-medium">Tìm kiếm</p>
							</div>
						)}
					</Button>
					<Button
						onPress={handleExportExcel}
						disabled={isExporting}
						variant="shadow"
						color="success"
						size="md"
						className="min-w-[140px] text-white"
					>
						{isExporting ? (
							<Spinner color="white" size="sm" />
						) : (
							<div className="flex gap-2 items-center">
								<AiOutlineDownload size={20} />
								<p className="font-medium">Xuất Excel</p>
							</div>
						)}
					</Button>
				</div>
			</div>
			<Card className="mt-0 mb-20 w-full p-6 shadow-sm border border-divider">
				<div className=" mt-0 rounded-xl space-y-2">
					{comments.map(({ comment, criteria, point }, i) => (
						<CommentItem
							key={`${comment}-${i}`}
							content={comment ?? ""}
							type={"neutral"}
							type_list={[]}
							topic={""}
							comment_id={comment ?? i.toString()}
							isLast={false}
							clickable={false}
							secondary={
								<p className="font-medium text-sm text-left whitespace-pre-wrap	text-gray-400">
									Tiêu chí{" "}
									<span className=" text-gray-500">
										{criteria}
									</span>{" "}
									- Điểm:{" "}
									<span className="font-bold text-gray-500">
										{point?.toFixed(2) ?? "N/A"}
									</span>
								</p>
							}
						/>
					))}
				</div>
				{metadata?.hasNext ? <Loading /> : null}
				{!metadata?.hasNext && !isLoading ? (
					<div className="w-full flex flex-col pt-6 pb-4 items-center">
						<p className="w-fit text-base font-semibold">
							Không còn ý kiến nào
						</p>
					</div>
				) : null}
				<div ref={bottomRef} key={"bottom-comment"} />
			</Card>
		</div>
	);
}
