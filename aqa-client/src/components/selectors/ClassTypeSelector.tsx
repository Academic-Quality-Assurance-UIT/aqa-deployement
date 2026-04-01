"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import OptionButton from "../OptionButton";

const CLASS_TYPES = [
	{ id: "", name: "Tất cả" },
	{ id: "LT", name: "Lý thuyết" },
	{ id: "TH1", name: "Thực hành 1" },
	{ id: "TH2", name: "Thực hành 2" },
	{ id: "Online", name: "Học online" },
];

export default function ClassTypeSelector({
	isNoBorder = false,
}: {
	isNoBorder?: boolean;
}) {
	const { query, setUrlQuery } = useFilterUrlQuery();
	const pathname = usePathname();
	const class_type = query.class_type || "";

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const currentSelectedRef = useRef<any>();

	const selectedType =
		CLASS_TYPES.find((t) => t.id === class_type) || CLASS_TYPES[0];
	const hasValue = Boolean(selectedType.id);
	const buttonText = selectedType.id ? selectedType.name : "Chọn loại tiêu chí";

	useEffect(() => {
		if (currentSelectedRef.current) {
			currentSelectedRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [isOpen]);

	return (
		<>
			<OptionButton
				onPress={onOpen}
				hasValue={hasValue}
				isNoBorder={isNoBorder}
			>
				{buttonText}
			</OptionButton>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				scrollBehavior="inside"
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<p>Chọn loại tiêu chí</p>
							</ModalHeader>
							<ModalBody className="pb-8 pt-3">
								{CLASS_TYPES.map(({ id, name }) => (
									<Button
										ref={
											id === class_type
												? currentSelectedRef
												: null
										}
										onPress={() => {
											setUrlQuery(pathname, {
												class_type: id,
											});
											onClose();
										}}
										variant={
											id === class_type ? "shadow" : "flat"
										}
										color={
											id === class_type
												? "primary"
												: "default"
										}
										className={`py-5`}
										key={id}
									>
										<p className="font-medium">{name}</p>
									</Button>
								))}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
