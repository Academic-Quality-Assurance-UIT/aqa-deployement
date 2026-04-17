"use client";

import { Class } from "@/gql/graphql";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { DeepPartial } from "@apollo/client/utilities";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { IoCopyOutline, IoEllipsisVertical } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import CommentModalItem from "./CommentModalItem";

const TOPIC_MAP = {
	lecturer: "Giảng viên",
	training_program: "Chương trình đào tạo",
	facility: "Cơ sở vật chất",
	others: "Khác",
	// Staff survey topics
	"môi trường/điều kiện làm việc": "Môi trường làm việc",
	"đào tạo, bồi dưỡng": "Đào tạo & Bồi dưỡng",
	"cơ sở vật chất": "Cơ sở vật chất",
	"hạ tầng CNTT": "Hạ tầng CNTT",
	"CTĐT": "Chương trình đào tạo",
	"không xác định/không liên quan": "Khác",
};

export default function CommentItem({
	content,
	type,
	topic,
	type_list,
	classData,
	clickable = true,
	secondary = "",
}: {
	content: string;
	type: string;
	topic: string;
	type_list: string[];
	comment_id: string;
	class_id?: string;
	isLast: boolean;
	classData?: DeepPartial<Class> | null;
	clickable?: boolean;
	secondary?: ReactNode;
}) {
	const { setUrlQuery } = useFilterUrlQuery();
	const [isOpen, setIsOpen] = useState(false);

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					ease: "easeOut",
					duration: 0.4,
				}}
				className="w-full py-5 px-4 flex items-start gap-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
			>
				<div
					className={twMerge(
						"flex-shrink-0 w-1 self-stretch rounded-full transition-all duration-300 group-hover:w-1.5",
						type_list?.[0] === "positive"
							? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
							: type_list?.[0] === "negative"
							? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
							: "bg-slate-300"
					)}
				></div>
				<div className="flex-1 min-w-0 flex flex-col gap-3">
					<p className="font-medium text-primary-dark text-sm leading-relaxed whitespace-pre-wrap">
						{content}
					</p>
					{secondary ? secondary : null}
					<div className="flex flex-wrap gap-2 items-center mt-1">
						{topic ? (
							<Chip
								size="sm"
								variant="flat"
								className={twMerge(
									"border-none h-6",
									topic.toLowerCase().includes("viên") || topic === "lecturer" ? "bg-blue-100/50 text-blue-700" :
									topic.toLowerCase().includes("đào tạo") || topic === "training_program" || topic === "CTĐT" ? "bg-amber-100/50 text-amber-700" :
									topic.toLowerCase().includes("vật chất") || topic === "facility" || topic.toLowerCase().includes("cntt") ? "bg-indigo-100/50 text-indigo-700" :
									topic.toLowerCase().includes("môi trường") ? "bg-cyan-100/50 text-cyan-700" :
									"bg-slate-100 text-slate-600"
								)}
							>
								<span className="font-bold text-[10px] uppercase tracking-wider">
									{TOPIC_MAP[topic.toLowerCase() as keyof typeof TOPIC_MAP] || topic}
								</span>
							</Chip>
						) : null}
						{type_list?.map((t) => (
							<Chip
								size="sm"
								key={t}
								variant="flat"
								className={twMerge(
									"border-none h-6",
									t === "positive" ? "bg-emerald-100/50 text-emerald-700" :
									t === "negative" ? "bg-rose-100/50 text-rose-700" :
									"bg-slate-100 text-slate-600"
								)}
							>
								<span className="font-bold text-[10px] uppercase tracking-wider">
									{t == "positive" ? "Tích cực" : t == "negative" ? "Tiêu cực" : "Trung tính"}
								</span>
							</Chip>
						))}
					</div>
				</div>
				<Button
					isIconOnly
					aria-label="More options"
					variant="light"
					size="sm"
					onPress={() => setIsOpen(true)}
					className={twMerge("text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity", !clickable && "hidden")}
				>
					<IoEllipsisVertical size={18} />
				</Button>
			</motion.div>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Thông tin chi tiết về ý kiến
							</ModalHeader>
							<ModalBody>
								<div className=" flex flex-col gap-4">
									<CommentModalItem
										title="Học kỳ"
										value={classData?.semester?.display_name}
									/>
									<CommentModalItem
										title="Khoa/Bộ môn"
										value={
											classData?.subject?.faculty?.display_name
										}
										onClick={() => {
											setUrlQuery(
												`/faculty/${classData?.subject?.faculty?.faculty_id}`
											);
										}}
									/>
									<CommentModalItem
										title="Môn học"
										value={classData?.subject?.display_name}
										onClick={() => {
											setUrlQuery(
												`/subject/${classData?.subject?.display_name}`
											);
										}}
									/>
									<CommentModalItem
										title="Lớp"
										value={classData?.display_name}
										onClick={() => {
											setUrlQuery(
												`/class/${classData?.class_id}`
											);
										}}
									/>
									<CommentModalItem
										title="Giảng viên"
										value={classData?.lecturer?.display_name}
										onClick={() => {
											setUrlQuery(
												`/lecturer/${classData?.lecturer?.lecturer_id}`
											);
										}}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
