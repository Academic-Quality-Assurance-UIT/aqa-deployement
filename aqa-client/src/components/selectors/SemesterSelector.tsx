"use client";

import SemesterIcon from "@/assets/SemesterIcon";
import { useFilter } from "@/contexts/FilterContext";
import { Semester, useSemestersQuery } from "@/gql/graphql";
import useNavigate from "@/hooks/useNavigate";
import { useRememberValue } from "@/hooks/useRememberValue";
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

type FilterType = {
	lecturer_id?: string;
};

function SemesterSelector_({
	semester,
	setSemester,
	semesters,
	isNoBorder = false,
}: {
	semester?: Semester;
	setSemester: (d?: Semester) => any;
	semesters: Semester[];
} & SemesterPropType) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const currentSelectedRef = useRef<any>();

	const hasValue = Boolean(semester?.display_name);
	const buttonText = semester?.display_name || "Tất cả học kỳ";

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
								<p>Chọn học kỳ</p>
							</ModalHeader>
							<ModalBody className="pb-8 pt-3">
								{[
									{
										display_name: "Tất cả học kỳ",
										semester_id: "",
									},
									...semesters,
								].map(({ display_name, semester_id }) => (
									<Button
										ref={
											semester_id === semester?.semester_id
												? currentSelectedRef
												: null
										}
										onPress={() => {
											if (semester_id === "") {
												setSemester?.({
													display_name: "Tất cả học kỳ",
													semester_id: "",
												});
											} else {
												setSemester?.(
													semesters.find(
														(v) =>
															v.semester_id ===
															semester_id
													)
												);
											}
											onClose();
										}}
										variant={
											semester_id === semester?.semester_id
												? "shadow"
												: "flat"
										}
										color={
											semester_id === semester?.semester_id
												? "primary"
												: "default"
										}
										className={`py-5`}
										key={semester_id}
									>
										<p className="font-medium">{display_name}</p>
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

export default function SemesterSelector({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const { semester, setSemester } = useFilter();
	const { data } = useSemestersQuery();

	return (
		<SemesterSelector_
			semester={semester}
			setSemester={setSemester}
			semesters={data?.semesters || []}
			{...props}
		/>
	);
}

export function SemesterSelectorWithSearchParam({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const semesterId = searchParams.get("semester");

	const { data: semesters } = useSemestersQuery();
	const data = useRememberValue(semesters);

	const semester = useMemo<Semester | undefined>(() => {
		const semesterList = data?.semesters;
		if (semesterList?.length || 0 > 0) {
			if (semesterId)
				return semesterList?.find((v) => v.semester_id == semesterId);
		}
	}, [data?.semesters, semesterId]);
	// const semester = useRememberValue(semester_);

	const setSemester = useCallback(
		(semester: Semester | undefined) => {
			if (semester)
				navigate.replace({ semester: semester?.semester_id || "" });
		},
		[navigate]
	);

	return (
		<SemesterSelector_
			semester={semester}
			setSemester={setSemester}
			semesters={data?.semesters || []}
			{...props}
		/>
	);
}

type SemesterPropType = {
	isNoBorder?: boolean;
};
