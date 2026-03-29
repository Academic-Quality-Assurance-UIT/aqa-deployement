"use client";

import { ReactNode } from "react";

type Props = {
	reason?: ReactNode;
};

export default function EmptyDataMessage({ reason }: Props) {
	return (
		<div className=" flex flex-col gap-2 w-full px-4 lg:p-14 bg-foreground-100 rounded-xl">
			<p className=" w-full text-center text-lg font-semibold  text-foreground-900">
				Không có dữ liệu
			</p>
			{reason}
		</div>
	);
}
