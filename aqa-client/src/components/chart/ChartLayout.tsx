"use client";

import BaseChart from "@components/chart/BaseChart";
import { Button } from "@heroui/react";
import { Color, Legend } from "@tremor/react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineCloudDownload, AiOutlineSetting } from "react-icons/ai";
import MediaQuery, { useMediaQuery } from "react-responsive";
import Extensible from "../Extensible";

import { FcComboChart } from "react-icons/fc";

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/react";
import { utils, writeFile } from "xlsx";
// @ts-ignore
import domtoimage from "dom-to-image";
//@ts-ignore
import domToPdf from "dom-to-pdf";

export default function ChartLayout({
	primaryTitle,
	secondaryTitle,
	columnSize = 60,
	columnNum = 0,
	legends,
	colors,
	handlerButtons,
	children,
	exportChart,
	isFullWidth = false,
	height,
	showLegend = false,
	exportData,
	exportColumns,
	filterDisplay,
}: {
	primaryTitle?: string | ReactNode;
	secondaryTitle?: string;
	columnSize?: number;
	columnNum?: number;
	legends: string[];
	colors: Color[];
	handlerButtons: ReactNode;
	children: ReactNode;
	exportChart?: ReactNode;
	isFullWidth?: boolean;
	height?: number;
	showLegend?: boolean;
	exportData?: Record<string, any>[];
	exportColumns?: { key: string; label: string }[];
	filterDisplay?: { label: string; value?: string | null }[];
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const pdfContainerRef = useRef<HTMLDivElement>(null);
	const hiddenChartRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [containerWidth, setContainerWidth] = useState(0);

	const { isOpen: open, onOpen, onOpenChange } = useDisclosure();

	const isMobile = useMediaQuery({ maxWidth: 1024 });

	useEffect(() => {
		const currentWidth = containerRef?.current?.getBoundingClientRect().width;
		if (currentWidth && currentWidth != 0) {
			setContainerWidth(
				containerRef?.current?.getBoundingClientRect().width || 0
			);
		}
	}, []);

	const width: string | number = useMemo(() => {
		if (isFullWidth) return "100%";
		if (columnNum > 0) {
			return Math.max(columnNum * columnSize, containerWidth);
		}
		return "100%";
	}, [columnNum, columnSize, isFullWidth, containerWidth]);

	return (
		<BaseChart height={height}>
			<div className=" h-full flex-shrink-0">
				<Extensible isOpen={isOpen} setIsOpen={setIsOpen}>
					<div className="w-full px-2 lg:px-8">
						<div className="  w-full mb-2 pl-2 pr-0 pt-5 flex flex-col lg:flex-row gap-1 lg:gap-5 justify-between items-start xl:items-center">
							<div className=" lg:w-3/4 mt-2 flex gap-2">
								<FcComboChart className=" mt-0" size={24} />
								<div>
									<p className=" text-foreground-900 font-bold text-xl">
										{primaryTitle}
									</p>
									<p className="w-full mt-2 font-normal text-sm">
										{secondaryTitle}
									</p>
								</div>
							</div>
							<div className="w-fit flex flex-row flex-nowrap gap-4 pr-5 pl-6 lg:pl-0">
								<MediaQuery maxWidth={1280}>
									<Button
										variant="solid"
										color="primary"
										onPress={onOpen}
										size={"sm"}
									>
										<AiOutlineSetting size={16} />
										<p className=" font-semibold">Tùy chọn</p>
									</Button>
									<Modal isOpen={open} onOpenChange={onOpenChange}>
										<ModalContent>
											{(onClose) => (
												<>
													<ModalHeader className="flex flex-col gap-1">
														Chọn các tùy chỉnh cho biểu đồ
													</ModalHeader>
													<ModalBody>
														{handlerButtons}
													</ModalBody>
													<ModalFooter>
														<Button
															color="danger"
															variant="light"
															onPress={onClose}
														>
															Đóng
														</Button>
													</ModalFooter>
												</>
											)}
										</ModalContent>
									</Modal>
								</MediaQuery>
								<MediaQuery minWidth={1280}>{handlerButtons}</MediaQuery>
								<Dropdown>
									<DropdownTrigger>
										<Button
											isIconOnly
											color="primary"
											className="w-fit px-3"
											size={isMobile ? "sm" : "md"}
											variant={isMobile ? "flat" : "solid"}
										>
											<div className="flex gap-1 items-center">
												<AiOutlineCloudDownload
													size={isMobile ? 18 : 24}
													color="black"
												/>
												{isMobile ? (
													<p className="text-xs font-semibold text-black">
														Tải xuống
													</p>
												) : null}
											</div>
										</Button>
									</DropdownTrigger>
									<DropdownMenu aria-label="Export Actions">
										<DropdownItem
											key="image"
											onPress={() => {
												if (hiddenChartRef.current) {
													domtoimage
														.toJpeg(hiddenChartRef.current, {
															quality: 0.95,
															bgcolor: "white",
														})
														.then(function (dataUrl: string) {
															var link = document.createElement("a");
															link.download = `chart.jpeg`;
															link.href = dataUrl;
															link.click();
														});
												}
											}}
										>
											Tải ảnh (JPEG)
										</DropdownItem>
										<DropdownItem
											key="excel"
											onPress={() => {
												if (exportData && exportColumns) {
													const worksheet = utils.json_to_sheet(
														[
															exportColumns.reduce(
																(acc, col) => ({
																	...acc,
																	[col.key]: col.label,
																}),
																{}
															),
															...exportData,
														],
														{ skipHeader: true }
													);
													const workbook = utils.book_new();
													utils.book_append_sheet(
														workbook,
														worksheet,
														"Data"
													);
													writeFile(
														workbook,
														`chart-data.xlsx`
													);
												}
											}}
										>
											Tải Excel (.xlsx)
										</DropdownItem>
										<DropdownItem
											key="pdf"
											onPress={() => {
												if (pdfContainerRef.current) {
													domToPdf(
														pdfContainerRef.current,
														{
															filename: `chart-document.pdf`,
															overrideWidth: 1400,
															compression: "SLOW",
														},
														() => { }
													);
												}
											}}
										>
											Tải PDF
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
					</div>
					<div
						ref={containerRef}
						className=" relative h-full w-full overflow-x-auto overflow-y-hidden flex flex-col justify-stretch flex-grow"
					>
						{showLegend ? (
							<Legend
								className=" w-full px-10"
								categories={legends}
								colors={colors}
							/>
						) : null}
						<div className=" relative pb-5 h-full w-full overflow-x-auto flex flex-col justify-stretch flex-grow">
							<div
								id="chart"
								className=" pt-1 pb-2 pr-2 lg:pr-4 lg:pl-4 flex flex-col flex-grow"
								style={{ width }}
							>
								{children}
							</div>
						</div>
					</div>
				</Extensible>
			</div>

			<div className="fixed w-[1400px] h-[1000px] -z-10 bg-white">
				{/* Hidden Chart for Export */}
				<div
					ref={hiddenChartRef}
					className=" w-full h-[600px] p-10 bg-white"
				>
					{exportChart ?? children}
				</div>

				{/* Hidden Container for PDF Export */}
				<div
					ref={pdfContainerRef}
					className=" w-full h-full p-10 bg-white"
				>
					<div className="flex flex-col gap-4">
						<h1 className="text-2xl font-bold">{primaryTitle}</h1>
						{secondaryTitle && (
							<h2 className="text-lg text-gray-600">{secondaryTitle}</h2>
						)}

						{filterDisplay && filterDisplay.length > 0 && (
							<div className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
								<h3 className="font-semibold mb-2">Thông tin lọc:</h3>
								<div className="w-1/2 grid grid-cols-2 gap-2">
									{filterDisplay.map((filter, index) => (
										<div key={index} className="flex gap-2">
											<span className="font-medium text-gray-700">
												{filter.label}:
											</span>
											<span>{filter.value}</span>
										</div>
									))}
								</div>
							</div>
						)}

						<div className=" w-full h-[400px] mt-4">
							{exportChart ?? children}
						</div>
					</div>
				</div>
			</div>
		</BaseChart>
	);
}
