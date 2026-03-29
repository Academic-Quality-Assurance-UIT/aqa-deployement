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
import CommentModalItem from "./CommentModalItem";

const TOPIC_MAP = {
	lecturer: "Giảng viên",
	training_program: "Chương trình đào tạo",
	facility: "Cơ sở vật chất",
	others: "Khác",
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
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{
					ease: "easeOut",
					duration: 0.6,
				}}
				className="w-full py-3 flex items-center gap-4 border-b-1 border-b-slate-400"
			>
				<div
					className={` flex h-16 w-2 rounded-md ${
						type_list?.[0] === "positive"
							? "bg-green-300"
							: type_list?.[0] === "negative"
							? "bg-red-300"
							: "bg-slate-300"
					}`}
				></div>
				<div className=" mr-auto w-full flex flex-col gap-2">
					<p className="font-bold text-sm text-left whitespace-pre-wrap	">
						{content}
					</p>
					{secondary ? secondary : null}
					<div className=" flex gap-2">
						{topic ? <Chip
							size="sm"
							className={`w-24 ${
								topic == "lecturer"
									? "bg-blue-200"
									: topic == "training_program"
									? "bg-yellow-200"
									: topic == "facility"
									? "bg-purple-200"
									: "bg-slate-200"
							}`}
						>
							<p className=" px-1 py-1 capitalize font-medium text-xs">
								Chủ đề:{" "}
								<span>
									{TOPIC_MAP[topic as keyof typeof TOPIC_MAP] ||
										topic}
								</span>
							</p>
						</Chip> : null}
						{type_list?.map((t) => (
							<Chip
								size="sm"
								key={t}
								className={`w-24 ${
									t === "positive"
										? "bg-green-300 dark:bg-green-700"
										: t === "negative"
										? "bg-red-300 dark:bg-red-700"
										: "bg-slate-200"
								}`}
							>
								<p className=" px-1 py-1 capitalize font-medium text-xs">
									{t == "positive"
										? "Tích cực"
										: t == "negative"
										? "Tiêu cực"
										: "Trung tính"}
								</p>
							</Chip>
						))}
					</div>
				</div>
				<Button
					isIconOnly
					aria-label="Like"
					variant="flat"
					onPress={() => setIsOpen(true)}
					className={clickable ? "" : "hidden"}
				>
					<IoEllipsisVertical />
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
