"use client";

import {
	Lecturer,
	Role,
	useAllLecturersQuery,
	useRegisterUserMutation,
} from "@/gql/graphql";
import {
	Button,
	getKeyValue,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@heroui/react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

const columns = [
	{
		key: "index",
		label: "STT",
	},
	{
		key: "display_name",
		label: "Tên giảng viên",
	},
];

type Props = {
	refetch?: () => any;
};

export default function AddLecturerUser() {
	const [selectedKeys, setSelectedKeys] = useState(new Set([]));
	const [searchText, setSearchText] = useState("");

	const keyword = useDebounce(searchText, 500);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const { data } = useAllLecturersQuery({
		variables: { filter: { keyword }, sort: {} },
		fetchPolicy: "network-only",
	});

	const [mutate] = useRegisterUserMutation();

	const handleAddUser = useCallback(
		async (lecturer: Partial<Lecturer>) => {
			try {
				if (!lecturer.email) return;
				await mutate({
					variables: {
						user: {
							displayName: lecturer.display_name,
							username: lecturer.email,
							lecturerId: lecturer?.lecturer_id,
							role: Role.Lecturer,
							password: uuidv4(),
						},
					},
				});
			} catch (error) {}
		},
		[mutate]
	);

	const handleAddMultipleUser = useCallback(async () => {
		const promise = Promise.all(
			Array.from(selectedKeys.values()).map(async (id) => {
				const lecturer = data?.lecturers.data.find(
					(value) => value.lecturer_id === id
				);
				console.log({ lecturer });
				if (lecturer) await handleAddUser(lecturer);
				return id;
			})
		);
		await toast.promise(promise, {
			loading: "Đang tạo tài khoản...",
			success: "Tạo tài khoản thành công",
			error: "Lỗi tạo tài khoản",
		});
	}, [data?.lecturers.data, handleAddUser, selectedKeys]);

	return (
		<div>
			<Button onClick={onOpen} variant={"flat"} color="primary">
				<p className=" font-semibold">Thêm tài khoản giảng viên</p>
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<p>Thêm tài khoản giảng viên</p>
							</ModalHeader>
							<ModalBody>
								<div className=" max-h-[600px] overflow-auto">
									<Input
										value={searchText}
										onChange={(e) =>
											setSearchText(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												setSearchText(searchText);
												// setIsLoading(true);
											}
										}}
										onClear={() => {
											setSearchText("");
										}}
										isClearable
										type="text"
										size="md"
										placeholder="Nhập tên giảng viên cần tìm..."
										variant="bordered"
										className="w-full mt-4"
									/>
									<Table
										aria-label="Lecturer table"
										selectionMode="multiple"
										selectionBehavior={"toggle"}
										selectedKeys={selectedKeys}
										onSelectionChange={(keys: any) => {
											//@ts-ignore
											setSelectedKeys(keys);
										}}
									>
										<TableHeader columns={columns}>
											{(column) => (
												<TableColumn key={column.key}>
													{column.label}
												</TableColumn>
											)}
										</TableHeader>
										<TableBody
											items={(data?.lecturers.data || []).map(
												(value, index) => ({
													...value,
													index,
												})
											)}
										>
											{(item: any) => (
												<TableRow key={item.lecturer_id}>
													{(columnKey) => (
														<TableCell>
															{getKeyValue(
																item,
																columnKey
															)}
														</TableCell>
													)}
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Đóng
								</Button>
								<Button
									color="primary"
									onPress={async () => {
										await handleAddMultipleUser();
										onClose();
									}}
								>
									Tạo tài khoản
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
