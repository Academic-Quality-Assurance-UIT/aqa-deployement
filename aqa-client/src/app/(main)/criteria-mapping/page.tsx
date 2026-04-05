"use client";

import React, { useState, useMemo } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Input,
	Chip,
	Tooltip,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Checkbox,
	Selection,
	Tab,
	Tabs,
	Card,
	CardBody,
	Divider,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Breadcrumbs,
	BreadcrumbItem,
} from "@heroui/react";
import {
	AiOutlinePlus,
	AiOutlineSearch,
	AiOutlineLink,
	AiOutlineSafety,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineInfoCircle,
} from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import {
	useGetCriteriaMappingsQuery,
	useGetAutoMappingSuggestionsQuery,
	useCreateCriteriaMappingMutation,
	useUpdateCriteriaMappingMutation,
	useDeleteCriteriaMappingMutation,
	useMapCriteriaToGroupMutation,
	useUnmapCriteriaMutation,
	useConfirmAutoMappingMutation,
	useCriteriasQuery,
	useGetStaffSurveyCriteriaListQuery,
	AutoMappingSuggestionInput,
} from "@/gql/graphql";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CriteriaMappingPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<string>("mappings");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

	// Modals
	const {
		isOpen: isCreateOpen,
		onOpen: onCreateOpen,
		onOpenChange: onCreateOpenChange,
	} = useDisclosure();
	const {
		isOpen: isAutoOpen,
		onOpen: onAutoOpen,
		onOpenChange: onAutoOpenChange,
	} = useDisclosure();
	
	const [newMappingName, setNewMappingName] = useState("");
	const [editingMapping, setEditingMapping] = useState<{ id: string; name: string } | null>(null);

	// Queries
	const { data: mappingsData, refetch: refetchMappings } = useGetCriteriaMappingsQuery();
	const { data: suggestionsData, refetch: refetchSuggestions } = useGetAutoMappingSuggestionsQuery();
	const { data: regularCriteriaData, refetch: refetchRegularList } = useCriteriasQuery({
		variables: { pagination: { page: 0, size: 1000 } } as any,
	});
	const { data: staffCriteriaData, refetch: refetchStaffList } = useGetStaffSurveyCriteriaListQuery();

	// Mutations
	const [createMapping] = useCreateCriteriaMappingMutation();
	const [updateMapping] = useUpdateCriteriaMappingMutation();
	const [deleteMapping] = useDeleteCriteriaMappingMutation();
	const [mapCriteria] = useMapCriteriaToGroupMutation();
	const [unmapCriteria] = useUnmapCriteriaMutation();
	const [confirmAutoMapping] = useConfirmAutoMappingMutation();

	const handleCreateMapping = async () => {
		if (!newMappingName) return;
		try {
			await createMapping({ variables: { display_name: newMappingName } });
			toast.success("Đã tạo nhóm tiêu chí mới");
			setNewMappingName("");
			onCreateOpenChange();
			refetchMappings();
		} catch (e) {
			toast.error("Lỗi khi tạo nhóm tiêu chí");
		}
	};

	const handleDeleteMapping = async (id: string) => {
		if (confirm("Bạn có chắc chắn muốn xóa nhóm này?")) {
			try {
				await deleteMapping({ variables: { id } });
				toast.success("Đã xóa nhóm tiêu chí");
				refetchMappings();
			} catch (e) {
				toast.error("Lỗi khi xóa nhóm tiêu chí");
			}
		}
	};

	const handleConfirmAutoMapping = async () => {
		if (!suggestionsData?.getAutoMappingSuggestions) return;
		try {
			// Convert to input format
			const suggestions: AutoMappingSuggestionInput[] = suggestionsData.getAutoMappingSuggestions.map(s => ({
				display_name: s.display_name,
				criteriaIds: s.criteriaIds,
				staffSurveyCriteriaIds: s.staffSurveyCriteriaIds,
			}));
			
			await confirmAutoMapping({ variables: { suggestions } });
			toast.success("Đã tự động gộp các tiêu chí trùng tên");
			onAutoOpenChange();
			refetchMappings();
			refetchSuggestions();
		} catch (e) {
			toast.error("Lỗi khi tự động gộp");
		}
	};

	const handleMapToGroup = async (mappingId: string) => {
		const selectedIds = Array.from(selectedKeys) as string[];
		if (selectedIds.length === 0) return;

		const regularIds = selectedIds.filter(id => id.startsWith('reg:')).map(id => id.replace('reg:', ''));
		const staffIds = selectedIds.filter(id => id.startsWith('staff:')).map(id => id.replace('staff:', ''));

		try {
			const promises = [];
			if (regularIds.length > 0) {
				promises.push(mapCriteria({ variables: { mappingId, criteriaIds: regularIds, type: 'regular' } }));
			}
			if (staffIds.length > 0) {
				promises.push(mapCriteria({ variables: { mappingId, criteriaIds: staffIds, type: 'staff_survey' } }));
			}
			
			await Promise.all(promises);
			toast.success("Đã thêm vào nhóm");
			setSelectedKeys(new Set());
			refetchMappings();
			refetchStaffList();
			refetchRegularList();
		} catch (e) {
			toast.error("Lỗi khi thêm vào nhóm");
		}
	};

	const handleUnmap = async (criteriaId: string, type: 'regular' | 'staff_survey') => {
		try {
			await unmapCriteria({ variables: { criteriaIds: [criteriaId], type } });
			toast.success("Đã hủy gộp tiêu chí");
			refetchMappings();
			refetchStaffList();
			refetchRegularList();
		} catch (e) {
			toast.error("Lỗi khi hủy gộp");
		}
	};

	const combinedUnmappedCriteria = useMemo(() => {
		const regular = ((regularCriteriaData?.criterias?.data || []) as any[])
			.filter(c => !c.mapping_id)
			.map(c => ({
				id: `reg:${c.criteria_id}`,
				originalId: c.criteria_id,
				display_name: c.display_name,
				category: null,
				semesters: (c as any).semester_id ? [(c as any).semester_id] : [],
				type: 'regular' as const
			}));

		const staff = (staffCriteriaData?.getCriteriaList || [])
			.filter(c => !c.mapping_id)
			.map(c => ({
				id: `staff:${c.staff_survey_criteria_id}`,
				originalId: c.staff_survey_criteria_id,
				display_name: c.display_name,
				category: c.category,
				semesters: c.semesters,
				type: 'staff_survey' as const
			}));

		return [...regular, ...staff].filter(c => 
			searchQuery === "" || c.display_name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [regularCriteriaData, staffCriteriaData, searchQuery]);

	return (
		<div className="flex flex-col gap-6">
			{/* BREADCRUMBS */}
			<div className="mb-4">
				<Breadcrumbs
					variant="light"
					size="sm"
					classNames={{
						list: "bg-white dark:bg-zinc-800/50 p-2 px-4 rounded-xl shadow-sm border border-divider/50",
					}}
				>
					<BreadcrumbItem onPress={() => router.push("/admin-settings")}>
						Cài đặt hệ thống
					</BreadcrumbItem>
					<BreadcrumbItem className="font-bold text-primary">
						Phân nhóm tiêu chí
					</BreadcrumbItem>
				</Breadcrumbs>
			</div>

			{/* PAGE HEADER */}
			<div className="page-header flex flex-col justify-start !items-start gap-4 mb-4">
				<Button
					variant="flat"
					color="primary"
					size="sm"
					onPress={() => router.push("/admin-settings")}
					startContent={<IoArrowBackOutline size={18} />}
					className="font-bold rounded-xl"
				>
					Quay lại
				</Button>
				<h1 className="page-title !text-3xl">
					Phân nhóm tiêu chí
				</h1>
				<p className="text-gray-500 !mt-0">Gộp các tiêu chí trùng lặp qua các học kỳ để đồng nhất dữ liệu</p>
			</div>

			<div className="flex justify-end items-center -mb-2">
				<div className="flex gap-2">
					<Button 
						color="primary" 
						variant="flat" 
						startContent={<AiOutlineSafety />}
						onPress={onAutoOpen}
					>
						Tự động gộp
					</Button>
					<Button 
						color="primary" 
						startContent={<AiOutlinePlus />}
						onPress={onCreateOpen}
					>
						Tạo nhóm mới
					</Button>
				</div>
			</div>

			<Tabs 
				aria-label="Mapping options" 
				selectedKey={activeTab} 
				onSelectionChange={(key) => setActiveTab(key as string)}
				variant="underlined"
				classNames={{
					tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
					cursor: "w-full bg-[#17C964]",
					tab: "max-w-fit px-0 h-12",
					tabContent: "group-data-[selected=true]:text-[#17C964]"
				}}
			>
				<Tab key="mappings" title="Danh sách nhóm đã gộp" />
				<Tab key="unmapped" title="Tiêu chí chưa gộp" />
			</Tabs>

			{activeTab === "mappings" && (
				<div className="grid grid-cols-1 gap-4">
					{(mappingsData?.getCriteriaMappings || []).map(mapping => (
						<Card key={mapping.id} className="border-none shadow-sm bg-white">
							<CardBody className="p-6">
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-xl font-bold text-gray-800">{mapping.display_name}</h3>
										<div className="flex gap-2 mt-2">
											<Chip size="sm" variant="flat" color="secondary">
												{(mapping.criteria?.length || 0) + (mapping.staffSurveyCriteria?.length || 0)} tiêu chí
											</Chip>
										</div>
									</div>
									<div className="flex gap-1">
										<Tooltip content="Sửa tên nhóm">
											<Button isIconOnly variant="light" size="sm">
												<AiOutlineEdit className="text-lg" />
											</Button>
										</Tooltip>
										<Tooltip content="Xóa nhóm" color="danger">
											<Button isIconOnly variant="light" size="sm" color="danger" onPress={() => handleDeleteMapping(mapping.id)}>
												<AiOutlineDelete className="text-lg" />
											</Button>
										</Tooltip>
									</div>
								</div>
								
								<div className="space-y-4">
									{mapping.criteria && mapping.criteria.length > 0 && (
										<div>
											<p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Khảo sát sinh viên</p>
											<div className="flex flex-wrap gap-2">
												{mapping.criteria.map(c => (
													<Chip 
														key={c.criteria_id} 
														variant="bordered" 
														onClose={() => handleUnmap(c.criteria_id, 'regular')}
														className="max-w-[400px]"
													>
														<span className="truncate">{c.display_name}</span>
														<span className="ml-1 text-gray-400">({c.semester_id})</span>
													</Chip>
												))}
											</div>
										</div>
									)}

									{mapping.staffSurveyCriteria && mapping.staffSurveyCriteria.length > 0 && (
										<div>
											<p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Khảo sát cán bộ</p>
											<div className="flex flex-wrap gap-2">
												{mapping.staffSurveyCriteria.map(c => (
													<Chip 
														key={c.staff_survey_criteria_id} 
														variant="bordered" 
														onClose={() => handleUnmap(c.staff_survey_criteria_id, 'staff_survey')}
														className="max-w-[400px]"
													>
														<span className="truncate">{c.display_name}</span>
														<span className="ml-1 text-gray-400">({c.category})</span>
													</Chip>
												))}
											</div>
										</div>
									)}
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			)}

			{activeTab === "unmapped" && (
				<div className="flex flex-col gap-4">
					<Input
						placeholder="Tìm kiếm tiêu chí..."
						startContent={<AiOutlineSearch className="text-gray-400" />}
						value={searchQuery}
						onValueChange={setSearchQuery}
						className="max-w-md"
					/>
					
					<Table 
						aria-label="Unmapped Criteria"
						selectionMode="multiple"
						selectedKeys={selectedKeys}
						onSelectionChange={setSelectedKeys}
						bottomContent={
							<div className="flex w-full justify-end gap-2 p-2">
								{Array.from(selectedKeys).length > 0 && (
									<Dropdown>
										<DropdownTrigger>
											<Button color="primary" variant="flat" endContent={<AiOutlineLink />}>
												Gộp {Array.from(selectedKeys).length} mục vào nhóm
											</Button>
										</DropdownTrigger>
										<DropdownMenu aria-label="Mapping Groups">
											{(mappingsData?.getCriteriaMappings || []).map(m => (
												<DropdownItem key={m.id} onPress={() => handleMapToGroup(m.id)}>
													{m.display_name}
												</DropdownItem>
											))}
										</DropdownMenu>
									</Dropdown>
								)}
							</div>
						}
					>
						<TableHeader>
							<TableColumn>Tên hiển thị</TableColumn>
							<TableColumn>Loại</TableColumn>
							<TableColumn>Danh mục</TableColumn>
							<TableColumn>Học kỳ</TableColumn>
						</TableHeader>
						<TableBody>
							{combinedUnmappedCriteria.map(criteria => (
								<TableRow key={criteria.id}>
									<TableCell className="font-medium">{criteria.display_name}</TableCell>
									<TableCell>
										<Chip size="sm" color={criteria.type === 'regular' ? 'primary' : 'success'} variant="flat">
											{criteria.type === 'regular' ? 'SV' : 'CBNV'}
										</Chip>
									</TableCell>
									<TableCell>{criteria.category || <span className="text-gray-300">-</span>}</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{criteria.semesters.map(s => (
												<Chip key={s} size="sm" variant="flat">{s}</Chip>
											))}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Create Mapping Modal */}
			<Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Tạo nhóm tiêu chí mới</ModalHeader>
							<ModalBody>
								<Input
									label="Tên hiển thị thống nhất"
									placeholder="Nhập tên mới..."
									value={newMappingName}
									onValueChange={setNewMappingName}
									autoFocus
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>Hủy</Button>
								<Button color="primary" onPress={handleCreateMapping}>Tạo</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Auto Map Preview Modal */}
			<Modal isOpen={isAutoOpen} onOpenChange={onAutoOpenChange} size="3xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Tự động gộp theo tên trùng khớp</ModalHeader>
							<ModalBody>
								<p className="text-sm text-gray-500 mb-4">
									Hệ thống tìm thấy <strong>{suggestionsData?.getAutoMappingSuggestions.length || 0}</strong> nhóm tiêu chí có tên hiển thị hoàn toàn giống nhau.
								</p>
								<div className="max-h-[400px] overflow-y-auto">
									<Table aria-label="Auto Mapping Suggestions" isHeaderSticky>
										<TableHeader>
											<TableColumn>Tên thống nhất</TableColumn>
											<TableColumn>Số lượng tiêu chí gộp</TableColumn>
											<TableColumn>Các học kỳ liên quan</TableColumn>
										</TableHeader>
										<TableBody>
											{(suggestionsData?.getAutoMappingSuggestions || []).map((s, idx) => (
												<TableRow key={idx}>
													<TableCell className="font-bold">{s.display_name}</TableCell>
													<TableCell>{s.criteriaIds.length + s.staffSurveyCriteriaIds.length}</TableCell>
													<TableCell>
														<div className="flex flex-wrap gap-1">
															{s.semesters.slice(0, 3).map(sem => (
																<Chip key={sem} size="sm" variant="flat">{sem}</Chip>
															))}
															{s.semesters.length > 3 && (
																<Chip size="sm" variant="flat">+{s.semesters.length - 3}</Chip>
															)}
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>Đóng</Button>
								<Button color="success" className="text-white" onPress={handleConfirmAutoMapping}>
									Xác nhận gộp tất cả
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

		</div>
	);
}
