"use client";

import { Role, useProfileQuery, useGetSettingQuery, useUpdateSettingMutation } from "@/gql/graphql";
import { Button, Input, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineSetting, AiOutlineDatabase, AiOutlineUnorderedList, AiOutlineCodepen } from "react-icons/ai";
import { CrawlManager } from "@/components/admin/CrawlManager";
import { StaffSurveyCriteriaTable } from "@/components/admin/StaffSurveyCriteriaTable";

export default function Page() {
	const router = useRouter();

	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { data: settingData, loading: settingLoading, refetch } = useGetSettingQuery({
		variables: { key: "filter_year" },
		fetchPolicy: "network-only",
	});

	const [updateSetting, { loading: updating }] = useUpdateSettingMutation();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [message, setMessage] = useState("");

	const [filterYear, setFilterYear] = useState("");

	useEffect(() => {
		if (!loading && data?.profile.role !== Role.Admin) {
			router.replace("/signin");
		}
	}, [data, loading, router]);

	useEffect(() => {
		if (settingData?.getSetting?.value) {
			setFilterYear(settingData.getSetting.value);
		}
	}, [settingData]);

	const handleSave = async () => {
		try {
			// Basic validation
			if (!filterYear || isNaN(Number(filterYear)) || Number(filterYear) < 1) {
				setMessage("Vui lòng nhập một số hợp lệ lớn hơn 0.");
				onOpen();
				return;
			}
			await updateSetting({
				variables: {
					key: "filter_year",
					value: filterYear,
				},
			});
			setMessage("Cập nhật cài đặt thành công!");
			onOpen();
			refetch();
		} catch (error: any) {
			console.error(error);
			setMessage("Có lỗi xảy ra khi lưu: " + (error.message || "Unknown error"));
			onOpen();
		}
	};

	return (
		<div className=" flex-1 flex flex-col gap-8">
			<div className="page-header">
				<div className="flex gap-3 items-center">
					<AiOutlineSetting size={24} className="text-gray-600" />
					<h1 className="page-title">
						Cài đặt hệ thống
					</h1>
				</div>
			</div>
            
			<Skeleton
				isLoaded={!settingLoading}
				className="w-full rounded-xl"
			>
				<div className="flex flex-col gap-6 w-full p-6 bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
					<div className="flex flex-col gap-2 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl">
						<h2 className="font-semibold text-lg text-foreground">Giới hạn thời gian truy xuất dữ liệu</h2>
						<p className="text-sm text-gray-500 mb-2">
							Thiết lập số năm gần nhất mà biểu đồ sẽ hiển thị dữ liệu khảo sát. Các năm cũ hơn sẽ bị lược bỏ để tăng hiệu suất.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
							<Input
								value={filterYear}
								onChange={(e) => setFilterYear(e.target.value)}
								type="number"
								size="md"
								min={1}
								placeholder="Ví dụ: 5"
								variant="bordered"
								color="primary"
								labelPlacement="outside"
								className="w-full sm:w-64 bg-background rounded-xl"
								startContent={<span className="text-sm text-gray-400">Năm:</span>}
							/>
						</div>
					</div>
                    
					<div className="flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
						<Button
							color="primary"
							variant="flat"
							onPress={handleSave}
							isLoading={updating}
							isDisabled={!filterYear || filterYear === settingData?.getSetting?.value}
							className="px-8 font-bold"
						>
							Lưu thay đổi
						</Button>
					</div>
				</div>
			</Skeleton>

			<div className="flex flex-col gap-6 w-full p-6 bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
				<div className="flex items-center gap-3 mb-2">
					<AiOutlineCodepen size={24} className="text-gray-600" />
					<h2 className="text-xl font-bold">Phân nhóm tiêu chí</h2>
				</div>
				<div className="flex flex-col gap-2 p-5 bg-gray-50 dark:bg-zinc-900 rounded-xl">
					<p className="text-sm text-gray-500 mb-2">
						Gộp các tiêu chí trùng lặp qua các học kỳ để đồng nhất dữ liệu báo cáo khảo sát sinh viên và cán bộ nhân viên.
					</p>
					<div className="flex justify-start">
						<Button
							color="primary"
							variant="flat"
							onPress={() => router.push("/criteria-mapping")}
							className="font-bold rounded-xl"
						>
							Quản lý phân nhóm
						</Button>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-8 w-full p-6 bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
				<div className="flex items-center gap-3 mb-2">
					<AiOutlineDatabase size={24} className="text-gray-600" />
					<h2 className="text-xl font-bold">Quản lý dữ liệu</h2>
				</div>
				<CrawlManager />
			</div>

			<div className="flex flex-col gap-8 w-full p-6 bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
				<div className="flex items-center gap-3 mb-2">
					<AiOutlineUnorderedList size={24} className="text-gray-600" />
					<h2 className="text-xl font-bold">Tiêu chí khảo sát CBNV</h2>
				</div>
				<StaffSurveyCriteriaTable />
			</div>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
							<ModalBody>
								<p>{message}</p>
							</ModalBody>
							<ModalFooter>
								<Button color="primary" onPress={onClose}>
									Đóng
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
