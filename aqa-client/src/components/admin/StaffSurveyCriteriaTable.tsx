"use client";

import {
	useGetStaffSurveyCriteriaListQuery,
	useUpdateStaffSurveyCriteriaMutation,
} from "@/gql/graphql";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Switch,
	Spinner,
} from "@heroui/react";
import { toast } from "react-hot-toast";

export const StaffSurveyCriteriaTable = () => {
	const { data, loading, refetch } = useGetStaffSurveyCriteriaListQuery({
		fetchPolicy: "network-only",
	});

	const [updateCriteria, { loading: isUpdating }] =
		useUpdateStaffSurveyCriteriaMutation();

	const handleToggle = async (id: string, currentStatus: boolean) => {
		try {
			await updateCriteria({
				variables: {
					id,
					is_shown: !currentStatus,
				},
			});
			toast.success("Cập nhật trạng thái thành công");
			refetch();
		} catch (error) {
			console.error(error);
			toast.error("Có lỗi xảy ra khi cập nhật");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center p-10">
				<Spinner label="Đang tải danh sách tiêu chí..." />
			</div>
		);
	}

	const criteriaList = data?.getCriteriaList || [];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1 px-1">
				<h2 className="text-lg font-bold text-foreground">
					Quản lý hiển thị tiêu chí khảo sát
				</h2>
				<p className="text-sm text-gray-500">
					Bật/tắt các tiêu chí để quyết định tiêu chí nào sẽ được tính điểm và
					hiển thị trên biểu đồ Dashboard.
				</p>
			</div>

			<Table
				aria-label="Staff Survey Criteria Table"
				classNames={{
					base: "max_h-[600px] overflow_y_auto",
					table: "min-w-[600px]",
					wrapper: "shadow-none border border-gray-100 dark:border-gray-800 p-0",
					th: "bg-gray-50 dark:bg-zinc-900 text-gray-600 font-bold",
				}}
			>
				<TableHeader>
					<TableColumn width={80}>STT</TableColumn>
					<TableColumn>DANH MỤC</TableColumn>
					<TableColumn>TÊN TIÊU CHÍ</TableColumn>
					<TableColumn width={150} align="center">
						HIỂN THỊ
					</TableColumn>
				</TableHeader>
				<TableBody emptyContent={"Không có dữ liệu tiêu chí."}>
					{criteriaList.map((item, index) => (
						<TableRow
							key={item.staff_survey_criteria_id}
							className="border-b border-gray-50 dark:border-zinc-800 last:border-0"
						>
							<TableCell>{(item.index ?? index) + 1}</TableCell>
							<TableCell>
								<span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-bold uppercase">
									{item.category}
								</span>
							</TableCell>
							<TableCell className="max-w-md truncate">
								{item.display_name}
							</TableCell>
							<TableCell>
								<div className="flex justify-center">
									<Switch
										isSelected={item.is_shown}
										onValueChange={() =>
											handleToggle(item.staff_survey_criteria_id, !!item.is_shown)
										}
										size="sm"
										isDisabled={isUpdating}
									/>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
