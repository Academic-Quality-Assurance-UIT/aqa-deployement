"use client";

import { useFilter } from "@/contexts/FilterContext";
import { useProgramsQuery } from "@/gql/graphql";
import useNavigate from "@/hooks/useNavigate";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import OptionButton from "../OptionButton";

function ProgramSelector_({
	program,
	setProgram,
	isNoBorder = false,
}: {
	program?: string;
	setProgram?: (d: string) => any;
} & ProgramSelectorPropTypes) {
	const { data, loading: isLoading } = useProgramsQuery();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const currentSelectedRef = useRef<any>();

	const hasValue = Boolean(program);
	const buttonText = program || "Chương trình";

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
								<p>Chọn chương trình</p>
							</ModalHeader>
							<ModalBody className="pb-8 pt-3">
								{data && !isLoading ? (
									[
										{ program: "Tất cả", value: "" },
										...data.programs.map(
											({ program: programTitle }) => ({
												program: programTitle,
												value: programTitle,
											})
										),
									].map(({ program: programTitle, value }) => (
										<Button
											ref={
												programTitle === program
													? currentSelectedRef
													: null
											}
											onPress={() => {
												setProgram?.(value);
												onClose();
											}}
											variant={
												programTitle === program
													? "shadow"
													: "flat"
											}
											color={
												programTitle === program
													? "primary"
													: "default"
											}
											className={`py-5`}
											key={value}
										>
											<p className="font-medium">
												{programTitle}
											</p>
										</Button>
									))
								) : (
									<div className=" flex flex-row gap-3">
										<Spinner size="sm" />
										<p className=" text-sm font-medium">
											Đang tải
										</p>
									</div>
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default function ProgramSelector(props: ProgramSelectorPropTypes) {
	const { program, setProgram } = useFilter();

	return <ProgramSelector_ program={program} setProgram={setProgram} {...props} />;
}

export function ProgramSelectorWithSearchParam(props: ProgramSelectorPropTypes) {
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const program = useMemo(
		() => searchParams.get("program") || undefined,
		[searchParams]
	);

	const setProgram = useCallback(
		(program: string) => navigate.replace({ program }),
		[navigate]
	);

	return <ProgramSelector_ program={program} setProgram={setProgram} {...props} />;
}

type ProgramSelectorPropTypes = {
	isNoBorder?: boolean;
};
