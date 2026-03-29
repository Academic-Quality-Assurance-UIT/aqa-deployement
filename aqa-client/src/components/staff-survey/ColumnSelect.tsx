import { Select, SelectItem } from "@heroui/react";
import { Key } from "react";

export function ColumnSelect({
	columns,
	label,
	value,
	onChange,
	title = "Chọn cột dữ liệu",
}: {
	columns: string[];
	label: string;
	value?: string;
	onChange?: (value: string) => void;
	title?: string;
}) {
	return (
		<div className="flex items-center gap-4">
			<label className="w-1/3">{label}</label>
			<Select
				className="max-w-[600px]"
                size="sm"
				label={title}
				selectedKeys={[value as Key]}
				onChange={(e) => onChange?.(e.target.value)}
			>
				{columns?.map((column) => (
					<SelectItem key={column}>{column}</SelectItem>
				))}
			</Select>
		</div>
	);
}
