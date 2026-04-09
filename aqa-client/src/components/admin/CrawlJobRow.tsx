"use client";

import { CrawlJob, CrawlJobStatus, CrawlJobType } from "@/gql/graphql";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AiOutlineClockCircle, AiOutlineRight } from "react-icons/ai";
import { ReactNode, useMemo } from "react";
import { Chip } from "@heroui/react";

interface CrawlJobRowProps {
	title: string;
	description: string;
	icon: ReactNode;
	latestJob?: CrawlJob;
	onClick?: () => void;
	hideChevron?: boolean;
}

export const CrawlJobRow = ({
	title,
	description,
	icon,
	latestJob,
	onClick,
	hideChevron = false,
}: CrawlJobRowProps) => {
	const progress = useMemo(() => {
		if (!latestJob?.total_data || latestJob?.total_data === 0) return 0;
		const p = Math.round(((latestJob?.progress ?? 0) / latestJob.total_data) * 100);
		return Math.min(p, 100);
	}, [latestJob?.progress, latestJob?.total_data]);

	const getStatusChip = (status: CrawlJobStatus | undefined) => {
		switch (status) {
			case CrawlJobStatus.Running:
				return (
					<Chip color="warning" variant="dot" size="sm">
						Đang chạy ({progress}%)
					</Chip>
				);
			case CrawlJobStatus.Confirming:
				return (
					<Chip color="success" variant="dot" size="sm">
						Đang lưu DB ({progress}%)
					</Chip>
				);
			case CrawlJobStatus.Completed:
				return (
					<Chip color="primary" variant="flat" size="sm">
						Chờ xác nhận
					</Chip>
				);
			case CrawlJobStatus.Confirmed:
				return (
					<Chip color="success" variant="flat" size="sm">
						Đã xác nhận
					</Chip>
				);
			case CrawlJobStatus.Failed:
				return (
					<Chip color="danger" variant="flat" size="sm">
						Lỗi
					</Chip>
				);
			case CrawlJobStatus.Abandoned:
				return (
					<Chip color="default" variant="flat" size="sm">
						Đã hủy
					</Chip>
				);
			default:
				return (
					<Chip variant="flat" size="sm">
						Sẵn sàng
					</Chip>
				);
		}
	};

	return (
		<div
			onClick={onClick}
			className={`group flex items-center gap-4 p-4 transition-all border border-transparent ${
				onClick
					? "hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-2xl cursor-pointer hover:border-gray-200 dark:hover:border-zinc-700"
					: ""
			}`}
		>
			<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 text-gray-600 dark:text-gray-400 group-hover:text-primary group-hover:border-primary/20 transition-colors">
				{icon}
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-0.5">
					<h3 className="font-bold text-foreground truncate flex items-center gap-2">
						{title}
						{(latestJob?.status === CrawlJobStatus.Running || latestJob?.status === CrawlJobStatus.Confirming) && (
							<span className="text-primary text-sm font-mono animate-pulse">
								{progress}%
							</span>
						)}
					</h3>
					{getStatusChip(latestJob?.status)}
				</div>
				<p className="text-sm text-gray-500 line-clamp-1">
					{description}
				</p>
				{latestJob && (
					<div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
						<AiOutlineClockCircle size={12} />
						<span>Chạy lần cuối:</span>
						<span>
							{format(
								new Date(latestJob.started_at),
								"HH:mm dd/MM/yyyy",
								{ locale: vi }
							)}
						</span>
					</div>
				)}
			</div>

			{!hideChevron && (
				<div className="flex-shrink-0 text-gray-300 group-hover:text-primary transition-colors">
					<AiOutlineRight size={20} />
				</div>
			)}
		</div>
	);
};
