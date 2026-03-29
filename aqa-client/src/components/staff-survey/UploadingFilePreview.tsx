"use client";

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Pagination,
} from "@heroui/react";
import { useMemo, useState } from "react";

type PropTypes = {
	data: any[];
} & Pick<React.ComponentPropsWithoutRef<"div">, "className">;

export default function UploadingFilePreview({ data, className }: PropTypes) {
	const columns = data[0];
	const rows = data.slice(1);

	const [page, setPage] = useState(1);
	const rowsPerPage = 5;

	const pages = Math.ceil(rows.length / rowsPerPage);

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return rows.slice(start, end);
	}, [page, rows]);

	return (
		<div className={className}>
			<Table aria-label="Example static collection table">
				<TableHeader>
					{columns.map((column: string, index: number) => (
						<TableColumn key={index}>{column}</TableColumn>
					))}
				</TableHeader>
				<TableBody items={items}>
					{(item) => (
						<TableRow key={JSON.stringify(item)}>
							{item.map((cell: any, cellIndex: number) => (
								<TableCell key={cellIndex}>
									{cell ?? <p className=" text-gray-400">Empty</p>}
								</TableCell>
							))}
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className=" mt-4 flex w-full justify-center">
				<Pagination
					isCompact
					showControls
					showShadow
					color="secondary"
					page={page}
					total={pages}
					onChange={(page) => setPage(page)}
				/>
			</div>
		</div>
	);
}
